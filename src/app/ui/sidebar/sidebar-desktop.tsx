import Image from "next/image"
import LogoutBtn from "../../../components/logout-btn"
import Link from "next/link"

type list_item = {
    name: string;
    icon: string;
    link: string;
    attr?: any;
}[]

const list_item = [
    {
        name: "My clinic",
        icon: "/icons/home.svg",
        link: "/dashboard"
    },
    {
        name: "Owner survey",
        icon: "/icons/checklist.svg",
        link: "/dashboard/owner-survey"
    },
    {
        name: "Team survey",
        icon: "/icons/team.svg",
        link: "/dashboard/team-survey"
    },
    {
        name: "Client survey",
        icon: "/icons/client.svg",
        link: "/dashboard/client-survey"
    },
]

const second_list_item:list_item = [
    {
        name: "Nps chart",
        icon: "/icons/nps.svg",
        link: "/dashboard/nps",
        attr: {}
    },
    {
        name: "Book a call",
        icon: "/icons/sched.svg",
        link: "https://outlook.office.com/bookwithme/user/0841ad432ac1402f80962c82e69c1da6@ratemyclinic.com.au/meetingtype/t62Ix816wEOeGrY2V3gTEg2?anonymous&ep=mcard",
        attr: {"target": '_blank'}

    }
]

const SidebarDesktop = ({userData}:{userData:any}) => {
    let isAdmin = false
    if(userData.role == 'admin'){
        isAdmin = true
    }
    return <aside className="w-64 h-[calc(100vh_-_4rem)] bg-white px-5 flex flex-col pb-10 border-solid border-0 border-r border-gray-200">
        <div className="text-center">
            <Image
            className="h-24 w-auto m-auto p-5"
                src={userData?.clinic_logo || "/images/logos/default_logo.svg"}
                width={600}
                height={600}
                alt="Clinic logo"
                placeholder="empty"
                
            />
            {/* <h1 className="mb-2 text-sm">{userData?.username}</h1> */}
            <Link href="/dashboard/settings/account" className="block !w-fit min-w-1/2 mx-auto ring-1 ring-gray-200 px-6 py-1 rounded-lg text-gray-400 text-xs hover:bg-appblue-200 hover:text-appblue-400">Settings</Link>
        </div>
        <ul className="my-5 py-3 border-solid border-0 border-y border-gray-200 text-gray-600">
            {list_item.map((item, index) => (
                <li key={index} className="hover:bg-appblue-200 rounded-lg hover:text-appblue-400 [&.active]:bg-appblue-200 [&.active]:text-appblue-400" >
                    <Link href={item.link} className="flex flex-row items-center gap-3 text-sm py-3 px-6" >
                        <Image
                            className="w-4 h-4" 
                            src={item.icon}
                            alt={item.name}
                            width={20}
                            height={20}
                        />
                        {item.name}</Link>
                </li>
            ))}
            {isAdmin && <li className="hover:bg-appblue-200 rounded-lg hover:text-appblue-400 [&.active]:bg-appblue-200 [&.active]:text-appblue-400">
                <Link href='/dashboard/admin' className="flex flex-row items-center gap-3 text-sm py-3 px-6 text-[#388db6]">
                    <span className="w-4 h-4 pi pi-hashtag"></span><span>Admin</span>
                </Link>
            </li>}
        </ul>
        <ul className="text-gray-600">
            {second_list_item.map((item, index) => (
                <li key={index} className="hover:bg-appblue-200 rounded-lg hover:text-appblue-400 [&.active]:bg-appblue-200 [&.active]:text-appblue-400" >
                    <Link href={item.link} className="flex flex-row items-center gap-3 text-sm py-3 px-6" {...(item.attr ? item.attr : {})}>
                        <Image
                            className="w-4 h-4" 
                            src={item.icon}
                            alt={item.name}
                            width={20}
                            height={20}
                        />
                        {item.name}</Link>
                </li>
            ))}
            <li className="hover:bg-appblue-200 rounded-lg hover:text-appblue-400 [&.active]:bg-appblue-200 [&.active]:text-appblue-400">
                <Link href='/dashboard/how-it-works' className="text-red-400  flex flex-row items-center gap-3 text-sm py-3 px-6">
                    <span className="text-red-400 w-4 h-4 pi pi-list-check"></span><span className="underline">How it works</span>
                </Link>
            </li>
        </ul>
        <div className="mt-auto">
            <LogoutBtn/>
        </div>
        </aside>
}

export default SidebarDesktop