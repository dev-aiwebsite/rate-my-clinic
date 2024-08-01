"use client"

type npsData = {
    data:{
        name?:string,
        value:number,
        color?:string
    }[],
    subtext?:{
        text:string,
        class?:string
    },
        max?:number
}

export default function CircleChart({max = 100,data = [{value: 0}],subtext}:npsData) {
    let chart_visual = ""
    let percentage1,percentage2
    if(data.length){

        let colors_array = data.map((i:any,index:number) => {
        let start = '0'
        if(index != 0) {
            start = `${data[index - 1].value}`
        }
            let percentage = i.value
            
            if(max){
                percentage = (i.value / max) * 100
            }

            return `${i.color} ${start}%,${i.color} ${percentage}%`
            
        })
        chart_visual = `${colors_array.join(",")},`
    }
    // let values = data.map((i:any,index:number) => i.value)
    // values.reverse()
    

    if(max){
        percentage1 = {
            strokeDashoffset: 60 - (data[0].value / max) * 60,
        }
        if(data[1]){
            percentage2 = {
                strokeDashoffset: 60 - (data[1].value / max) * 60,
            }
        }
      
    }

    return (
        <div className="container flex items-center justify-center rounded-full relative w-full h-full max-w-36 max-h-36 aspect-square">
       
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path style={{
                strokeDashoffset: 0,
            }} className="circleChart text-gray-200" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="4"></path>
            {percentage2 && <path style={percentage2} className="circleChart" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke={data[1].color} strokeWidth="4"></path>}
            <path style={percentage1} className="circleChart" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke={data[0].color} strokeWidth="4"></path>
        </svg>

        <div className="p-4 rounded-full absolute w-[calc(100%-33px)] h-[calc(100%-33px)] md:w-[calc(100%-45px)] md:h-[calc(100%-45px)] flex items-center justify-center flex-col text-center">
            <div className="font-bold text-xl">{data[0].value.toFixed(1)}</div>
            {subtext && <div className={`${subtext.class} text-[8px] text-gray-400 leading-[1.1em]`}>{subtext.text}</div> }
        </div>
    </div>
   
    )
}