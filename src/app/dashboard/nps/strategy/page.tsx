import HelperCard from "@/components/helperCard";
import NpsContent from "@/components/nps-recommendation";

export default function Page() {
    const item = {
        name: 'Strategy',
        value: 73,
        color: 'var(--appgreen-300)',
        icon: '/icons/strategy.svg',
    }
    return (
        <>
        <NpsContent item={item}/>
             <HelperCard className="absolute bottom-0 right-5"/>
        </>
    );
}