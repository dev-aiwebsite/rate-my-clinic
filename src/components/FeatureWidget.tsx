"use client"
import Image from "next/image";
import { Button } from "primereact/button";
import { useState } from "react";

const tabData = [
  {
    label: "dashboard",
    image: "https://lh3.googleusercontent.com/d/1AYLOxwKF4q0uw76nBup77VC0-7UyHhaw",
    description: () => (
      <p>
        <strong>Dashboard</strong> This is what your dashboard would look like once we have the completed information from the owner, team and client surveys. Your scores reflect how your clinic compares against the benchmarks we have established.
      </p>
    ),
  },
  {
    label: "overall rating",
    image: "https://lh3.googleusercontent.com/d/16z4XhEkD8ZkUh4Tbe1OCzjyK3OxBov3i",
    description: () => (
      <p>
        <strong>Overall Rating</strong> This represents a combination of Strategy, Finance, Clients and Team and is benchmarked against other clinic owner’s results.
      </p>
    ),
  },
  {
    label: "clinic valuation",
    image: "https://lh3.googleusercontent.com/d/1ZUx5LjhC90KG-QLOm7H8dVqTnP_5iTzx",
    description: () => (
      <p>
        <strong>Clinic Valuation</strong> Once all information is complete, you will see an approximate valuation of your clinic based on our benchmark data. It should only be used as a guide and cannot be relied upon as a true measure.
      </p>
    ),
  },
  {
    label: "clients",
    image: "https://lh3.googleusercontent.com/d/1bkjXA2BuzEh3RIIGNDxjwjPGr_-kGZKF",
    description: () => (
      <p>
        <strong>Clients</strong> This is what this section would look like once we have the completed information from the owner and client surveys. Your scores reflect how your clinic compares against the benchmarks we have established.
      </p>
    ),
  },
  {
    label: "team",
    image: "https://lh3.googleusercontent.com/d/1-W6KynJQ-CbHF4S7hCLOr8qURn83i-AT",
    description: () => (
      <p>
        <strong>Team</strong> This is what this section would look like once we have the completed information from the owner and team surveys. Your scores reflect how your clinic compares against the benchmarks we have established.
      </p>
    ),
  },
  {
    label: "strategy",
    image: "https://lh3.googleusercontent.com/d/13_CNrdpiJiyKawMXQa9BQSm-n6lEdq7o",
    description: () => (
      <p>
        <strong>Strategy</strong> This is what this section would look like once we have completed information from the owner survey. Your scores reflect how your clinic compares against the benchmarks we have established.
      </p>
    ),
  },
  {
    label: "finance",
    image: "https://lh3.googleusercontent.com/d/1KTR8dB9Ir7f_GkaTzdyec8Dd6fxraULq",
    description: () => (
      <p>
        <strong>Finance</strong> This is what this section would look like once we have completed information from the owner survey. Your scores reflect how your clinic compares against the benchmarks we have established.
      </p>
    ),
  },
  {
    label: "client NPS",
    image: "https://lh3.googleusercontent.com/d/1qBRQb_h6zywqG_WQIia_d_a_wpM55JhI",
    description: () => (
      <p>
        <strong>Client NPS</strong> This section details your client Net Promoter Score which is a global standard to measure client satisfaction. It also allows you to read the comments your clients made in the survey.
      </p>
    ),
  },
  {
    label: "team",
    image: "https://lh3.googleusercontent.com/d/1o_-IQzaETYVEomd4d3r7AtvqN3cBRAwO",
    description: () => (
      <p>
        <strong>Team</strong> This section details your team satisfaction. It also allows you to read the comments your team made in the survey.
      </p>
    ),
  },
];



export const FeatureWidget = () => {
  const [activeTab, setActiveTab] = useState(0)
 
function prev(){
  if(activeTab > 0){
      setActiveTab(activeTab - 1)
  }
}

function next(){
  if(activeTab < tabData.length - 1){
      setActiveTab(activeTab + 1)
  }
}

  return (
          <div className="card flex flex-row flex-nowrap gap-4">
              <div className="w-[200px] flex flex-col flex-nowrap overflow-auto">
                  {tabData.map((i,index) => {
                      const isActive = index == activeTab
                      const style = isActive ? "!ring-0 w-full text-center !text-white !bg-orange-400 capitalize" : "!text-gray-600 !ring-0 border-0 w-full text-center capitalize"
                      return <Button
                      key={i.label + index}
                      text
                      onClick={()=>setActiveTab(index)}
                      className={style}>
                          {i.label}
                      </Button>
                  })
                  }
              </div>
              <div className="flex-1 flex flex-col">
                  <div className="flex flex-col flex-1 bg-[#f7f7f7] rounded-lg p-4 gap-4">
                      <TabContent data={tabData[activeTab]}/>
                  </div>
                  <div className="flex justify-between mt-auto">
                      <Button className="font-bold" text onClick={()=> prev()}><i className="mr-2 pi pi-arrow-left"></i>Prev</Button>
                      <Button className="font-bold" text onClick={()=> next()}>Next <i className="ml-2 pi pi-arrow-right"></i></Button>
                  </div>
              </div>
              
          </div>
  );
}



function TabContent({data}:{data:{
    label: string;
    image: string;
    description: () => JSX.Element;
}}){


return <>
<Image
key={data.image} 
className="h-auto max-h-[500px] mx-auto object-contain"
src={data.image}
alt=""
width={700}
height={500}/>
<div className="bg-white p-4 rounded mt-auto">
{data.description()}
</div>
</>

}
export default FeatureWidget;