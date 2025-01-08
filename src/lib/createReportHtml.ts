import { generateReportData } from "./generateReportData"
import { calculateNeedleRotation, formatDecimal, getClientNps, getColor, getTeamNps } from "./helperFunctions"

export const createReportHtml = async(reportData?:any) => {
    console.log(reportData, 'createReportHtml')
    if(!reportData) return false

    if(!reportData || !reportData.surveyData) return false

    let pdfData = {
        clinic_name: reportData.surveyData.ownerSurveyData.clinic_name,
        overall_mine: reportData.surveyData.overalls.mine || "--",
        overall_other: reportData.surveyData.overalls.other,
        summary: reportData.surveyData.summary,
        other_summary: reportData.surveyData.other_summary,
        recommendations: reportData.recommendations || [],
        client_nps: {},
        team_nps: {},
    }

    if(reportData.surveyData.clientSurveyData){
        const clientNps = getClientNps(reportData.surveyData.clientSurveyData)
        pdfData['client_nps'] = clientNps
    }

    if(reportData.surveyData.teamSurveyData){
    
        const teamNps = getTeamNps(reportData.surveyData.teamSurveyData)
        pdfData['team_nps'] = teamNps
    }

    
    const reportHtml = createReportTemplate(pdfData)
    return reportHtml
}

