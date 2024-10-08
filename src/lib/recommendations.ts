import { secondsInDay } from "date-fns/constants";

export type Tcategory = 'team' | 'clients' | 'strategy' | 'finance'

type TrecommendationBank = {
    [key:string]:any
    team: {
        teamWork: {
            under: string[];
        };
        communication: {
            under: string[];
        };
        serviceKnowledge: {
            under: string[];
        };
        all: string[];
    };
    clients: {
        score: {
            under: string[];
            over: never[];
        };
        all: string[];
    };
    strategy: {
        current_business_plan: {
            [key:string]:any
            yes: string[];
            no: string[];
        };
        score: {
            under: string[];
            over: string[];
        };
    }
    finance: {
        score: {
            under: string[];
            over: never[];
            all: string[];
        };
    }
}

export const recommendationBank:TrecommendationBank = {
    team: {
        teamWork: {
            // less than 8
            under: [`It seems your team may benefit from some training on teamwork. Click here to ask us about some options.`]
        },
        communication: {
            under: [`It seems your team may benefit from some training on communciation. Click here to ask us about some options.`]
        },
        serviceKnowledge: {
            under: [`We recommend you incorporate service training sessions for your team so they feel more comfortable in explaining what you do to clients.`]
        },
        all: [
            `Review all staff comments and action as appropriate. `,
            `If not already in place, consider implementing individual development/retention plans to help increase engagement and tenure. These are done annually (reviewed mid-year with coffee check-ins quarterly) and contain specific goals and incentives for each team member. `,
            `If not already in place, consider having a team workshop (followed by a fun event) where everyone contributes to topics like operations improvement, delighting our clients, marketing what we do and creating an even better work environment. A perfect opportunity to do this asap using your assessment results.`,
            `Work on how you can improve communication amongst the team.`,
            `If not already in place, implement a detailed onboarding process for all new staff.`,
        ]

    },
    clients: {
        score: {
            // Any result less than a 70 NPS should trigger this comment
            under: [
                "Based on your NPS result, you may be in need of some help to improve it as it is well below the average. Click here to find out more.",
            ],
            over: [],
        },
        all: [
            "Provide feedback to team. There are some wonderful comments that specifically mention team members as well as those that are general in nature. It can do wonders for morale when you know you are part of something that helps so many people!",
            "Review all comments to consider what improvements can be made. Award prize winner and thank all participants in a Facebook post as well as part of your next email.",
            "Ensure you regularly track the source of your new clients split by major categories. E.g. referrals from friend/family, GP referral, Google, Driving/walking by etc.",
            "Repeat this survey in 12 months. It is important to consistently seek feedback as well as tracking your Net Promoter Score.",
            "If not in place, implement a user-friendly online appointment booking system.",
            "If not in place, consider using written treatment plans for all new episodes.",
            "Review your patient follow up process post treatment. Are you sending texts, emails, making phone calls? What works best and how you can you improve the process.",
            "Consider providing educational resources and/or workshops to empower patients in their healthcare journey.",
            "Ensure all staff are trained in excellent customer service and communication skills. We can help you with that training if required.",
            "Offer specialised services that cater to niche markets."
        ],
    },
    strategy: {
        'current_business_plan': {
            yes: ['We recommend you review your business plan quarterly.', 'Contact us if you would benefit from an external review.'],
            no: ['Create your 1 page business plan using our template. Click here to download.', 'We recommend you review your progress quarterly.']
        },
        score: {
            // For all scores under 80 use these:
            under: [
                `Conduct a thorough SWOT analysis to identify strengths, weaknesses, opportunities, and threats.`,
                `Regularly review and update your clinic's strategic plan to align with changing market trends.`,
                `Invest in technology and innovation to streamline operations and improve patient care.`,
                `Develop a comprehensive risk management plan to mitigate potential threats.`,
                `Create or review your practice handbook. This should be a blueprint to everything that happens in your practice. The customer hourney, what happens if the internet goes down etc.`,
            ],
            // For all scores over 80 use this:
            over: [`Your score for Strategy puts you in rare company. It seems you may have everything covered but there are always some improvements. Feel free to contact us for a deeper dive into your strategy.`]
        }

    },
    finance: {
        score: {
            // For any score under 50 use this in addition to below:
            under: [
                `Based on your score, you may benefit from coaching to help increase your financial performance. Book a free call here to discuss whether we can help you.`,
            ],
            over: [],
            all: [
                `Keep increasing fees on a regular basis to ensure you are in line with inflation at the very least.`,
                `Use your accountant for regular financial audits to ensure accurate accounting and compliance. If you do not have a good accountant, please ask us for a recommendation. `,
                `Implement cost-control measures to reduce unnecessary expenses. Sometimes we pay a "lazy" tax by not reviewing utility/telco and other costs regularly.`,
                `If you have not done so, separate management wages on your P&L using an appropriate FTE rate for the amount of management hours you are doing. We are happy to tell you the current rate we are using, email Paul here. `,
                `Review your P&L and Cashflow at least monthly.`,
                `Monitor and analyse financial KPIs regularly to make informed decisions.`,
                `Seek grants and funding opportunities to support clinic expansion and innovation.`,
            ]
        }
    }
}


