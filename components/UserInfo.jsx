"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify

export default function UserInfo() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: "/" });
    toast.success("Logged out successfully!"); // Show toast notification
    router.push("/");
  };

  const handleTodoClick = () => {
    router.push("/todo"); // Redirect to TODO creation page
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex flex-col md:flex-row items-center justify-between">
      <div className="text-lg font-bold mb-4 md:mb-0">Voosh-TodoPage</div>
      {session && (
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
          <button
            onClick={handleTodoClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded"
          >
            TODO
          </button>
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
      )}
    </nav>
  );
}
