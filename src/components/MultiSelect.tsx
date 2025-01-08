
import React, { useEffect, useState } from "react";
import { MultiSelect as BaseMultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';

type ItemType = {
    name: string;
    code?: string;
}

type valueType = ItemType[] | string;

type MultiSelectType = {
    items: ItemType[] | [];
    value?: valueType;
    valueAsString?: boolean;
    onChange?: (e:any) => void;
    name?: string;
    required?:boolean;
}
export default function MultiSelect({required,items,value,valueAsString,onChange,name}:MultiSelectType) {
    const [selectedItems, setSelectedItems] = useState<ItemType[]>([]);
    const [stringValue,setStringValue] = useState("")
    useEffect(()=>{
        let valueToSet = value
        if(typeof value == 'string'){
            setStringValue(value)
            let valueArray = value.split(",").map(i => i.trim())
            valueToSet = items.filter(i => valueArray.includes(i.name))
        }
        let returnValue = valueToSet as ItemType[]
        setSelectedItems(returnValue) 
    },[value])

    const handleOnchange = (e: MultiSelectChangeEvent) => {
        setSelectedItems(e.value)

        let returnValue = e.value
        if(valueAsString){
            returnValue = e.value.map((i:ItemType) => i.name).join(",")
        }


        if(onChange){
            onChange(returnValue)
        }
        console.log(selectedItems, 'selectedItems')
        console.log(returnValue, 'returnValue')

    }

    return (
        <div className="flex justify-content-center relative">
            <input className="!opacity-0 absolute inset-0 pointer-events-none" name={name} type="text" value={stringValue} required={required}/>
            <BaseMultiSelect value={selectedItems} onChange={(e) => handleOnchange(e)} options={items} optionLabel="name" 
                placeholder="Select Services" className="w-full md:w-20rem"/>
        </div>
    );
}
        