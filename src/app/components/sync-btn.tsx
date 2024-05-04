"use client"
import Image from "next/image";

export default function SyncButton() {
    const handleClick = () => {
        console.log('Button clicked!');
        // Add your custom logic here
    };


    return (
        
        <div className="flex flex-row gap-4 justify-center items-center">
        <button className="py-1 px-4 rounded bg-orange-400 cursor-pointer hover:bg-orange-500 text-white" onClick={handleClick}>Sync</button>
        <Image
        className="w-5 h-5"
      src="/icons/sync.svg"
      alt="sync icon"
      width={16}
      height={16}
      priority
    />
    <span className="text-gray-400 text-xs">Fetching data..</span>
    </div>
    );
}