type Tparams = {
    surveyData:any
    category:Tcategory
}

export const Recommendations = ({surveyData,category}:Tparams) => {
    let recommendations = []
    let selected:number[] = []
    let maxTries = 5
    const min_recommendations = 5

    if(category == 'team'){

        let teamWork = surveyData.teamSurveyData.map((i: { teamWork: any; }) => i.teamWork)
        let communication = surveyData.teamSurveyData.map((i: { communication: any; }) => i.communication)
        let serviceKnowledge = surveyData.teamSurveyData.map((i: { serviceKnowledge: any; }) => i.serviceKnowledge)

        let teamWorkTotal = teamWork.reduce((a: any,b: any) => a + b, 0) / teamWork.length
        let communicationTotal = communication.reduce((a: any,b: any) => a + b, 0) / communication.length
        let serviceKnowledgeTotal = serviceKnowledge.reduce((a: any,b: any) => a + b, 0) / serviceKnowledge.length

        if(!teamWork || !communication || !serviceKnowledge) return recommendations = []
        const choices = [] as string[]
        
        if((teamWorkTotal > 10 && teamWorkTotal < 80) || teamWorkTotal < 8){
            let selection = recommendationBank.team.teamWork.under
            if(selection.length){
                recommendations.push(randomPick(selection))
                choices.push(...selection)
            }
           
        }
        
        if((communicationTotal > 10 && communicationTotal < 80) || communicationTotal < 8){
            let selection = recommendationBank.team.teamWork.under
            if(selection.length){
                recommendations.push(randomPick(selection))
                choices.push(...selection)
            }
        }
        
        if((serviceKnowledgeTotal > 10 && serviceKnowledgeTotal < 80) || serviceKnowledgeTotal < 8){
            let selection = recommendationBank.team.serviceKnowledge.under
            if(selection.length){
                recommendations.push(randomPick(selection))
                choices.push(...selection)
            }
        }

        completeRecommendations(choices,recommendationBank.team.all)

      

    } else if (category == 'clients'){

        let nps = surveyData.clientSurveyData.map((i: { recommendation: any; }) => i.recommendation)
        let npsTotal = nps.reduce((a: any,b: any) => a + Number(b), 0) / nps.length

        if(!npsTotal) return recommendations = []
        const choices = [] as string[]

        if((npsTotal > 10 && npsTotal < 70) || npsTotal < 7){
            let selection = recommendationBank.clients.score.under
            if(selection.length){
                recommendations.push(randomPick(selection))
                choices.push(...selection)
            }
        }

        completeRecommendations(choices,recommendationBank.clients.all)


    } else if (category == 'strategy'){
        let score = surveyData.summary?.strategy?.score || false
        if(!score) return recommendations = []
        const choices = [] as string[]

        if(surveyData.summary.strategy.score <= 80){
            let selection = recommendationBank.strategy.score.under
            if(selection.length){
                recommendations.push(randomPick(selection))
                choices.push(...selection)
            }
        } else {
            let selection = recommendationBank.strategy.score.over
            if(selection.length){
                recommendations.push(randomPick(selection))
                choices.push(...selection)
            }
        }

        completeRecommendations(choices,recommendationBank.strategy.current_business_plan[`${surveyData.ownerSurveyData.current_business_plan}`])

        
        
    } else if (category == 'finance'){

        let score = surveyData.summary?.finance?.score || false
        if(!score) return recommendations = []
        const choices = [] as string[]

        if(score <= 50){
            let selection = recommendationBank.finance.score.under
            if(selection.length){
                recommendations.push(randomPick(selection))
                choices.push(...selection)
            }
        } else {
            let selection = recommendationBank.finance.score.over
            if(selection.length){
                recommendations.push(randomPick(selection))
                choices.push(...selection)
            }
        }

        completeRecommendations(choices,recommendationBank.finance.score.all)
    }


    function completeRecommendations(choices:string[],choices_to_add:string[]){
        if(recommendations.length <= min_recommendations){
            maxTries = min_recommendations - recommendations.length
            if(!choices.length){
                choices.push(...choices_to_add)
            }

            if(maxTries >= choices.length){
                recommendations.push(...choices)            
            } else {
                while (maxTries > 0){
                    let randNum = Math.floor(Math.random() * choices.length)
    
                    if(selected.includes(randNum)) continue
    
                    maxTries--
                    selected.push(randNum)
                    recommendations.push(choices[randNum])
                }
            }
        }
    }


    return recommendations

}

function randomPick(array:any[]) {
    const randNum = Math.floor(Math.random() * array.length)
    const selected = array[randNum]
    array.splice(randNum, 1)
    return selected
}

export default Recommendations