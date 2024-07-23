"use client";

import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Linkify from "react-linkify";
import Link from "next/link";
import { toast } from 'react-toastify';

const TRUNCATE_LENGTH = 20; // Define a maximum length for truncation

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};

const TodoCard = ({ todo, index }) => {
  const { data: session } = useSession();
  const router = useRouter();

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

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this TODO?')) {
      try {
        const response = await fetch(`/api/todos/${todo._id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('TODO deleted successfully!');
          router.refresh(); // Refresh the page to reflect the changes
        } else {
          toast.error('Error deleting TODO');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error deleting TODO');
      }
    }
  };

  return (
    <Draggable draggableId={todo._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="max-w-md mx-auto bg-white rounded-lg shadow-md border border-gray-200 my-4 p-4"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {truncateText(todo.title, TRUNCATE_LENGTH)}
          </h3>
          <p className="text-gray-600 mb-2">
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
              {truncateText(todo.description, TRUNCATE_LENGTH)}
            </Linkify>
          </p>
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

          <div className="flex items-center justify-between mt-4">
            <Link href={`/todoEdit/${todo._id}`} className="text-blue-600 hover:underline">
              Edit
            </Link>
            <Link href={`/todoView/${todo._id}`} className="text-blue-600 hover:underline">
              View
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TodoCard;
