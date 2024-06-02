"use client"
import React, { useState } from "react";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { Tooltip } from "primereact/tooltip";

export default function SurveySlider() {
    const [value, setValue] = useState<number>(0);

        function handleChange(e: SliderChangeEvent){
            const eValue = Array.isArray(e.value) ? e.value[0] : e.value;
            setValue(eValue)
        }

    return (
        <div className="card flex justify-content-center">
            <Tooltip target="#clinic_count>.p-slider-handle" content={`${value}`} position="bottom"/>
            <Slider min={0} max={10} id="clinic_count" value={value} onChange={handleChange} className="w-full" />
            
        </div>
    )
}
        