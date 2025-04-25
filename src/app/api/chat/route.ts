import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

// Initialize with API key
const apiKey = process.env.GEMINI_API_KEY || ""
console.log("API Key configured:", apiKey ? "Yes" : "No")
console.log("API Key length:", apiKey.length)

const genAI = new GoogleGenerativeAI(apiKey)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Received request body:", body)
    
    const { message, history } = body

    if (!message) {
      console.error("No message provided")
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set")
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    // Get the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    })

    // Prepare the chat history
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }))

    console.log("Formatted chat history:", formattedHistory)

    // Start a new chat with the history
    const chat = model.startChat({
      history: formattedHistory,
    })

    console.log("Sending message to Gemini API:", message)
    // Generate response
    const result = await chat.sendMessage(message)
    const response = await result.response
    const text = response.text()
    console.log("Received response from Gemini API:", text)

    // Update the history with the new messages
    const updatedHistory = [
      ...(history || []),
      { role: "user", content: message },
      { role: "assistant", content: text }
    ]

    return NextResponse.json({ 
      response: text,
      history: updatedHistory
    })
  } catch (error: any) {
    console.error("Chat error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause
    })
    
    // Check for specific error types
    if (error.message.includes("invalid token")) {
      return NextResponse.json(
        { error: "Invalid API key. Please check your Gemini API key configuration." },
        { status: 401 }
      )
    }

    if (error.message.includes("quota")) {
      return NextResponse.json(
        { error: "API quota exceeded. Please try again later." },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    )
  }
} 