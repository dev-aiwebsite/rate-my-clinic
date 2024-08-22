"use client"

import { getColor } from "@/helperFunctions"
import { Collection } from "mongoose"

export default function MeterChart({
    data = [{value: 100, color: "var(--appblue-200)"}],
    needle = {color: "var(--appgreen-600)", value:0, title: '--'}
}) {

    // add needle default color 
    if(needle.color == ""){
        needle.color = "var(--appgreen-600)"
    }


    let chart_visual = ""
    let rotation = `${calculateRotation(needle.value)}deg`
   
    data.sort((a,b) => {
        return a.value - b.value
    })

    let colors_array = data.map((i:any,index:number) => {
        let start = 0
        if(index != 0) {
            start = data[index - 1].value
        }

        if(i.color == ""){
            i.color = "var(--appblue-200)"
        }
        return `${i.color} ${(start / 2)}%,${i.color} ${(i.value / 2)}%`
        
    })
    chart_visual = `${colors_array.join(",")},`
    

    // dynamic color 
    // data[0].color = getColor(data[0].value)
    let meterColor = getColor(needle.value)


    return (
        <div className="max-w-40 mx-auto">
        <svg className="mx-auto w-full" viewBox="143.95 58.223 217 116.7962" xmlns="http://www.w3.org/2000/svg">
            <path className="gauge" d="M 143.95 166.723 C 143.95 152.475 146.757 138.366 152.209 125.202 C 157.662 112.038 165.654 100.078 175.729 90.002 C 185.804 79.927 197.765 71.935 210.929 66.483 C 224.093 61.03 238.202 58.223 252.45 58.223 C 266.698 58.223 280.807 61.03 293.971 66.483 C 307.135 71.935 319.096 79.927 329.171 90.002 C 339.246 100.078 347.238 112.038 352.691 125.202 C 358.144 138.366 360.95 152.475 360.95 166.723 L 324.5 166.723 C 324.5 157.262 322.636 147.893 319.016 139.151 C 315.395 130.41 310.088 122.467 303.397 115.776 C 296.707 109.086 288.764 103.779 280.022 100.158 C 271.281 96.537 261.912 94.673 252.45 94.673 C 242.988 94.673 233.619 96.537 224.878 100.158 C 216.136 103.779 208.194 109.086 201.503 115.776 C 194.813 122.467 189.505 130.41 185.885 139.151 C 182.264 147.893 180.4 157.262 180.4 166.723 L 143.95 166.723 Z" fill={meterColor} transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -7.105427357601002e-15, 0)"/>
            <path className="meter-needle" d="M 242.76 167.81 L 253.151 76.394 L 263.938 165.652 C 263.17 180.517 243.264 178.361 242.76 167.81 Z" fill="#004261" style={{transformOrigin: "253.04px 164.74px"}} transform="matrix(0.000004000001, -1, 1, 0.000004000001, -0.000002551164, -0.000012428075)"/>
        </svg>
            <div className="flex flex-col items-center justify-center">
                
                <div className="max-md:hidden relative text-base mt-2">{needle.title}</div>
            </div>
            <style jsx>{`
          
                .container {
                    background: conic-gradient(from 270deg,${chart_visual}#eee 0%,#eee 0%);
                    clip-path: polygon(0 0, 100% 0%, 100% 50%, 0% 50%);
                }
                .meter-needle {
                    --rotation: ${rotation};
                    rotate: var(--rotation);
                }

                `}
            </style>
        </div>

    )
}

function calculateRotation(value:number, min = 0, max = 100, rotateMin = 0, rotateMax = 180) {
    // Ensure the value is within the min and max bounds
    if (value < min) value = min;
    if (value > max) value = max;

    // Calculate the proportion of the value within the range
    let proportion = (value - min) / (max - min);

    // Calculate the rotation angle
    let angle = proportion * (rotateMax - rotateMin) + rotateMin;

    return angle;
}
