"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation'; // Import useParams from next/navigation
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function TodoEditForm() {
    const { data: session } = useSession();
    const router = useRouter();
    const { id } = useParams(); // Extract id from useParams

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return; // Exit early if id is not available

        if (session?.user?.email) {
            setEmail(session.user.email);
        }

        const fetchTodo = async () => {
            try {
                const response = await fetch(`/api/todos/${id}`);
                if (response.ok) {
                    const { foundTodo } = await response.json();
                    setTitle(foundTodo.title);
                    setDescription(foundTodo.description);
                    setStatus(foundTodo.status);
                } else {
                    toast.error('Error fetching TODO');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('Error fetching TODO');
            } finally {
                setLoading(false);
            }
        };

        fetchTodo();
    }, [id, session]); // Dependency array includes 'id' and 'session'

    const handleSubmit = async (event) => {
        event.preventDefault();

        const updatedTodoData = { title, description, status, email };

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ formData: updatedTodoData }),
            });

            if (response.ok) {
                toast.success('TODO updated successfully!');
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1000);
            } else {
                toast.error('Error updating TODO');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error updating TODO');
        }
    };

    if (loading) return <p>Loading...</p>; // Display loading state

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-8 border-4 border-blue-600">
            <h2 className="text-2xl font-bold mb-4">Edit TODO</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-gray-700 font-semibold mb-1">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-gray-700 font-semibold mb-1">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="status" className="block text-gray-700 font-semibold mb-1">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="todo">TODO</option>
                        <option value="in progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Update
                    </button>
                    <Link
                        href="/dashboard"
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Back
                    </Link>
                </div>
            </form>
        </div>
    );
}
