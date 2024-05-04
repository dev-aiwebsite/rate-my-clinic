import CircleChart from "./circle-chart"
let test = [
    {
        name: 'Group A',
        value: 90,
        color: '#94BDE5',
    },
    {
        name: 'Group B',
        value: 20,
        color: '#004261',
    }
]
export default function SummaryOverview() {
    return (
        <div className="row-span-3 col-span-3 grid grid-cols-3">
            <div className="flex flex-col items-center justify-center gap-5 border-0 border-solid border-r border-gray-200">
                <CircleChart data={test}/>
                <div>
                    <div className="flex flex-row gap-2 items-center">
                        <div className="h-3 w-3 bg-appblue-300"></div>
                        <span className="text-lg">Overall Rating: -/-</span>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <div className="h-3 w-3 bg-appblue-400"></div>
                        <span className="text-xs">Average Australian Clinic: {test[0].value}</span>
                    </div>
                </div>
                <a className="font-medium text-gray-400" href="#">See full report</a>
            </div>

            <div>

            </div>

            <div>

            </div>
        </div>
    );
}