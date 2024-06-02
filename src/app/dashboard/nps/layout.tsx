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
    <div className="md:overflow-auto md:max-h-[calc(100vh_-_50px)] flex-1 p-6 gap-x-6 gap-y-10 grid grid-cols-3 grid-rows-6">
            {children}
    </div>
  </PrimeReactProvider>
 )
}

export default Layout