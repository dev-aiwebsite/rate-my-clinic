import Image from "next/image"

const Navbar = () => {
    return(
    <div className="h-16 bg-[#004261] w-full flex flex-row items-center py-6 *:px-6">
        <div className="w-64">
            <Image
            className="h-auto w-24 m-auto"
                src="/images/logos/RMC_Logo-MASTER.png"
                width={60}
                height={60}
                alt="Picture of the author"
                
            />
        </div>
        <div className="ml-auto flex flex-row items-center gap-5 w-64">
            <div>
                <Image
                className="w-5 h-5 m-auto"
                    src="/icons/bell.svg"
                    width={24}
                    height={24}
                    alt="Picture of the author"
                    
                />
            </div>
            <div className="flex flex-row items-center gap-2">
                <div className="bg-gray-100 rounded-full">
                    <Image
                        className="w-8 h-8 m-auto"
                            src="/icons/avatar-default.svg"
                            width={24}
                            height={24}
                            alt="Picture of the author"
                            
                        />
                </div>
                <h2 className="text-white text-sm">Jade Scott</h2>
            </div>
        </div>
    </div>
    )
}

export default Navbar