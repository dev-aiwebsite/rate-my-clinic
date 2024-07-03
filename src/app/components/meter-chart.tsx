"use client"

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
    


    return (
        <div className="">
            <div className="flex flex-col items-center justify-center">
                <div className="overflow-hidden relative w-[calc(100%-10vh)] min-w-[15vh] aspect-[2/1]">
                    <div className="container absolute flex items-center justify-center rounded-full w-full h-[200%]">
                        <div className="p-4 rounded-full absolute w-[70%] h-[70%] bg-white flex items-center justify-center flex-col text-center">
                        </div>
                    </div>
                    <svg className="meter-needle absolute h-[90%] bottom-0 left-1/2 -translate-x-1/2" width="31" height="134" viewBox="0 0 31 134" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 0.7768 121.567 L 13 2 L 30.0996 119.666 C 28.2858 140.131 0.9369 136.146 0.7768 121.567 Z" fill={needle.color}/>
                    </svg>    
                    <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 text-[10px] sm:text-[12px] md:text-xs font-medium rounded-full aspect-square w-[2em] bg-white flex items-center justify-center">{needle.value}</div>                
                </div>
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

function calculateRotation(value:number, min = 0, max = 100, rotateMin = -90, rotateMax = 90) {
    // Ensure the value is within the min and max bounds
    if (value < min) value = min;
    if (value > max) value = max;

    // Calculate the proportion of the value within the range
    let proportion = (value - min) / (max - min);

    // Calculate the rotation angle
    let angle = proportion * (rotateMax - rotateMin) + rotateMin;

    return angle;
}