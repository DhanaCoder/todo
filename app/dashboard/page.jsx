"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserInfo from "@/components/UserInfo";
import TodoCard from "@/components/TodoCard";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
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

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <UserInfo />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your TODOs</h2>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg mb-4 md:mb-0"
          />
          
          {/* Status Filters */}
          <div className="flex flex-wrap space-y-2 md:space-y-0 md:space-x-4">
            {["all", "todo", "in progress", "done"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 md:flex-none px-4 py-2 rounded-lg ${
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TodoCard key={todo._id} todo={todo} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No TODOs found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