export function createReportTemplate(report_data: { client_nps: {score?: any, quality?: any};
    team_nps: {score?: any, quality?: any}; overall_mine: any; overall_other: any; summary: {[key:string]:any;}; other_summary: any; clinic_name: any; recommendations: {[key:string]:any};}) {
    if(!report_data) return false

    const pdfFooter = `<div style="text-align:center;bottom:0;position:absolute;padding:2mm;width:180mm;margin:auto">
    <div style="margin:auto;text-align:center">For assistance, please contact me at <a style="color:#0000ff;" href="mailto:paulhedges@ratemyclinic.com.au" target="_blank">paulhedges@ratemyclinic.com.au</a> or <a style="color:#0000ff;" href="tel:0400 117 320" target="_blank">0400 117 320</a>.</div>
    </div>`


    let overall_diff_value = Number(report_data.overall_mine) - Number(report_data.overall_other)
    let overall_diff_color = overall_diff_value > 0 ? '#22c55e' : '#f87171'
    let overall_diff_value_sign = overall_diff_value > 0 ? '+' : ''

    let main_keypoints = ''
    let client_report = ""
    let team_report = ""


    if(report_data?.summary?.clients?.score){
        client_report = ` <div style="padding-inline:2mm;display:inline-block;width:35mm;">
                        <svg viewBox="143.95 58.223 217 116.7962" xmlns="http://www.w3.org/2000/svg" class="">
                            <path
                                d="M 143.95 166.723 C 143.95 152.475 146.757 138.366 152.209 125.202 C 157.662 112.038 165.654 100.078 175.729 90.002 C 185.804 79.927 197.765 71.935 210.929 66.483 C 224.093 61.03 238.202 58.223 252.45 58.223 C 266.698 58.223 280.807 61.03 293.971 66.483 C 307.135 71.935 319.096 79.927 329.171 90.002 C 339.246 100.078 347.238 112.038 352.691 125.202 C 358.144 138.366 360.95 152.475 360.95 166.723 L 324.5 166.723 C 324.5 157.262 322.636 147.893 319.016 139.151 C 315.395 130.41 310.088 122.467 303.397 115.776 C 296.707 109.086 288.764 103.779 280.022 100.158 C 271.281 96.537 261.912 94.673 252.45 94.673 C 242.988 94.673 233.619 96.537 224.878 100.158 C 216.136 103.779 208.194 109.086 201.503 115.776 C 194.813 122.467 189.505 130.41 185.885 139.151 C 182.264 147.893 180.4 157.262 180.4 166.723 L 143.95 166.723 Z"
                                fill="${getColor(report_data.summary?.clients?.score)}" transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -7.105427357601002e-15, 0)">
                            </path>
                            <path d="M 242.76 167.81 L 253.151 76.394 L 263.938 165.652 C 263.17 180.517 243.264 178.361 242.76 167.81 Z"
                                fill="#004261" transform="matrix(0.000004000001, -1, 1, 0.000004000001, -0.000002551164, -0.000012428075)"
                                style="transform-origin: 253.04px 164.74px; rotate: ${calculateNeedleRotation(report_data.summary?.clients.score)}deg">
                            </path>
                        </svg>
                        <div style="text-align: center;margin-top:2mm;">
                            <div>Clients</div>
                            <div>${formatDecimal(report_data.summary?.clients.score)}</div>
                        </div>
                    </div>`

    } 
    
    if(report_data?.summary?.team?.score){
        team_report = `<div style="padding-inline:2mm;display:inline-block;width:35mm;">
                        <svg viewBox="143.95 58.223 217 116.7962" xmlns="http://www.w3.org/2000/svg" class="">
                            <path
                                d="M 143.95 166.723 C 143.95 152.475 146.757 138.366 152.209 125.202 C 157.662 112.038 165.654 100.078 175.729 90.002 C 185.804 79.927 197.765 71.935 210.929 66.483 C 224.093 61.03 238.202 58.223 252.45 58.223 C 266.698 58.223 280.807 61.03 293.971 66.483 C 307.135 71.935 319.096 79.927 329.171 90.002 C 339.246 100.078 347.238 112.038 352.691 125.202 C 358.144 138.366 360.95 152.475 360.95 166.723 L 324.5 166.723 C 324.5 157.262 322.636 147.893 319.016 139.151 C 315.395 130.41 310.088 122.467 303.397 115.776 C 296.707 109.086 288.764 103.779 280.022 100.158 C 271.281 96.537 261.912 94.673 252.45 94.673 C 242.988 94.673 233.619 96.537 224.878 100.158 C 216.136 103.779 208.194 109.086 201.503 115.776 C 194.813 122.467 189.505 130.41 185.885 139.151 C 182.264 147.893 180.4 157.262 180.4 166.723 L 143.95 166.723 Z"
                                fill="${getColor(report_data.summary?.team.score)}" transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -7.105427357601002e-15, 0)">
                            </path>
                            <path d="M 242.76 167.81 L 253.151 76.394 L 263.938 165.652 C 263.17 180.517 243.264 178.361 242.76 167.81 Z"
                                fill="#004261" transform="matrix(0.000004000001, -1, 1, 0.000004000001, -0.000002551164, -0.000012428075)"
                                style="transform-origin: 253.04px 164.74px; rotate: ${calculateNeedleRotation(report_data.summary?.team.score)}deg">
                            </path>
                        </svg>
                        <div style="text-align: center;margin-top:2mm;">
                            <div>Team</div>
                            <div>${formatDecimal(report_data.summary?.team.score)}</div>
                        </div>
                    </div>`
    }
    
    
    if(report_data?.client_nps?.score && report_data?.team_nps?.score){
        main_keypoints = `<li>Your client NPS of ${formatDecimal(report_data.client_nps.score)} is ${report_data.client_nps.quality}</li>
        <li>Your team satisfaction was ${report_data.team_nps.score} out of 10 which is ${report_data.team_nps.quality}</li>`

    } else {

        main_keypoints = `<li>Upgrade now to view client NPS</li><li>Upgrade now to view team satisfaction</li>`
    }
    
   


    let firstPage = `<div class="page" style="font-family: 'Arial', sans-serif, system-ui;
            background-color: #ffffff;
            width: 210mm !important;
            height: 297mm !important;
            padding: 10mm 15mm !important;
            overflow: clip;
            margin: auto;
            font-size: 4.2mm;
            position:relative;
                      page-break-before: always;
                page-break-after: always;
                page-break-inside: avoid;">

            <img class="rmc_logo" src="https://app.ratemyclinic.com.au/images/logos/rmc-logo.png" alt=""
                style="margin-inline:auto;margin-bottom:12mm;width:55m;height:30mm;display:block;">

            <div>
                <div class="main_chart" style="   position: relative;
                width: 55mm !important;
                height: 55mm !important;
                margin: 0 auto 12mm;
                display: block;">
                    <div class="center_text" style="position: absolute;
                    top: 50%;
                    left: 50%;
                    text-align: center;
                    transform: translate(-50%, -50%);">
                        <div class="mine" style="font-size: 6mm;font-weight: 600;">${formatDecimal(report_data.overall_mine)}</div>
                        <div style=" font-size: 4mm;
                        font-weight: 600;
                        color:${overall_diff_color};">${overall_diff_value_sign}${formatDecimal(overall_diff_value)}</div>
                    </div>
                    <svg class="circleChart" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    style="    display: block;
                    margin: 0 auto;
                    width: 55mm !important;
                    height: 55mm !important;
                    stroke-dasharray: 60;
                    stroke-dashoffset: 60;
                    rotate: 270deg;
                    transform-origin: center;">
                        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="#e5e7eb" stroke-width="4" style="stroke-dashoffset: 0;"></path>
                        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="#004261" stroke-width="4"
                            style="stroke-dashoffset: 24.99;"></path>
                        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="#94BDE5" stroke-width="4"
                            style="stroke-dashoffset: 40.2;"></path>
                    </svg>
                </div>
                <div style="width:fit-content;margin:0 auto;">
                    <div style="margin-bottom:2mm;">
                        <div
                            style="display: inline-block;width: 6mm;height: 6mm;background:#94BDE5;vertical-align: middle;line-height: 0;">
                        </div>
                        <span style="display: inline-block;font-size: 6mm;line-height: 1;vertical-align: middle;"><span
                                style="margin-left:2mm;">Overall Rating: </span>
                            <span>${formatDecimal(report_data.overall_mine)}</span>
                        </span>
                    </div>

                    <div>
                        <div
                            style="display: inline-block;width: 6mm;height: 6mm;background:#004261;vertical-align: middle;line-height: 0;">
                        </div>
                        <span style="display: inline-block;line-height: 1;vertical-align: middle;">
                            <span
                                style="margin-left:2mm;">Average Australian Clinic: </span>
                            <span>${formatDecimal(report_data.overall_other)}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div style="border-top:solid 1px #bbbbbb;margin: 12mm 0;"></div>
            <div style="margin-bottom:12mm;">
                <div style="width:fit-content;margin-inline:auto;">
                    
                    ${client_report}
                    ${team_report}
                    <div style="padding-inline:2mm;display:inline-block;width:35mm;">
                        <svg viewBox="143.95 58.223 217 116.7962" xmlns="http://www.w3.org/2000/svg" class="">
                            <path
                                d="M 143.95 166.723 C 143.95 152.475 146.757 138.366 152.209 125.202 C 157.662 112.038 165.654 100.078 175.729 90.002 C 185.804 79.927 197.765 71.935 210.929 66.483 C 224.093 61.03 238.202 58.223 252.45 58.223 C 266.698 58.223 280.807 61.03 293.971 66.483 C 307.135 71.935 319.096 79.927 329.171 90.002 C 339.246 100.078 347.238 112.038 352.691 125.202 C 358.144 138.366 360.95 152.475 360.95 166.723 L 324.5 166.723 C 324.5 157.262 322.636 147.893 319.016 139.151 C 315.395 130.41 310.088 122.467 303.397 115.776 C 296.707 109.086 288.764 103.779 280.022 100.158 C 271.281 96.537 261.912 94.673 252.45 94.673 C 242.988 94.673 233.619 96.537 224.878 100.158 C 216.136 103.779 208.194 109.086 201.503 115.776 C 194.813 122.467 189.505 130.41 185.885 139.151 C 182.264 147.893 180.4 157.262 180.4 166.723 L 143.95 166.723 Z"
                                fill="${getColor(report_data.summary.strategy.score)}" transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -7.105427357601002e-15, 0)">
                            </path>
                            <path d="M 242.76 167.81 L 253.151 76.394 L 263.938 165.652 C 263.17 180.517 243.264 178.361 242.76 167.81 Z"
                                fill="#004261" transform="matrix(0.000004000001, -1, 1, 0.000004000001, -0.000002551164, -0.000012428075)"
                                style="transform-origin: 253.04px 164.74px; rotate: ${calculateNeedleRotation(report_data.summary.strategy.score)}deg">
                            </path>
                        </svg>
                        <div style="text-align: center;margin-top:2mm;">
                            <div>Strategy</div>
                            <div>${formatDecimal(report_data.summary.strategy.score)}</div>
                        </div>
                    </div>
                  
                    <div style="padding-inline:2mm;display:inline-block;width:35mm;">
                        <svg viewBox="143.95 58.223 217 116.7962" xmlns="http://www.w3.org/2000/svg" class="">
                            <path
                                d="M 143.95 166.723 C 143.95 152.475 146.757 138.366 152.209 125.202 C 157.662 112.038 165.654 100.078 175.729 90.002 C 185.804 79.927 197.765 71.935 210.929 66.483 C 224.093 61.03 238.202 58.223 252.45 58.223 C 266.698 58.223 280.807 61.03 293.971 66.483 C 307.135 71.935 319.096 79.927 329.171 90.002 C 339.246 100.078 347.238 112.038 352.691 125.202 C 358.144 138.366 360.95 152.475 360.95 166.723 L 324.5 166.723 C 324.5 157.262 322.636 147.893 319.016 139.151 C 315.395 130.41 310.088 122.467 303.397 115.776 C 296.707 109.086 288.764 103.779 280.022 100.158 C 271.281 96.537 261.912 94.673 252.45 94.673 C 242.988 94.673 233.619 96.537 224.878 100.158 C 216.136 103.779 208.194 109.086 201.503 115.776 C 194.813 122.467 189.505 130.41 185.885 139.151 C 182.264 147.893 180.4 157.262 180.4 166.723 L 143.95 166.723 Z"
                                fill="${getColor(report_data.summary.finance.score)}" transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -7.105427357601002e-15, 0)">
                            </path>
                            <path d="M 242.76 167.81 L 253.151 76.394 L 263.938 165.652 C 263.17 180.517 243.264 178.361 242.76 167.81 Z"
                                fill="#004261" transform="matrix(0.000004000001, -1, 1, 0.000004000001, -0.000002551164, -0.000012428075)"
                                style="transform-origin: 253.04px 164.74px; rotate: ${calculateNeedleRotation(report_data.summary.finance.score)}deg">
                            </path>
                        </svg>
                        <div style="text-align: center;margin-top:2mm;">
                            <div>Finance</div>
                            <div>${formatDecimal(report_data.summary.finance.score)}</div>
                        </div>
                    </div>

                </div>
            </div>

            <div style="margin-bottom:12mm;">
                <h1 style="font-size:8mm; font-weight: 600;">Overview</h1>
                <p style="margin-bottom:12mm">
                    <strong>${report_data.clinic_name}</strong> is a successful clinic by some metrics. There are however, areas to
                    improve. Our aim in this report is to break down each section that we rated and provide various
                    recommendations on how you can improve your rating.
                </p>
                <div>
                    <h2 style="font-size:5mm; font-weight: 600;">Key points include:</h2>
                    <ul style="all:revert;">
                        ${main_keypoints}
                    </ul>
                </div>
            </div>
        ${pdfFooter}
        </div>`

    function createPageTemplate({
        category = '',
        my_score = '',
        other_score = '',
        recommendations = [],
    }) {
        if(!category) return false
        let scoreDifference = Number(my_score) - Number(other_score)
        let scoreColor = scoreDifference > 0 ? '#22c55e' : '#f87171'
        let scoreSign = scoreDifference > 0 ? '+' : ''

        let score_type = 'in line with'
        let meter_color1 = getColor(Number(my_score))
        let meter_color2 = getColor(Number(other_score))
        let needle_rotation1 = calculateNeedleRotation(Number(my_score))
        let needle_rotation2 = calculateNeedleRotation(Number(other_score))

        const scoreTypeList = ['below','in line with', 'above']
    
        if(scoreDifference < 0){
            score_type = scoreTypeList[0]
        } else if(scoreDifference == 0){
            score_type = scoreTypeList[1]
        } else if(scoreDifference > 0){
            score_type = scoreTypeList[2]
        }

        let pageTemplate = `<div class="page" style="font-family: 'Arial', sans-serif, system-ui;
        background-color: #ffffff;
        width: 210mm !important;
        height: 297mm !important;
        padding: 10mm 15mm !important;
        overflow: clip;
        margin: auto;
        font-size: 4.2mm;
        position:relative;
                  page-break-before: always;
                page-break-after: always;
                page-break-inside: avoid;">
            <div style="margin-bottom:12mm;">
                <h1 style="font-size:8mm; font-weight: 600;">${capitalizeFirstLetter(category)}: <span style="color:${scoreColor};">${scoreSign}${scoreDifference.toFixed(1)}</span></h1>
            </div>

            <div style="margin:auto;margin-bottom:12mm;display:block;text-align:center;">
                <div style="margin:auto;padding-inline:2mm;display:inline-block;width:80mm;">
                    <p>Your Score</p>
                    <svg viewBox="143.95 58.223 217 116.7962" xmlns="http://www.w3.org/2000/svg" class="">
                        <path
                            d="M 143.95 166.723 C 143.95 152.475 146.757 138.366 152.209 125.202 C 157.662 112.038 165.654 100.078 175.729 90.002 C 185.804 79.927 197.765 71.935 210.929 66.483 C 224.093 61.03 238.202 58.223 252.45 58.223 C 266.698 58.223 280.807 61.03 293.971 66.483 C 307.135 71.935 319.096 79.927 329.171 90.002 C 339.246 100.078 347.238 112.038 352.691 125.202 C 358.144 138.366 360.95 152.475 360.95 166.723 L 324.5 166.723 C 324.5 157.262 322.636 147.893 319.016 139.151 C 315.395 130.41 310.088 122.467 303.397 115.776 C 296.707 109.086 288.764 103.779 280.022 100.158 C 271.281 96.537 261.912 94.673 252.45 94.673 C 242.988 94.673 233.619 96.537 224.878 100.158 C 216.136 103.779 208.194 109.086 201.503 115.776 C 194.813 122.467 189.505 130.41 185.885 139.151 C 182.264 147.893 180.4 157.262 180.4 166.723 L 143.95 166.723 Z"
                            fill="${meter_color1}" transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -7.105427357601002e-15, 0)">
                        </path>
                        <path d="M 242.76 167.81 L 253.151 76.394 L 263.938 165.652 C 263.17 180.517 243.264 178.361 242.76 167.81 Z"
                            fill="#004261" transform="matrix(0.000004000001, -1, 1, 0.000004000001, -0.000002551164, -0.000012428075)"
                            style="transform-origin: 253.04px 164.74px; rotate: ${needle_rotation1}deg;">
                        </path>
                    </svg>
                    <div style="text-align: center;margin-top:2mm;">
                        <div>${formatDecimal(my_score)}</div>
                    </div>
                </div>
                <div style="margin:auto;padding-inline:2mm;display:inline-block;width:80mm;">
                    <p>Australian Clinic Average</p>
                    <svg viewBox="143.95 58.223 217 116.7962" xmlns="http://www.w3.org/2000/svg" class="">
                        <path
                            d="M 143.95 166.723 C 143.95 152.475 146.757 138.366 152.209 125.202 C 157.662 112.038 165.654 100.078 175.729 90.002 C 185.804 79.927 197.765 71.935 210.929 66.483 C 224.093 61.03 238.202 58.223 252.45 58.223 C 266.698 58.223 280.807 61.03 293.971 66.483 C 307.135 71.935 319.096 79.927 329.171 90.002 C 339.246 100.078 347.238 112.038 352.691 125.202 C 358.144 138.366 360.95 152.475 360.95 166.723 L 324.5 166.723 C 324.5 157.262 322.636 147.893 319.016 139.151 C 315.395 130.41 310.088 122.467 303.397 115.776 C 296.707 109.086 288.764 103.779 280.022 100.158 C 271.281 96.537 261.912 94.673 252.45 94.673 C 242.988 94.673 233.619 96.537 224.878 100.158 C 216.136 103.779 208.194 109.086 201.503 115.776 C 194.813 122.467 189.505 130.41 185.885 139.151 C 182.264 147.893 180.4 157.262 180.4 166.723 L 143.95 166.723 Z"
                            fill="${meter_color2}" transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, -7.105427357601002e-15, 0)">
                        </path>
                        <path d="M 242.76 167.81 L 253.151 76.394 L 263.938 165.652 C 263.17 180.517 243.264 178.361 242.76 167.81 Z"
                            fill="#004261" transform="matrix(0.000004000001, -1, 1, 0.000004000001, -0.000002551164, -0.000012428075)"
                            style="transform-origin: 253.04px 164.74px; rotate: ${needle_rotation2}deg;">
                        </path>
                    </svg>
                    <div style="text-align: center;margin-top:2mm;">
                        <div>${formatDecimal(other_score)}</div>
                    </div>
                </div>
            </div>


            <div style="margin-bottom:12mm;">
                <h2 style="font-size:5mm; font-weight: 600;">Key points include:</h2>
                <ul style="all:revert;">
                    <li>Your score is ${score_type} the current national average</li>
                </ul>
            </div>
            <div style="margin-bottom:12mm;">
                <h2 style="font-size:5mm; font-weight: 600;">Recommendations:</h2>
                <ul style="all:revert;">
                    ${recommendations.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
            ${pdfFooter}
        </div>`

        return pageTemplate
    }

    let categories = Object.keys(report_data.summary).filter(i => report_data.summary[i].score)

    let otherPages = categories.map(i => {
        let sampleData = {
            category: i,
            my_score: report_data.summary[i].score,
            other_score: report_data.other_summary[i].score,
            score_type: 'low',
            meter_color1: '#f87171',
            meter_color2: '#f87171',
            needle_rotation1: '0',
            needle_rotation2: '0',
            recommendations: report_data.recommendations[i],
        }

        const template = createPageTemplate(sampleData)
        return template

    })


    return `<div id="rmc_report">
    ${firstPage}
    ${otherPages.join('')}
    </div>`
}




function capitalizeFirstLetter(str:string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  