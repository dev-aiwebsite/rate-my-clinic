import HelperCard from "@/components/helperCard";
import NpsNavButtonGroup from "@/components/nps-navigation";
import NpsContent from "@/components/nps-recommendation";

export default async function Page() {
    const item = {
        name: 'Clients',
        value: 73,
        color: 'var(--appgreen-300)',
        icon: '/icons/client.svg',
    }
    return (<>
            <NpsNavButtonGroup className="max-md:hidden card"/>
            <div className="col-span-3 row-span-5 h-fit max-md:!pb-30 md:card">
                <NpsContent item={item}/>
                <HelperCard className="max-md:mt-6 max-md:w-full max-md:ring-0 md:absolute md:bottom-0 md:right-5"/>
            </div>
        </>
            
    );
}