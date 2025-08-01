 export type DropDownOption = {
    name: string,
    code: string,
}

export type SurveyReport = {
    pdf_link: string;
    data: string;
    _id: string;
    date: string;
}

export type Summary = {
    clients: Record<string, number | null>,
    finance: Record<string, number | null>,
    team: Record<string, number | null>,
    strategy: Record<string, number | null>
}

export type SurveyReportData = {
    Recommendations: {
        clients: string[]
        finance: string[]
        strategy: string[]
        team: string[]
    };
    surveyData: {
        ownerSurveyData: any;
        clientSurveyData: any[];
         teamSurveyData: any[];
         summary: Summary;
         oldData: SurveyOldData[];
         other: any[];
         other_summary: Summary;
         overalls: {other?: number, mine?: number};

    }
    
  };

  export type SurveyOldData = {
    clients : number
    clinic : string;
    finance : number;
    overall : number;
    strategy : number;
    team : number;
  }