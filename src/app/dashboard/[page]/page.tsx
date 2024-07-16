import HowItWorksPage from "@/how-it-works/page";

export default function Page({params}:{params:any}){
    if(params.page == "how-it-works"){
        return <div className="flex-1 flex flex-row max-md:!pb-20 max-md:-mt-10 max-h-[calc(100vh_-_64px)] overflow-scroll p-6">
            <HowItWorksPage additionalClass="h-fit"></HowItWorksPage>
        </div>

    }
}