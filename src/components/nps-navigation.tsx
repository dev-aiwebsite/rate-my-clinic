"use client"
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function NpsNavButtonGroup({className}: {className?: string}) {

    const pathname = usePathname();

    return (
        
    <div className={`${className} col-span-3 row-span-1 flex flex-row items-center justify-between`}>
        <h1>Recommendations</h1>
        <div className="flex-1 max-w-lg grid gap-[1px] grid-cols-4 divide-x *:border-none rounded-xl overflow-hidden ring-1 ring-gray-300 *:py-2 *:px-1 *:block text-sm text-neutral-500 *:text-center *:bg-white bg-gray-300">
          <Link className={pathname === '/dashboard/nps/strategy' ? '!bg-orange-400 text-white' : ''} href="/dashboard/nps/strategy">Strategy</Link>
          <Link className={pathname === '/dashboard/nps/finance' ? '!bg-orange-400 text-white' : ''} href="/dashboard/nps/finance">Finance</Link>
          <Link className={pathname === '/dashboard/nps/team' ? '!bg-orange-400 text-white' : ''} href="/dashboard/nps/team">Team</Link>
          <Link className={pathname === '/dashboard/nps/clients' ? '!bg-orange-400 text-white' : ''} href="/dashboard/nps/clients">Clients</Link>
        </div>
    </div>
      
    );
}