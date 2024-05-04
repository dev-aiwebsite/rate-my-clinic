import Image from "next/image"
import ProfileButton from "../profile-settings-button"
import LogoutBtn from "../logout-btn"

const list_item = [
    {
        name: "My clinic",
        icon: "/icons/home.svg",
        link: "#"
    },
    {
        name: "Owner surver",
        icon: "/icons/checklist.svg",
        link: "#"
    },
    {
        name: "Team survey",
        icon: "/icons/team.svg",
        link: "#"
    },
    {
        name: "Client survey",
        icon: "/icons/client.svg",
        link: "#"
    },
]

const second_list_item = [
    {
        name: "Nps chart",
        icon: "/icons/nps.svg",
        link: "#"
    },
    {
        name: "Book a call",
        icon: "/icons/sched.svg",
        link: "#"
    }
]
const Sidebar = () => {
    return <aside className="w-64 h-full bg-white px-5 flex flex-col pb-10">
        <div className="text-center">
            <Image
            className="h-24 w-auto m-auto p-5"
                src="/images/logos/wrh-logo.png"
                width={600}
                height={600}
                alt="Wrh logo"
                
            />
            <h1 className="mb-2 text-sm">Jade Scott</h1>
            <ProfileButton/>
        </div>
        <ul className="my-5 py-3 border-solid border-0 border-y border-gray-200 text-gray-500">
            {list_item.map((item, index) => (
                <li key={index} className="hover:bg-appblue-200 rounded-lg hover:text-appblue-400 [&.active]:bg-appblue-200 [&.active]:text-appblue-400" >
                    <a href={item.link} className="flex flex-row items-center gap-3 text-sm py-3 px-6">
                        <Image
                            className="w-5 h-5" 
                            src={item.icon}
                            alt={item.name}
                            width={20}
                            height={20}
                        />
                        {item.name}</a>
                </li>
            ))}
        </ul>
        <ul className="text-gray-500">
            {second_list_item.map((item, index) => (
                <li key={index} className="hover:bg-appblue-200 rounded-lg hover:text-appblue-400 [&.active]:bg-appblue-200 [&.active]:text-appblue-400" >
                    <a href={item.link} className="flex flex-row items-center gap-3 text-sm py-3 px-6">
                        <Image
                            className="w-5 h-5" 
                            src={item.icon}
                            alt={item.name}
                            width={20}
                            height={20}
                        />
                        {item.name}</a>
                </li>
            ))}
        </ul>
        <div className="mt-auto">
            <LogoutBtn/>
        </div>
        </aside>
}

export default Sidebar