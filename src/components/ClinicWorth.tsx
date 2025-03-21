"use client"

import { SurveyDataType, useSurveyDataContext } from "@/context/surveyDataContext";
import { getClientNps, getTeamNps, shortenNumber } from "lib/helperFunctions";
import Link from "next/link";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef } from "react";

const ClinicWorth = ({ className }: { className?: string }) => {
    const { data } = useSurveyDataContext()
    const op = useRef<OverlayPanel | null>(null);
    console.log(data)

    function toggleHowDidWeCalculate(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        if (!op.current) return
        op.current.toggle(e)
    }
    // Here's how we calculated your score:

    // Years in Operation: Based on your input, you received points according to the predefined range.
    // Number of Clinicians: Your score was prorated depending on the number of clinicians.
    // Client NPS, Team Satisfaction, and Treatment Hours: Points were assigned based on where your inputs fell within the set thresholds.
    // Profit: Your score was calculated based on your reported profit, following a specific formula.
    // Each metric was weighted accordingly to contribute to your final score.

    const clinicWorth = getClinicWorth(data) || "--"
    return (
        <div className="flex gap-5 items-center flex-col text-inherit justify-center">
            <span className="font-bold">Estimated Clinic Worth</span>
            <span className="font-bold text-[2.5em]">$ {clinicWorth}</span>
            <div className="text-inherit">

                <Link href="#" className="flex gap-1 justify-center items-center" onClick={(e) => toggleHowDidWeCalculate(e)} >
                    <span className="pi pi-info-circle !text-[.8em]"></span>
                    <span className="!text-[.8em]">How did we calculate</span>
                </Link>
                <OverlayPanel ref={op}>
                    <div className="max-w-96 text-sm space-y-5">
                        <h3>{`Here's how we calculated your valuation:`}</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Years in Operation:</strong> Based on your input, you received points according to the predefined range.</li>
                            <li><strong>Number of Clinicians:</strong> Your valuation was prorated depending on the number of clinicians.</li>
                            <li><strong>Client NPS, Team Satisfaction, and Treatment Hours:</strong> Points were assigned based on where your inputs fell within the set thresholds.</li>
                            <li><strong>Profit:</strong> Your valuation was calculated based on your reported profit, following a specific formula.</li>
                        </ul>
                        <p>Each metric was weighted accordingly to contribute to your final valuation.</p>
                    </div>
                </OverlayPanel>
            </div>
        </div>
    );
}


function getClinicWorth(surveyData: SurveyDataType) {
    const { clientSurveyData, teamSurveyData, ownerSurveyData } = surveyData
    const clientNps = clientSurveyData?.length && getClientNps(clientSurveyData)
    const teamSatisfaction = teamSurveyData?.length && getTeamNps(teamSurveyData)
    const profit = surveyData?.ownerSurveyData?.profit || ""

    console.log(surveyData)
    if (!clientNps || !teamSatisfaction || !profit) return null

    const today = new Date()
    const currentYear = today.getFullYear()
    const dateStablished = (ownerSurveyData.clinic_established && ownerSurveyData.clinic_established != "") && new Date(ownerSurveyData.clinic_established)
    const yearsInOperations = dateStablished && currentYear - dateStablished.getFullYear()
    const amountOfClinicians = surveyData.ownerSurveyData.number_of_clinicians
    const ownerTreatmentHours = surveyData.ownerSurveyData.treating_hours


    const measures = {
        yearsInOperations: {
            weight: 20,
            value: yearsInOperations,
            score: () => {
                // >15 = 100, 5-15 = pro rated between 20 and 100, <5 =20
                const value = yearsInOperations
                if (value > 15) {
                    return 100;
                } else if (value >= 5) {
                    return 20 + ((value - 5) / (15 - 5)) * (100 - 20);
                } else {
                    return 20;
                }
            },
        },
        amountOfClinicians: {
            weight: 20,
            value:amountOfClinicians,
            score: () => {
                // >10 = 100, 2-10 = pro rated between 10 and 100, <2 =0
                const value = amountOfClinicians
                if (value > 10) {
                    return 100;
                } else if (value >= 2) {
                    return 10 + ((value - 2) / (10 - 2)) * (100 - 10);
                } else {
                    return 0;
                }
            }
        },
        clientNps: {
            weight: 20,
            value: clientNps.score,
            score: () => {
                // >85 = 100, 50-85 = pro rated between 10 and 100, <50 =0
                const value = Number(clientNps.score)
                if (value > 85) {
                    return 100; // Case 1: value > 85
                } else if (value >= 50) {
                    return 100 - ((value - 50) / (85 - 50)) * (100 - 10); // Case 2: value between 50 and 85
                } else {
                    return 0; // Case 3: value < 50
                }
            }
        },
        teamSatisfaction: {
            weight: 20,
            value: teamSatisfaction.score,
            score: () => {
                // >9.2 = 100, 7-9.2 = pro rated between 10 and 100, <7 =0
                const value = Number(teamSatisfaction.score)
                if (value > 9.2) {
                    return 100; // Case 1: value > 9.2
                } else if (value >= 7) {
                    return 10 + ((value - 7) / (9.2 - 7)) * (100 - 10); // Case 2: value between 7 and 9.2 (increase from 10 to 100)
                } else {
                    return 0; // Case 3: value < 7
                }
            }
        },
        ownerTreatmentHours: {
            weight: 20,
            value: ownerTreatmentHours,
            score: () => {
                // <15 = 100, 15-40 is prorated between 10 and 100 and >40 = 0
                const value = ownerTreatmentHours
                if (value < 15) {
                    return 100; // Case 1
                } else if (value <= 40) {
                    return 100 - ((value - 15) / (40 - 15)) * (100 - 10);
                } else {
                    return 0; // Case 3
                }
            }
        },
    } as Record<string, Record<"weight" | "score", any>>


    let totalScore = 0;
    let totalWeight = 0;
    console.log(`currentYear: ${currentYear}`)
    console.log(`dateStablished: ${dateStablished}`)
    console.log(measures)
    // Loop through all measures to calculate the weighted score
    for (let key in measures) {
        const measure = measures[key];
        const score = measure.score();
        const weightedScore = (score * measure.weight) / 100; // Weighted score
        console.log(`${key}_totalScore: ${weightedScore}`)
        totalScore += weightedScore;  // Add weighted score to total
        totalWeight += measure.weight; // Add weight to total
    }



    const multiple = () => {
        //  >80 = 3.5, 65-80 = 3, 50-65 = 2.5, 35-50 = 2
        if (totalScore > 80) {
            return 3.5
        } else if (totalScore >= 65) {
            return 3
        } else if (totalScore >= 50) {
            return 2.5
        } else if (totalScore >= 35) {
            return 2
        } else {
            return 1
        }
    }

    const estimatedClinicWorth = Number(profit) * multiple()
    const calculatedRange = calculateRange(estimatedClinicWorth)


    function calculateRange(value: number) {
        const percentage = 0.20; // 20%
        const lowerBound = value - (value * percentage); // Value - 20%
        const upperBound = value + (value * percentage); // Value + 20%

        return {
            lower: lowerBound,
            upper: upperBound
        };
    };

    console.log(`totalScore: ${totalScore}`)
    console.log(`multiple: ${multiple()}`)
    console.log(`estimatedClinicWorth: ${estimatedClinicWorth}`)
    console.log(`calculatedRange: `, calculatedRange)

    return `${shortenNumber(calculatedRange.lower)} - ${shortenNumber(calculatedRange.upper)}`

}


export default ClinicWorth;

