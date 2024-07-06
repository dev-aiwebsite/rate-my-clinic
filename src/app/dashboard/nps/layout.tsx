const Layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
 
  return (
   
     <div className="md:overflow-auto md:max-h-[calc(100vh_-_50px)] flex-1 p-6 gap-x-6 gap-y-10 grid grid-cols-3 grid-rows-6">
             {children}
     </div>
   
  )
 }
 
 export default Layout