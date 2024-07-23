import Todo from "@/models/todo";
import { NextResponse } from "next/server";

// Fetch all todos
export async function GET(req) {
    try {
      const url = new URL(req.url);
      const email = url.searchParams.get('email'); // Extract the email parameter
  
      if (!email) {
        return NextResponse.json({ message: "Email query parameter is required" }, { status: 400 });
      }
  
      // Find todos that match the email
      const todos = await Todo.find({ email });
  
      return NextResponse.json({ todos }, { status: 200 });
    } catch (error) {
      console.error("Error fetching todos:", error);
      return NextResponse.json({ message: "Error fetching todos", error }, { status: 500 });
    }
  }

// Create a new todo
export async function POST(req) {
    try {
      const body = await req.json();
      console.log('Received data:', body); // Check this log
      
      if (!body.title || !body.description || !body.email) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
      }
      
      await Todo.create(body);
      
      return NextResponse.json({ message: "Todo Created" }, { status: 201 });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ message: "Error creating todo", err }, { status: 500 });
    }
  }
  
  
