"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import UserInfo from "@/components/UserInfo";
import TodoCard from "@/components/TodoCard";
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") router.push("/");
  }, [status]);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchTodos = async () => {
        try {
          const response = await fetch(`/api/todos?email=${session.user.email}`);
          const data = await response.json();
          setTodos(data.todos);
        } catch (error) {
          console.error("Error fetching todos:", error);
        }
      };

      fetchTodos();
    }
  }, [session?.user?.email]);

  useEffect(() => {
    // Filter todos based on search query
    let filtered = todos;

    if (searchQuery) {
      filtered = filtered.filter((todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTodos(filtered);
  }, [todos, searchQuery]);

const handleDragEnd = async (result) => {
  const { source, destination } = result;

  // If there's no destination (i.e., drop outside a droppable area), exit early.
  if (!destination) return;

  // Get the todo item that was dragged based on the draggableId
  const movedTodo = todos.find((todo) => todo._id === result.draggableId);

  // If no todo was found for the given draggableId, log an error and exit early
  if (!movedTodo) {
    console.error("Todo not found for the given draggableId.");
    return;
  }

  // Get the new status from the droppableId (which corresponds to the status category)
  const updatedStatus = destination.droppableId;

  // If the status hasn't changed, no need to update
  if (movedTodo.status === updatedStatus) return;

  // Create a new todo object with the updated status
  const updatedTodo = { ...movedTodo, status: updatedStatus };

  // Update the todos state locally by updating the specific todo's status
  const updatedTodos = todos.map((todo) =>
    todo._id === movedTodo._id ? updatedTodo : todo
  );
  setTodos(updatedTodos);

  // Update the status on the backend by calling the API
  try {
    const response = await fetch(`/api/todos/${movedTodo._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: updatedStatus }), // Only update the status field
    });

    // Check if the update was successful
    if (response.ok) {
      toast.success("TODO updated successfully!");
    } else {
      // If the API responds with an error, notify the user and revert the change
      toast.error("Error updating TODO");
    }
  } catch (error) {
    console.error("Error:", error);
    toast.error("Error updating TODO");
  }
};


  const refreshTodos = async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch(`/api/todos?email=${session.user.email}`);
        const data = await response.json();
        setTodos(data.todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader relative w-12 h-12">
          <div className="absolute w-3 h-3 bg-gray-800 rounded-full top-0 left-0"></div>
          <div className="absolute w-3 h-3 bg-gray-800 rounded-full top-0 right-0"></div>
          <div className="absolute w-3 h-3 bg-gray-800 rounded-full bottom-0 left-0"></div>
          <div className="absolute w-3 h-3 bg-gray-800 rounded-full bottom-0 right-0"></div>
        </div>
      </div>
    );
  }

  const statusCategories = ["todo", "in progress", "done"];

return (
  <DragDropContext onDragEnd={handleDragEnd}>
    <div className="pt-24 p-2 md:p-8 lg:p-15">
      {" "}
      {/* Adjust padding-top to prevent overlap with the fixed navbar */}
      <UserInfo />
      <h2 className="text-xl md:text-2xl font-bold mb-4 pt-10">Your TODOs</h2>
      <div className="mb-2">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/4 p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="flex flex-col lg:flex-row lg:space-x-4">
        {statusCategories.map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 p-4 rounded-lg shadow-md flex-1 mb-4 lg:mb-0"
              >
                <h3 className="text-lg md:text-xl font-semibold mb-4">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </h3>
                {filteredTodos
                  .filter((todo) => todo.status === status)
                  .map((todo, index) => (
                    <TodoCard
                      key={todo._id}
                      todo={todo}
                      index={index}
                      refreshTodos={refreshTodos}
                    />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </div>
  </DragDropContext>
);

}
