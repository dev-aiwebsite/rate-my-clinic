"use client"
import { ChangeEvent, useEffect, useState } from "react";


type TypeSelectWithOther = {
    options: { label: any, value: any }[];
    name: string;
    onChange?:(e: any) => void;
    value:any
}

const SelectWithOther = ({ options, name, onChange, value }: TypeSelectWithOther) => {
    const [insideValue, setInsideValue] = useState(value)
    const [selectValue,setSelectValue] = useState("")
    const isOther = !options.find(option => option.value == value) || selectValue == 'other'

    function handleOnChange(e:ChangeEvent<HTMLSelectElement>) {
        let val = e.target.value
        setSelectValue(val)

        if(val == "other"){
            val = ""
        } else {
            if(onChange){
                e.target.name = name
                onChange(e)
            }
        }
        setInsideValue(val)
       
    }

    function handleInputOnChange(e:ChangeEvent<HTMLInputElement>){
        const val = e.target.value
        // check value if on select then switch to select element
        setInsideValue(val)
        if(onChange){
            e.target.name = name
            onChange(e)
            console.log(e, 'handleInputBlue')
        }
    }

    useEffect(()=>{
        setInsideValue(value)
        if(options.find(option => option.value == value)){
            setSelectValue(value)
        } else {
            setSelectValue('other')
        }

    },[value])

    function handleInputOnBur(){
        if(options.find(option => option.value == insideValue)){
            setSelectValue(value)
        } else {
            setSelectValue('other')
        }
    }

    return (
        <label className="group relative group ring-1 ring-gray-400 border-none rounded-md *:rounded-md *:px-4 *:py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350">
            <select className="cursor-pointer outline-none border-none ring-0"
                onChange={(e) => handleOnChange(e)}
                value={selectValue}
                required
            >
                {options.map(item => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                )
                )}
                <option value="other">Other – please specify</option>
            </select>
           
            <input style={{ maxWidth: "calc(100% - 2rem)" }} className={`${isOther ? 'opacity-100' : 'opacity-0 pointer-events-none'} !bg-white bg-clip-content inset-0 outline-none border-none ring-0 absolute z-10`} type="text" placeholder="Other – please specify" 
            onChange={(e)=> handleInputOnChange(e)}
            value={insideValue}
            name={name}
            list={name}
            onBlur={handleInputOnBur}
            autoComplete="off"
            required
            />
            <datalist id={name}>
               {options.map(item => (
                    <option className="capitalize" key={item.value}>{item.label}</option>
                )
                )}
            </datalist>
        </label>
    );
}

export default SelectWithOther;