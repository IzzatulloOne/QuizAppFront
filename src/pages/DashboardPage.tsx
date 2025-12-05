import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
    const {user} = useAuth()

  return (
    <div className="flex h-[calc(100vh-270px)] bg-gray-50">
       <h2>hi {user?.username}</h2>
    </div>
  );
}
