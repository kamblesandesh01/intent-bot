import mongoose from "mongoose";
import Intent from "../models/Intent";
import { connectDB } from "../db";

const defaultIntents = [
  {
    name: "greeting",
    description: "User says hello or initiates a social greeting",
    keywords: ["hello", "hi", "hey", "greetings", "welcome", "howdy"],
    category: "greeting",
    color: "#3b82f6", // blue
    confidence_threshold: 0.7,
  },
  {
    name: "question",
    description: "User asks a question or seeks information",
    keywords: ["what", "why", "how", "when", "where", "who", "which", "can you", "could you"],
    category: "question",
    color: "#8b5cf6", // purple
    confidence_threshold: 0.65,
  },
  {
    name: "request",
    description: "User makes a request or asks for an action",
    keywords: ["please", "can", "could", "would", "will you", "help me", "show me", "tell me"],
    category: "request",
    color: "#ec4899", // pink
    confidence_threshold: 0.6,
  },
  {
    name: "feedback",
    description: "User gives feedback, thanks, or expresses sentiment",
    keywords: ["good", "bad", "great", "terrible", "love", "hate", "like", "dislike", "thanks", "thank you"],
    category: "feedback",
    color: "#f59e0b", // amber
    confidence_threshold: 0.7,
  },
  {
    name: "help",
    description: "User needs help, support, or reports an issue",
    keywords: ["help", "support", "issue", "problem", "bug", "error", "fix", "broken"],
    category: "help",
    color: "#ef4444", // red
    confidence_threshold: 0.75,
  },
  {
    name: "unknown",
    description: "Unrecognized or unclear user intent",
    keywords: [],
    category: "other",
    color: "#6b7280", // gray
    confidence_threshold: 0.0,
  },
];

async function seedIntents() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Clear existing intents
    await Intent.deleteMany({});
    console.log("Cleared existing intents");

    // Insert default intents
    const result = await Intent.insertMany(defaultIntents);
    console.log(`Successfully seeded ${result.length} intents`);

    // List all intents
    const allIntents = await Intent.find({});
    console.log("\nSeeded intents:");
    allIntents.forEach((intent) => {
      console.log(`  - ${intent.name} (${intent.category}): ${intent.keywords.join(", ")}`);
    });
  } catch (error) {
    console.error("Error seeding intents:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

seedIntents();
