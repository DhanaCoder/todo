import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/dashboard");

  return (
    <main className="bg-cover bg-center h-screen flex items-center justify-center" style={{ backgroundImage: 'url("https://wallpapers.com/images/hd/4k-laptop-close-up-keyboard-ltv40n7anazul43s.jpg")' }}>
      <LoginForm />
    </main>
  );
}
