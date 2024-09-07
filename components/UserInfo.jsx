"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avatar from "react-avatar"; // Import Avatar component

export default function UserInfo() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: "/" });
    toast.success("Logged out successfully!");
    router.push("/");
  };

  const handleTodoClick = () => {
    router.push("/todo");
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="flex justify-between items-center w-full p-4 fixed top-0 left-0 bg-[#440089] z-50 text-white">
      <div className="text-lg font-bold">Voosh-TodoPage</div>
      {session && (
        <div className="flex flex-col md:flex-row items-center justify-between w-1/2 md:w-auto">
          {/* Create TODO Button */}
          <button
            onClick={handleTodoClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded mb-4 md:mb-0"
          >
            Create TODO
          </button>

          {/* Dropdown for smaller screens */}
          <div className="relative md:hidden" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded"
            >
              Menu
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg z-10">
                <div className="px-4 py-2 flex items-center">
                  <Avatar
                    name={session.user.name}
                    email={session.user.email}
                    size="40"
                    round={true}
                    className="mr-2"
                  />
                  <div>
                    <span className="block font-semibold">
                      {session.user.name}
                    </span>
                    {/* <span className="block text-gray-400">
                      {session.user.email}
                    </span> */}
                  </div>
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

          {/* Larger screen menu */}
          <div className="hidden md:flex items-center space-x-4 ml-4">
            <Avatar
              name={session.user.name}
              email={session.user.email}
              size="40"
              round={true}
              className="mr-2"
            />
            <div className="flex flex-col md:flex-row items-center">
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
