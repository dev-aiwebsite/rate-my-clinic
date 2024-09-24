"use client"
export default function ProfileButton() {
    const handleClick = () => {
    }

    return (
        <button className="w-full ring-1 ring-gray-200 px-6 py-2 rounded-lg text-gray-400 text-sm hover:bg-appblue-200 hover:text-appblue-400" onClick={handleClick}>Settings</button>
    );
}