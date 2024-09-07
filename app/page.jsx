import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/dashboard");

  return (
    <main
      className="bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          'url("https://img.freepik.com/free-photo/desk-concept-frame-with-items_23-2148604882.jpg")',
      }}
    >
      <LoginForm />
    </main>
  );
}
