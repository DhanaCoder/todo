"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are necessary.");
      return;
    }

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        toast.error("User already exists.");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        toast.success("Registration successful! Redirecting...");
        const form = e.target;
        form.reset();
        setTimeout(() => {
          router.push("/");
        }, 2000); // Redirect after 2 seconds to show the toast
      } else {
        toast.error("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
      toast.error("An error occurred during registration.");
    }
  };

  return (
    <main className="bg-cover bg-center h-screen flex items-center justify-center" style={{ backgroundImage: 'url("https://wallpapers.com/images/hd/4k-laptop-close-up-keyboard-ltv40n7anazul43s.jpg")' }}>
      <div className="shadow-lg p-5 rounded-lg border-4 border-blue-600  bg-opacity-50">
        <h1 className="text-xl font-bold my-4">Register</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
            className="p-2 border border-black rounded-lg bg-transparent focus:bg-transparent placeholder-black"
            required
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="p-2 border border-black rounded-lg bg-transparent focus:bg-transparent placeholder-black"
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="p-2 border border-black rounded-lg bg-transparent focus:bg-transparent placeholder-black"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold cursor-pointer px-6 py-2 rounded-lg"
          >
            Register
          </button>

          <Link className="text-sm mt-3 text-right" href="/">
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </main>
  );
}
