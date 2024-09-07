import Todo from "@/models/todo";
import { NextResponse } from "next/server";
import mongoose from "mongoose"; // Import mongoose

// Ensure MongoDB connection is established
const connectToDatabase = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
};

// GET request to fetch a TODO by ID
export async function GET(request, { params }) {
    await connectToDatabase();
    const { id } = params;

    try {
        const foundTodo = await Todo.findById(id);
        return NextResponse.json({ foundTodo }, { status: 200 });
    } catch (error) {
        console.error("Error fetching todo:", error);
        return NextResponse.json({ message: "Error fetching todo", error }, { status: 500 });
    }
}

// PUT request to update a TODO by ID
export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { title, description, status } = body;
    const todoId = params.id; // Assuming you are passing the todo ID in the URL parameters

    console.log("Updating TODO:", { title, description, status });

    if (!title && !description && !status) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      );
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { title, description, status },
      { new: true } // Return the updated document
    );

    if (!updatedTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Todo Updated", todo: updatedTodo },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error updating todo", err },
      { status: 500 }
    );
  }
}




// DELETE request to delete a TODO by ID
export async function DELETE(req, { params }) {
    await connectToDatabase();
    const { id } = params;

    try {
        await Todo.findByIdAndDelete(id);
        return NextResponse.json({ message: "Todo Deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting todo:", error);
        return NextResponse.json({ message: "Error deleting todo", error }, { status: 500 });
    }
}


