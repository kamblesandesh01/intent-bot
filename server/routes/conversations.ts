import { RequestHandler } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/Message";
import { connectDB } from "../db";
import {
  CreateConversationSchema,
  AddMessageSchema,
  UpdateConversationTitleSchema,
} from "../../shared/validation";

export const createConversation: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    // Validate request body
    const validation = CreateConversationSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const { title } = validation.data;
    const userId = (req as any).userId; // From auth middleware

    const conversation = new Conversation({
      userId,
      title: title || "New Chat",
      messageIds: [],
      messageCount: 0,
      lastMessageAt: null,
    });

    await conversation.save();

    res.status(201).json({
      message: "Conversation created",
      conversation: {
        _id: conversation._id,
        title: conversation.title,
        messages: [],
        messageCount: 0,
      },
    });
  } catch (error) {
    console.error("Create conversation error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to create conversation",
    });
  }
};

export const listConversations: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const userId = (req as any).userId; // From auth middleware

    const conversations = await Conversation.find({
      userId,
    })
      .select("_id title createdAt updatedAt")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      conversations: conversations.map((conv) => ({
        _id: conv._id,
        title: conv.title,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      })),
    });
  } catch (error) {
    console.error("List conversations error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to list conversations",
    });
  }
};

export const getConversation: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const { conversationId } = req.params;
    const userId = (req as any).userId; // From auth middleware

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    if (conversation.userId !== userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    // Fetch all messages for this conversation
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    res.json({
      conversation: {
        _id: conversation._id,
        title: conversation.title,
        messages: messages,
        messageCount: messages.length,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to get conversation",
    });
  }
};

export const addMessage: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const { conversationId } = req.params;
    const userId = (req as any).userId; // From auth middleware

    // Validate request body
    const validation = AddMessageSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const { content, role, intent, confidence } = validation.data;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    if (conversation.userId !== userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    // Create new message document (role from body: "user" | "assistant")
    const message = new Message({
      conversationId,
      role: role ?? "user",
      content,
      intent,
      confidence,
    });

    await message.save();

    // Update conversation with message reference
    conversation.messageIds.push(message._id.toString());
    conversation.messageCount = conversation.messageIds.length;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Fetch all messages for response
    const allMessages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    res.json({
      message: "Message added",
      conversation: {
        _id: conversation._id,
        title: conversation.title,
        messages: allMessages,
        messageCount: allMessages.length,
      },
    });
  } catch (error) {
    console.error("Add message error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to add message",
    });
  }
};

export const deleteConversation: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const { conversationId } = req.params;
    const userId = (req as any).userId; // From auth middleware

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    if (conversation.userId !== userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await Conversation.findByIdAndDelete(conversationId);

    res.json({ message: "Conversation deleted" });
  } catch (error) {
    console.error("Delete conversation error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to delete conversation",
    });
  }
};

export const updateConversationTitle: RequestHandler = async (req, res) => {
  try {
    await connectDB();

    const { conversationId } = req.params;
    const userId = (req as any).userId; // From auth middleware

    // Validate request body
    const validation = UpdateConversationTitleSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const { title } = validation.data;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    if (conversation.userId !== userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    conversation.title = title;
    await conversation.save();

    res.json({
      message: "Title updated",
      conversation: {
        _id: conversation._id,
        title: conversation.title,
      },
    });
  } catch (error) {
    console.error("Update title error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to update title",
    });
  }
};
