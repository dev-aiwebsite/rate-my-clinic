import HelperCard from "../../components/helperCard";
import NpsNavButtonGroup from "../../components/nps-navigation";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";

const Layout = ({
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) => {
  const value = {
    ripple: true,
};

 return (
  <PrimeReactProvider value={value}>
    <div className="overflow-auto max-h-[calc(100vh_-_50px)] bg-[#f7f7f7] flex-1 p-6 gap-x-6 gap-y-10 grid grid-cols-3 grid-rows-6 *:bg-white *:shadow-lg *:rounded-md *:py-6 *:px-6">
        <NpsNavButtonGroup/>
        <div className="col-span-3 row-span-5 h-fit">
            {children}
        </div>
    </div>
  </PrimeReactProvider>
 )
}

export default Layout