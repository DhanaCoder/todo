"use client";

import { useState, useEffect } from "react";
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
  const [statusFilter, setStatusFilter] = useState("todo"); // Default to "todo"
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
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
    // Filter todos based on status and search query
    let filtered = todos;

    if (statusFilter !== "all") {
      filtered = filtered.filter((todo) => todo.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter((todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTodos(filtered);
  }, [todos, statusFilter, searchQuery]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const movedTodo = todos[source.index];
    const updatedTodos = Array.from(todos);

    // Remove the dragged item from the source list
    updatedTodos.splice(source.index, 1);
    // Add the item back in the new position
    updatedTodos.splice(destination.index, 0, movedTodo);

    // Update the state with new order
    setTodos(updatedTodos);

    // Update the status of the moved TODO
    try {
      const response = await fetch(`/api/todos/${movedTodo._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: destination.droppableId }),
      });

      if (response.ok) {
        toast.success('TODO updated successfully!');
      } else {
        toast.error('Error updating TODO');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating TODO');
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const statusCategories = ["todo", "in progress", "done"];

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="p-6">
        <UserInfo />
        <h2 className="text-2xl font-bold mb-4">Your TODOs</h2>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/4 p-2 border border-gray-300 rounded-lg mb-4 md:mb-0"
          />

          {/* Status Filters */}
          <div className="flex flex-wrap space-y-2 md:space-y-0 md:space-x-4">
            {statusCategories.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          {statusCategories.map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-semibold mb-4">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </h3>
                  {filteredTodos
                    .filter((todo) => todo.status === status)
                    .map((todo, index) => (
                      <TodoCard key={todo._id} todo={todo} index={index} />
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
