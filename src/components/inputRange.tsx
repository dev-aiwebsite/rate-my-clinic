"use client"

import { useEffect, useState } from "react";

interface Props {
    required?: boolean;
    min: number;
    max: number;
    firstInputClassName?: string;
    className?: string;
    secondInputClassName?: string;
    defaultValue?: number;
    onChange?: (value: number) => void;
    name?: string;
}

function InputRange({ required,min = 0,max = 10,firstInputClassName,className,secondInputClassName,defaultValue,onChange,name}: Props) {
    const [primaryInputVal,setPrimaryInputVal] = useState(0)
    const [secondaryInputVal,setsecondaryInputVal] = useState(0)


    useEffect(()=>{
        if(defaultValue){
            setPrimaryInputVal(defaultValue)
            setsecondaryInputVal(defaultValue)
        }
        
    },[defaultValue])

    function handlePrimaryOnInput(value:number) {
        setPrimaryInputVal(value)
        setsecondaryInputVal(value)

        if(onChange){
            onChange(value)
        }
    }
    function handleSecondaryOnInput(value:number) {
        setPrimaryInputVal(value)
        setsecondaryInputVal(value)
        if(onChange){
            onChange(value)
        }
    }


    return (
      <div className={`${className} items-center w-full flex flex-row`}>
            <input
            className={`${firstInputClassName} w-full`}
            type="range"
            {...(required && { required: true })}
            min={min}
            max={max}
            value={primaryInputVal}
            name={name}
            onChange={(e) => handlePrimaryOnInput(Number(e.target.value))}
        />

        <input
        className={`${secondInputClassName} !flex-none !w-fit !min-w-fit font-medium`}
            type="number"
            min={min}
            max={max}
            value={secondaryInputVal}
            onChange={(e) => handleSecondaryOnInput(Number(e.target.value))}
            />

      </div>
    );
  }
  
  export default InputRange;