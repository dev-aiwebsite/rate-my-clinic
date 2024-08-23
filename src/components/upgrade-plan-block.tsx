import Link from "next/link";

const UpgradePlanBlock = () => {
    return (
        <>
            <div className="text-neutral-500 space-x-1">
                    <span className="text-lg !font-bold pi pi-lock"></span>
                    <span>This feature is currently not available.</span>
                </div>
                <Link className="text-orange-400 text-lg underline" href={"/pricing"} target="_blank">Upgrade plan to unlock</Link>
        </>
    );
}

export default UpgradePlanBlock;