import { useSession } from "next-auth/react";

export default function UserPage() {
  const { data: session } = useSession();
  return <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold mb-6">Welcome {session?.user?.name} 😊</h2>
  </div>;
}
