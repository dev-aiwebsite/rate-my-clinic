import { handleLogout } from "lib/server-actions";

// src/app/components/logout-btn.tsx
export default function LogoutBtn({className}:{className?: string}) {
  return (
    <form action={handleLogout}>
      <button className={`${className} w-full ring-1 ring-gray-200 px-6 py-2 rounded-lg text-gray-400 text-sm hover:bg-appblue-200 hover:text-appblue-400`} type="submit">
        Logout
      </button>
    </form>
  );
}