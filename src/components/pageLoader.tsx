const PageLoader = () => {
    return (
        <div className="bg-[#fffa] fixed inset-0 w-full h-full flex items-center justify-center">
            <span className="text-2xl pi pi-spinner-dotted pi-spin"></span>
        </div>
    );
}

export default PageLoader;