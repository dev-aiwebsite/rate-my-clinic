import { saveAs } from 'file-saver';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import ExcelJS from 'exceljs';


type rgb = {
    [key:string]:number
}

// export function getColor(value: number) {
//     const maxStep = 255 * 3.5
//     // const maxStep = 940
//     const stepRatio = maxStep / 100
//     let stepsToDo = value * stepRatio

//     let rgb:rgb = {
//         red: 255,
//         green: 0,
//         blue: 0,
//     }

//     let colorSequence = ['green', 'red', 'blue']
//     let maxTries = 10

//     while (stepsToDo > 0 && maxTries > 0) {
//         maxTries = maxTries - 1
//         colorSequence.forEach((v, i) => {
//             let currentValue = rgb[v]
//             let toAdjust = 255

//             if (stepsToDo - toAdjust < 0) {
//                 toAdjust = stepsToDo

//             }

//             stepsToDo = stepsToDo - toAdjust

//             if (currentValue >= 255) {
//                 rgb[v] = currentValue - toAdjust
//                 if (rgb[v] < 0) {
//                     stepsToDo = stepsToDo - rgb[v]
//                     rgb[v] = 0
//                 }

//             } else {
//                 rgb[v] = toAdjust

//                 if (rgb[v] >= 255) {
//                     stepsToDo = stepsToDo + (rgb[v] - 255)
//                     rgb[v] = 255
//                 }

//             }

//         })

//     }
//     return `rgb(${rgb['red']}, ${rgb['green']}, ${rgb['blue']})`;
// }

export function getColor(value:number){
    // 0-39 is Orange, 40-69 is blue and 70+ is green.
    const blue = '#94BDE5'
    const orange = '#fb923c'
    const green = '#4ade80'

    if(value < 40){
        return orange
    } else if(value < 70){
        return blue
    } else {
        return green
    }

}

export function formatDateTime(date:Date){
    date = new Date(date)

    const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

    return formattedDate

}

export function calculateNeedleRotation(value:number, min = 0, max = 100, rotateMin = 0, rotateMax = 180) {
    // Ensure the value is within the min and max bounds
    if (value < min) value = min;
    if (value > max) value = max;

    // Calculate the proportion of the value within the range
    let proportion = (value - min) / (max - min);

    // Calculate the rotation angle
    let angle = proportion * (rotateMax - rotateMin) + rotateMin;

    return angle;
}


export function hasPassedMaxDays (startDate: string, maxDays: number, currentDate?: string): { hasPassed: boolean, remainingDays: number,maxEndDate:Date }{
    // Parse the input dates
    const start = new Date(startDate); // Start date of the survey
    const current = currentDate ? new Date(currentDate) : new Date(); // Defaults to today's date if not provided

    // Calculate the max date by adding maxDays to the start date
    const maxEndDate = new Date(start);
    maxEndDate.setDate(start.getDate() + maxDays);

    // Calculate the time difference in milliseconds
    const diffInTime = maxEndDate.getTime() - current.getTime();

    // Convert the difference to days (1 day = 24 * 60 * 60 * 1000 ms)
    // const remainingDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
    const remainingDays = diffInTime > 0 ? Math.ceil(diffInTime / (1000 * 60 * 60 * 24)) : 0;

    // If remainingDays is negative, the max days period has passed
    const hasPassed = remainingDays <= 0;

    return {
        hasPassed,
        maxEndDate,
        remainingDays: hasPassed ? 0 : remainingDays // If the period has passed, return 0 for remaining days
    };
};

export function formatDecimal(digit:any, decimalPlaces = 1) {
    let formattedNum
    let convertedToNumber = Number(digit)
    if(isNaN(convertedToNumber)) return digit
    formattedNum = convertedToNumber.toFixed(decimalPlaces)
    return formattedNum
}


export const saveAsExcelFile = (buffer: BlobPart, fileName: string) => {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION); 
};

export const getClientNps = (clientSurveyData:any) => {
    let clientNpsScoreArray = clientSurveyData.map((i: { recommendation: any }) => Number(i.recommendation))
        let clientNpsScoreTotal = (clientNpsScoreArray.reduce((a: any,b: any) => Number(a) + Number(b), 0) / clientNpsScoreArray.length ) * 10
        let clientNps = {
            score: clientNpsScoreTotal,
            quality: getClientNpsQuality(clientNpsScoreTotal)
        }
        return clientNps
}

export const getTeamNps = (teamSurveyData:any) => {
    let teamSatisfactionArray= teamSurveyData.map((i: { recommendation: any }) => i.recommendation)
    let teamSatisfaction = Number((teamSatisfactionArray.reduce((a: any,b: any) => a + b, 0) / teamSatisfactionArray.length).toFixed(1))
    let teamNps = {
        score:teamSatisfaction,
        quality: getTeamNpsQuality(teamSatisfaction)
    }
    return  teamNps
}


export function getClientNpsQuality(score:number) {
    // 0-75 = below the national average
// 75-85 = good
// 85+ = excellent

if (score > 85) {
    return "excellent";
} else if (score >= 75) {
    return "good";
} else {
    return "below the national average";
}
}

export function getTeamNpsQuality(score:number) {
    // Team Satisfaction
    // 0-8 = below the national average
    // 8-9 = good
    // 9+ = excellent
    
    if (score >= 9) {
        return "excellent";
    } else if (score >= 8) {
        return "good";
    } else {
        return "below the national average";
    }
}

export const shortenNumber = (value:number) => {
    
    if(typeof value !== 'number') return value
    if (value >= 1_000_000) {
        return (value / 1_000_000).toFixed(1) + 'm'; // For millions with one decimal
    } else if (value >= 1_000) {
        return Math.floor(value / 1_000) + 'k'; // For thousands without decimals
    } else {
        return value.toString(); // For values less than 1000
    }
};


export const getNps = (arrayOfValues:number[]) => {
    if(!arrayOfValues && !Array.isArray(arrayOfValues)) return false
    const detractors =  arrayOfValues.filter((i: number) => i <= 6).length
    const promoters =  arrayOfValues.filter((i: number) => i >= 9).length

    const nps = ((promoters - detractors) / arrayOfValues.length) * 100

    return nps
}