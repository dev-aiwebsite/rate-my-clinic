import HelperCard from "@/components/helperCard";
import NpsContent from "@/components/nps-recommendation";

export default function Page() {
    const item = {
        name: 'Clients',
        value: 73,
        color: 'var(--appgreen-300)',
        icon: '/icons/client.svg',
    }
    return (<>
    <NpsContent item={item}/>
         <HelperCard className="absolute bottom-0 right-5"/>
    </>
            
    );
}