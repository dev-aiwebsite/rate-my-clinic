type TuserAccess = {
    subscription_level: number;
    charts: string[];
    team_surveys: number;
    clinic_surveys: number;
    nps: boolean;
}

const userAccess:TuserAccess[] = [
    {
        subscription_level:0,
        charts: ['clients','strategy','team','finance'],
        team_surveys: 0,
        clinic_surveys: 0,
        nps:true
    },
    {
        subscription_level:1,
        charts: ['clients','strategy','team','finance'],
        team_surveys: 0,
        clinic_surveys: 0,
        nps:true
    },
    {
        subscription_level:2,
        charts: ['clients','strategy','team','finance'],
        team_surveys: 0,
        clinic_surveys: 0,
        nps:true
    },
    {
        subscription_level:3,
        charts: ['clients','strategy','team','finance'],
        team_surveys: 0,
        clinic_surveys: 0,
        nps:true
    },
    {
        subscription_level:4,
        charts: ['clients','strategy','team','finance'],
        team_surveys: 0,
        clinic_surveys: 0,
        nps:true
    },

]
export default function AppAcess(subscription_level:number) {

    const access = userAccess.find(a => a.subscription_level == subscription_level)
    return access ? access : userAccess[0]
    
}