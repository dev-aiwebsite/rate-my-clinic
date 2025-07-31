"use client"
import SummaryOverview from "components/summary-overview";
import SyncButton from "components/sync-btn";
import HelperCard from "components/helperCard";
import Link from "next/link";
import CircleChart from "components/circle-chart";
import { useSessionContext } from "@/context/sessionContext";
import { useSurveyDataContext } from "@/context/surveyDataContext";
import { usePathname } from "next/navigation";
import AppAcess from "lib/appAccess";
import { isProfileCompleteCheckList, reportGenDays } from "lib/Const";
import { getClientNps, getTeamNps, hasPassedMaxDays } from "lib/helperFunctions";
import {useState } from "react";
import ClinicWorth from "components/ClinicWorth";
import { Dialog } from "primereact/dialog";
import FeatureWidget from "components/FeatureWidget";


const defaultNps = [
    {
        name: 'Group A',
        value: 0,
        color: '#94BDE5',
    },
]

export default function Page({searchParams}:{searchParams:any}){ 
    const isDisplayFeatureDialogLink = searchParams.appfeature == "" ? true : false
    
    const [appFeatureDialogVisible, setAppFeatureDialogVisible] = useState(true)
    const {data} = useSurveyDataContext()
    const {currentUser} = useSessionContext()
    const [isDisplayFeatureDialog, setIsDisplayFeatureDialog] = useState(isDisplayFeatureDialogLink)
    // const [lastCheckoutSession, setLastCheckoutSession] = useState<undefined | Stripe.Response<Stripe.Checkout.Session>>()
    const pathname = usePathname()
    // useEffect(()=> {
    //     const getLastSession = async () => {
    //         let lastCheckoutSession =  await retrieveCheckoutSession(currentUser.last_checkout_session_id)
    //         setLastCheckoutSession(lastCheckoutSession)
    //         return lastCheckoutSession
    //     }
    //     getLastSession()
    
    // },[])
    if(!currentUser) return null
    const lastCheckoutSession = currentUser.lastCheckoutSession_data
    let tocheck = isProfileCompleteCheckList
    const isProfileComplete = tocheck.every(i => currentUser[i])

    const userAccess = AppAcess(Number(currentUser.subscription_level) || 0)
    let charts = userAccess?.charts
    let userName = currentUser?.username || "Guest"
    
    console.log(currentUser, 'currentUser')
    console.log(data, 'data dashboardpage')
    let is_ownerSurveyData_complete = data?.ownerSurveyData ? true : false
    let showReport = false

    let clientNps = defaultNps,
    teamNps = defaultNps,
    clientNpsAvg = "0",
    teamNpsAvg = "0"
    
    let startDate = currentUser.createdAt



    if(lastCheckoutSession){
        const subscriptionStartDate = new Date(lastCheckoutSession.created * 1000);
        startDate = subscriptionStartDate
    }

    const {hasPassed, remainingDays, maxEndDate} = hasPassedMaxDays(startDate,reportGenDays)
    console.log(charts, 'charts')
    if(is_ownerSurveyData_complete){
        
        if (charts.includes('team') && charts.includes('clients')) {

            if(data){
                let filteredData = data.clientSurveyData.filter((i:any)=> i.clinicid == currentUser._id)
                let filteredData_team = data.teamSurveyData.filter((i:any)=> i.clinicId == currentUser._id)

                const clientNpsInfo = getClientNps(filteredData);
                clientNpsAvg = clientNpsInfo.score;
        
                const teamNpsInfo = getTeamNps(filteredData_team)
                teamNpsAvg = teamNpsInfo.score;

            }

    

        }
    
        clientNps = [
            {
                name: 'Group A',
                value: Number(clientNpsAvg),
                color: '#94BDE5',
            },
        ]
    
        teamNps = [
            {
                name: 'Group A',
                value: Number(teamNpsAvg),
                color: '#94BDE5',
            },
        ]
    }

    let headerInfoText = ''

    let hasReport = false
    if(is_ownerSurveyData_complete){
        // if(currentUser.subscription_level < 1){
        //     let report = currentUser.reports
        //     if(report.length){
                
        //         headerInfoText = `Your final report is generated`
        //         showReport = true
        //         hasReport = true
        //     } else {
        //         hasReport = false
        //     }

        // } else 
        if(!hasPassed){
            headerInfoText = `You have ${remainingDays} days till your final report is generated`
        } else {
            let report = currentUser.reports
            if(report.length){
                headerInfoText = `Your final report is generated`
                showReport = true
                hasReport = true
            } else {
                hasReport = false
            }
        }

    } else {
         headerInfoText = 'To access app functionality, please complete the Owner survey.'
    }

    console.log(currentUser, 'currentUser dashboard page')

    return (<><div className="bg-transparent flex-1 p-6 gap-x-6 gap-y-10 max-md:flex max-md:flex-row max-md:flex-wrap md:grid md:grid-cols-3">
            <div className="card hidden col-span-3 row-span-1 md:flex flex-row items-center justify-between">
                <div>
                    <h1 className="text-2xl inline-block mr-2 capitalize">{userName}</h1>
                    <span className="text-gray-400 text-base">{headerInfoText} {!is_ownerSurveyData_complete && 
                        <Link className="inline-flex btn btn-primary " href="/dashboard/owner-survey">Owner survey</Link>
                    }</span>
                </div>
                <div className="m-w-42">
                    <SyncButton/>
                </div>
                </div>
           
                <SummaryOverview enabled={charts} showReport={showReport} surveyData={data} additionalClass={`card max-md:basis-full !px-0 md:*:px-6 gap-6 ${is_ownerSurveyData_complete ? "" : 'disabled'}`}/>
                <div className="card md:row-span-1 max-md:basis-full flex items-center justify-center bg-custom-gradient text-white tracking-wide">
                    <ClinicWorth />
                </div>
                <div className="card md:row-span-1 max-md:basis-full grid grid-cols-2">
                    <div className={`h-fit ${is_ownerSurveyData_complete ? "" : 'disabled'}`}>
                        <Link className="h-full gap-5 flex flex-wrap flex-row items-center justify-around" href="/dashboard/nps?nps=client">
                            <div className="flex-1 min-w-24 grid items-center md:justify-around">
                                <p>Client NPS</p>
                                <p className="md:hidden font-medium underline text-orange-400 hover:text-orange-500">View Chart</p>
                            </div>
                            <CircleChart className="!max-w-36" data={clientNps} max={100}/>
                            <div className="max-sm:hidden flex-1 min-w-24 grid items-center md:justify-around">
                                <p className="text-xs font-medium underline text-orange-400 hover:text-orange-500">View Chart</p>
                            </div>
                        </Link>
                    </div>
                    <div className={`h-fit ${is_ownerSurveyData_complete ? "" : 'disabled'}`}>
                        <Link className="h-full gap-5 flex flex-wrap flex-row items-center justify-around" href="/dashboard/nps?nps=team">
                            <div className="flex-1 min-w-24 grid items-center md:justify-around">
                                <p>Team Satisfaction</p>
                                <p className="md:hidden font-medium underline text-orange-400 hover:text-orange-500">View Chart</p>
                            </div>
                            <CircleChart className="!max-w-36" data={teamNps} max={10}/>
                            <div className="max-sm:hidden flex-1 min-w-24 grid items-center md:justify-around">
                                <p className="text-xs font-medium underline text-orange-400 hover:text-orange-500">View Chart</p>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className={`card items-center content-center md:row-span-1 !p-0 max-md:basis-full ${is_ownerSurveyData_complete ? "" : 'disabled'}`}>
                    <HelperCard className="!ring-0"/>
                </div>
           
            
        </div>

       {(!isProfileComplete || isDisplayFeatureDialog) && <Dialog className="rounded-lg" header="App Features" visible={appFeatureDialogVisible} style={{ width: '95vw', maxWidth: "1000px" }} onHide={() => {if (!appFeatureDialogVisible) return; setAppFeatureDialogVisible(false); }}  pt={{
    content: {
      className: "!p-0 !rounded-b-2xl",
    },
    header: {
        className: "!rounded-t-2xl"
    }
  }}>
            <FeatureWidget />
        </Dialog>}
        </>
    )};



