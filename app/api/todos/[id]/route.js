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
// PUT request to update a TODO by ID
export async function PUT(req, { params }) {
    await connectToDatabase();
    const { id } = params;

    try {
        const body = await req.json();
        const { status } = body; // Expect status field

        // Update the TODO's status
        const updatedTodo = await Todo.findByIdAndUpdate(id, { status }, { new: true });
        return NextResponse.json({ message: "Todo updated", updatedTodo }, { status: 200 });
    } catch (error) {
        console.error("Error updating todo:", error);
        return NextResponse.json({ message: "Error updating todo", error }, { status: 500 });
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
