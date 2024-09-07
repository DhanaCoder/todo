"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify

export default function UserInfo() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // State for dropdown

  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: "/" });
    toast.success("Logged out successfully!"); // Show toast notification
    router.push("/");
  };

  const handleTodoClick = () => {
    router.push("/todo"); // Redirect to TODO creation page
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex flex-col md:flex-row items-between justify-between rounded-lg w-full fixed top-0 left-0 z-50">
      <div className="text-lg font-bold mb-4 md:mb-0">Voosh-TodoPage</div>
      {session && (
        <div className="flex flex-col md:flex-row items-between">
          {/* Create TODO Button */}
          <button
            onClick={handleTodoClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
          >
            Create TODO
          </button>

          {/* Dropdown for smaller screens */}
          <div className="relative md:hidden mt-2">
            <button
              onClick={toggleDropdown}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-10 py-2 rounded"
            >
              Menu
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg z-10">
                <div className="px-4 py-2">
                  <span className="block font-semibold">
                    {session.user.name}
                  </span>
                  <span className="block text-gray-400">
                    {session.user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>

          {/* Visible on larger screens */}
          <div className="hidden md:flex items-center space-x-4 ml-4">
            <div className="flex flex-col items-center md:flex-row md:items-center">
              <span className="font-semibold mr-2">{session.user.name}</span>
              <span className="text-gray-400">({session.user.email})</span>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
