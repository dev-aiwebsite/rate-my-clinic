"use client"
import FeatureWidget from "components/FeatureWidget";

const FeaturePage = () => {
    return (
        <div className="max-md:!max-w-[100vw] bg-transparent flex-1 p-6 gap-x-6 gap-y-10 flex flex-col">
            <div className="card flex flex-row items-center justify-between">
                <h1 className="text-xl font-medium mr-4">App Features</h1>
            </div>
            <FeatureWidget />
        </div>
    );
}

export default FeaturePage;