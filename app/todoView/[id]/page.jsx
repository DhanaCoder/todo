"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // For accessing route params
import { toast } from "react-toastify";
import Linkify from "react-linkify";

export default function TodoView() {
  const { id } = useParams(); // Extract the TODO ID from the URL
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await fetch(`/api/todos/${id}`);
        if (response.ok) {
          const { foundTodo } = await response.json();
          setTodo(foundTodo);
        } else {
          toast.error("Error fetching TODO");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching TODO");
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="loader relative w-12 h-12">
        <div className="absolute w-3 h-3 bg-gray-800 rounded-full top-0 left-0"></div>
        <div className="absolute w-3 h-3 bg-gray-800 rounded-full top-0 right-0"></div>
        <div className="absolute w-3 h-3 bg-gray-800 rounded-full bottom-0 left-0"></div>
        <div className="absolute w-3 h-3 bg-gray-800 rounded-full bottom-0 right-0"></div>
      </div>
    </div>
  );

  if (!todo) return <p>TODO not found.</p>;

  const createdDateTime = new Date(todo.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const updateDateTime = new Date(todo.updatedAt).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-8 border-4 border-blue-600">
      <h2 className="text-xl md:text-2xl font-bold mb-4">TODO Details</h2>
      <div className="space-y-4">
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Title:</span> {todo.title}
        </p>
        <div className="text-gray-600 mb-2">
          <span className="font-semibold">Description:</span>
          <div className="mt-2 p-2 border border-gray-200 rounded">
            <Linkify
              componentDecorator={(href, text, key) => (
                <a
                  href={href}
                  key={key}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {text}
                </a>
              )}
            >
              <div
                style={{
                  maxHeight: "200px", // Adjust this height as needed
                  overflowY: "auto",
                }}
              >
                {todo.description}
              </div>
            </Linkify>
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-2">
          <span className="font-semibold">Created:</span> {createdDateTime}
        </p>
        <p className="text-gray-500 text-sm mb-2">
          <span className="font-semibold">Updated:</span> {updateDateTime}
        </p>
        <p className="text-gray-500 text-sm mb-2">
          <span className="font-semibold">Status:</span> {todo.status}
        </p>
        <p className="text-gray-500 text-sm mb-2">
          <span className="font-semibold">Email:</span> {todo.email}
        </p>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Back
        </button>
      </div>
    </div>
  );
}
