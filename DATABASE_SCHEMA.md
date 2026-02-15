# MongoDB Database Schema

## Overview

The intent-bot application uses a normalized MongoDB schema with the following collections for scalability and maintainability.

## Collections

### 1. **Users** (`users`)
Stores user account information.

```typescript
{
  _id: ObjectId,
  email: string (unique, required),
  password?: string (hashed, optional - only for email/password auth),
  provider?: "local" | "github" | "google",
  providerId?: string (unique per provider),
  avatar?: string (URL),
  displayName?: string,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email: 1` (unique)
- `providerId: 1` (unique, sparse)
- `createdAt: -1`

**Usage:**
- Login/signup with email & password
- OAuth provider linking
- User profile management

---

### 2. **Sessions** (`sessions`)
Stores active user sessions with automatic expiration.

```typescript
{
  _id: ObjectId,
  sessionId: string (unique),
  userId: ObjectId (foreign key to users),
  expiresAt: Date (TTL index for auto-deletion),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `sessionId: 1` (unique)
- `userId: 1`
- `expiresAt: 1` (TTL index - auto-deletes after expiration)

**Usage:**
- Session-based authentication
- Cookies store `sessionId`
- Auto-cleanup after 7 days

---

### 3. **Conversations** (`conversations`)
Stores chat conversation metadata.

```typescript
{
  _id: ObjectId,
  userId: ObjectId (foreign key to users),
  title: string,
  messageIds: [string] (references to Message._id),
  messageCount: number (denormalized for quick stats),
  lastMessageAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId: 1, createdAt: -1`
- `userId: 1, updatedAt: -1`
- `messageIds: 1`

**Usage:**
- Chat conversation containers
- Conversation list display
- Message count aggregation
- Conversation deletion (cascades to messages)

**Important:**
- `messageIds` stores references to Message documents for normalization
- `messageCount` is denormalized for quick stat queries (should be synchronized)
- When deleting a conversation, also delete all referenced messages

---

### 4. **Messages** (`messages`)
Stores individual chat messages.

```typescript
{
  _id: ObjectId,
  conversationId: ObjectId (foreign key to conversations),
  role: "user" | "assistant",
  content: string,
  intent?: string (intent name),
  confidence?: number (0-1),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `conversationId: 1, createdAt: 1` (compound index for efficient sorting)
- `conversationId: 1` (for message listing)
- `createdAt: -1`

**Usage:**
- Message storage (messages don't embed in conversations)
- Intent detection results
- Message history retrieval
- Pagination support via createdAt

**Performance:**
- Compound index enables efficient queries like: `Messages.find({conversationId}).sort({createdAt: 1})`
- Avoids array growth problems with embedded messages
- Enables independent message operations

---

### 5. **Intents** (`intents`)
Stores intent definitions for classification.

```typescript
{
  _id: ObjectId,
  name: string (unique),
  keywords: [string],
  category: string,
  color: string (hex color),
  confidence_threshold: number (0-1),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `name: 1` (unique)
- `category: 1`

**Default Intents:**
- `greeting` - Greeting messages (hi, hello, etc.)
- `question` - Information requests (what, why, how, etc.)
- `request` - Action requests (please do, can you, etc.)
- `feedback` - Sentiment expressions (good, bad, thanks, etc.)
- `help` - Support requests (bug, issue, error, etc.)
- `unknown` - Unclassified messages

**Usage:**
- Intent classification reference
- Display intent badges with colors
- Confidence threshold for classification
- Intent statistics and analytics

---

## Relationships

```
Users (1) ←→ (Many) Sessions
Users (1) ←→ (Many) Conversations
Conversations (1) ←→ (Many) Messages
Intents (Referenced) ← Messages (intent field)
```

## Cascade Operations

### Delete Conversation
```typescript
1. Delete all Messages where conversationId = conversation._id
2. Delete the Conversation document
3. Update User.conversationCount (if implemented)
```

### Delete User
```typescript
1. Delete all Sessions where userId = user._id
2. Delete all Conversations where userId = user._id
3. Delete all Messages for those conversations
4. Delete the User document
```

## Optimization Tips

### Message Pagination
```typescript
// Fetch messages with pagination
const page = 1;
const pageSize = 50;
const skip = (page - 1) * pageSize;

const messages = await Message.find({ conversationId })
  .sort({ createdAt: 1 })
  .skip(skip)
  .limit(pageSize);
```

### Conversation Statistics
```typescript
// Get conversation count and message count for user
const stats = await Conversation.aggregate([
  { $match: { userId } },
  { $group: {
      _id: "$userId",
      conversationCount: { $sum: 1 },
      totalMessages: { $sum: "$messageCount" }
    }
  }
]);
```

### Message Search
```typescript
// Search messages by content (requires text index)
const results = await Message.find({
  $text: { $search: "search term" },
  conversationId
});
```

## Data Integrity

### Message Count Synchronization
The `messageCount` field on Conversation is denormalized for performance. To maintain accuracy:

```typescript
// Sync message count for a conversation
const count = await Message.countDocuments({ conversationId });
await Conversation.updateOne(
  { _id: conversationId },
  { messageCount: count }
);
```

### Orphaned Messages
If a Conversation is deleted but Messages remain:

```typescript
// Clean up orphaned messages
const validConversationIds = await Conversation.distinct("_id");
await Message.deleteMany({
  conversationId: { $nin: validConversationIds }
});
```

## Seed Data

### Seed Default Intents
```bash
pnpm seed:intents
```

This populates the Intents collection with default intent definitions for message classification.

## Migration from Old Schema

If migrating from embedded messages:

```typescript
// 1. Create messages from embedded array
for (const conv of conversations) {
  for (const msg of conv.messages) {
    await Message.create({
      conversationId: conv._id,
      role: msg.role,
      content: msg.content,
      intent: msg.intent,
      confidence: msg.confidence,
      createdAt: msg.timestamp || new Date()
    });
  }
}

// 2. Update conversations with messageIds
for (const conv of conversations) {
  const messages = await Message.find({ conversationId: conv._id });
  await Conversation.updateOne(
    { _id: conv._id },
    {
      messageIds: messages.map(m => m._id.toString()),
      messageCount: messages.length
    }
  );
}

// 3. Remove old messages field from conversations
await Conversation.updateMany(
  {},
  { $unset: { messages: 1 } }
);
```

## Security Considerations

- User passwords are hashed with bcryptjs
- Sessions auto-expire after 7 days
- Message queries are scoped to authenticated user's conversations
- API endpoints validate conversationId ownership before allowing access
- MongoDB connection string stored in environment variables
