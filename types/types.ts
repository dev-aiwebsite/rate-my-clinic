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
    clients: Record<string, any | null>,
    finance: Record<string, any | null>,
    team: Record<string, any | null>,
    strategy: Record<string, any | null>
}

export type SurveyData = {
    ownerSurveyData: any;
    clientSurveyData: any[];
     teamSurveyData: any[];
     summary: Summary;
     oldData: SurveyOldData[];
     other: any[];
     other_summary: Summary;
     overalls: {other?: number, mine?: number};

}



export type SurveyReportData = {
    Recommendations: {
        clients: string[]
        finance: string[]
        strategy: string[]
        team: string[]
    };
    surveyData: SurveyData
    
  };

  export type SurveyOldData = {
    clients : number
    clinic : string;
    finance : number;
    overall : number;
    strategy : number;
    team : number;
  }

  export interface CheckoutSession {
    date?: Date;
    checkout_id?: string;
    subscription_level?: string;
  }
  
  export interface Report {
    date: Date;
    pdf_link?: string;
    data: string;
  }
  
  export interface User {
    _id?: string; // MongoDB ID, optional in frontend
    username?: string;
    fname: string;
    lname: string;
    useremail: string;
    usermobile?: string;
    password: string;
    role?: string;
    clinic_name?: string;
    clinic_type?: string;
    clinic_location_address1?: string;
    clinic_location_address2?: string;
    clinic_location_state?: string;
    clinic_location_country?: string;
    clinic_location_postcode?: string;
    clinic_established?: string;
    clinic_logo?: string;
    subscription_level?: string;
    subscription_id?: string;
    subscription_product_id?: string;
    last_checkout_session_id?: string;
    checkout_sessions?: CheckoutSession[];
    profile_pic?: string;
    isActive?: boolean;
    isVerified?: boolean;
    isDeleted?: boolean;
    isBlocked?: boolean;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    reports: Report[];
    createdAt: Date;
    updatedAt?: Date;
  }
  