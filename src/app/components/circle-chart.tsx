"use client"

export default function CircleChart({max,data = [{value: 0}],text}:{data:{name?:string,value:number,color?:string}[],text?:string,max?:number,}) {
    let chart_visual = ""
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


    return (
        <div className="container flex items-center justify-center rounded-full relative w-full h-full max-w-36 max-h-36 aspect-square">
        <div className="p-4 rounded-full absolute w-[calc(100%-33px)] h-[calc(100%-33px)] md:w-[calc(100%-45px)] md:h-[calc(100%-45px)] bg-white flex items-center justify-center flex-col text-center">
            <div className="font-bold text-xl">{data[0].value}</div>
            {text && <div className="text-[8px] text-gray-400 leading-[1.1em]">{text}</div> }
        </div>
        <style jsx>{`
            .container {
                background: conic-gradient(from 0deg,${chart_visual}#eee 0%,#eee 0%)
            }
        `}
    </style>
    </div>

   
    )
}