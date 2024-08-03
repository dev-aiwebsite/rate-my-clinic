
import React, { useState } from "react";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface Option {
    name: string;
    value: string;
}


export default function SelectPlan() {
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);

    // Object.keys(products).map((key, index) => {
    //     { name: 'New York', value: 'NY' },
    // })
    const plans: Option[] = [
        { name: 'New York', value: 'NY' },
        { name: 'Rome', value: 'RM' },
        { name: 'London', value: 'LDN' },
        { name: 'Istanbul', value: 'IST' },
        { name: 'Paris', value: 'PRS' }
    ];
    return (
        <div className="card flex justify-content-center">
            <Dropdown value={selectedOption} onChange={(e: DropdownChangeEvent) => setSelectedOption(e.value)} options={plans} optionLabel="name" 
                placeholder="Select Plan" className="w-full md:w-14rem bg-white" />
        </div>
    )
}
        