import mongoose, { InferSchemaType } from "mongoose";
const user_schema = new mongoose.Schema({
  username: {
    type: String,
  },
  fname: {
    type: String,
    required: true,
    min: 3,
    max: 20
  },
  lname: {
    type: String,
    required: true,
    min: 3,
    max: 20
  },
  useremail: {
    type: String,
    required: true,
    unique: true,
  },
  usermobile: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  clinic_name: {
    type: String,
  },
  clinic_type: {
    type: String,
  },
  clinic_location_address1: {
    type: String,
  },
  clinic_location_address2: {
    type: String,
    default: "",
  },
  clinic_location_state: {
    type: String,
  },
  clinic_location_country: {
    type: String,
  },
  clinic_location_postcode: {
    type: String,
  },
  clinic_established: {
    type: String,
  },
  clinic_logo: {
    type: String,
  },
  subscription_level: {
    type: String,
    default: "0"
  },
  subscription_id: {
    type: String,
    default: "0"
  },
  subscription_product_id:{
    type: String
  },
  last_checkout_session_id:{
    type: String
  },
  checkout_sessions: {
    type: [
      {
        date: {
          type: Date,
        },
        checkout_id:{
          type: String
        },
        subscription_level: {
          type: String, 
        },
      }
    ]
  },
  profile_pic: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  reports: {
    type: [
      {
        date: {
          type: Date,
          required: true,
        },
        pdf_link:{
          type: String
        },
        data: {
          type: String, 
          required: true, 
        },
      },
    ],
    default: [], 
  },

}, { timestamps: true });

const userMetaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  stripeSessionInfo: {
    type: Object,
    default: {},
  },
  otherData: {
    type: Object,
    default: {},
  },
}, { timestamps: true });


const clientSurveyDataSchema = new mongoose.Schema({
  clinicid: {
    type: String,
    required: true,
  },
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  recommendation: {
    type: String,
    required: true,
  },
  recommendation_feedback: {
    type: String,
    required: true,
  },
  recommendedPreviously: {
    type: String,
    required: true,
  },
  servicesUsed: {
    type: String,
    required: true,
  },
  practitioner  : {
    type: Number,
    required: true,
  },
  receptionTeam: {
    type: Number,
    required: true,
  },
  lookAndFeel: {
    type: Number,
    required: true,
  },
  communication: {  
    type: Number,
    required: true,
  },
  bookingProcess: {
    type: Number,
    required: true,
  },
  valueForMoney: {
    type: Number,
    required: true,
  },
  website: {  
    type: Number,
    required: true,
  },
  improvementSuggestion: {
    type: String,
  },
  socialMediaUsed: {
    type: String,
  },
  followUpBookingConfirmation: {
    type: String,
    required: true,
  },
  group_age: {
    type: String,
    required: true,
  },
  comments_questions: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
  
}, { timestamps: true });

const teamSurveyDataSchema = new mongoose.Schema({
  clinicId: {
    type: String,
    required: true,
  },
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  recommendation: {
    type: Number,
    required: true,
  },
  socialActivities: {
    type: Number,
    required: true,
  },
  communication: {
    type: Number,
    required: true,
  },
  professionalDevelopment: {
    type: Number,
    required: true,
  },
  mentoring: {
    type: Number,
    required: true,
  },
  teamWork: {
    type: Number,
    required: true,
  },
  improvements: {
    type: String,
    required: true,
  },
  strengths: {
    type: String,
    required: true,
  },
  communicationRating: {
    type: Number,
    required: true,
  },
  needsImprovement: {
    type: String,
    required: true,
  },
  rewardComparison: {
    type: String,
    required: true,
  },
  serviceKnowledge: {
    type: Number,
    required: true,
  },
  additionalComments: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const ownerSurveyDataSchema = new mongoose.Schema({
  clinic_id: {
    type: String,
    required: true,
  },
  owner_fname: {
    type: String,
    required: true,
  },
  owner_lname: {
    type: String,
    required: true,
  },
  owner_email: {
    type: String,
    required: true,
  },
  owner_mobile: {
    type: String,
    required: true,
  },
  clinic_name: {
    type: String,
    required: true,
  },
  clinic_location_address1: {
    type: String,
    default: "", // Default empty string
  },
  clinic_location_address2: {
    type: String,
    default: "", // Default empty string
  },
  clinic_location_state: {
    type: String,
    required: true,
  },
  clinic_location_country: {
    type: String,
    required: true,
  },
  clinic_location_postcode: {
    type: String,
    required: true,
  },
  clinic_established: {
    type: String,
    required: true,
  },
  clinic_logo: {
    type: String,
    default: "", // Default empty string
  },
  services_provided: {
    type: String,
  },
  ndis_clients: {
    type: String,
  },
  own_building: {
    type: String,
    default: "", // Default empty string
  },
  pay_market_rent: {
    type: String,
    default: "", // Default empty string
  },
  market_rate_difference: {
    type: Number,
    default: 0, // Default value of 0
  },
  group_classes: {
    type: String,
    default: "", // Default empty string
  },
  classes_per_week: {
    type: Number,
    default: 0, // Default value of 0
  },
  practice_management_software: {
    type: String,
    default: "", // Default empty string
  },
  initial_consult_charge: {
    type: Number,
    default: 0, // Default value of 0
  },
  initial_consult_duration: {
    type: Number,
    default: 0, // Default value of 0
  },
  followup_consult_charge: {
    type: Number,
    default: 0, // Default value of 0
  },
  followup_consult_duration: {
    type: Number,
    default: 0, // Default value of 0
  },
  current_business_plan: {
    type: String,
    default: "", // Default empty string
  },
  plan_execution: {
    type: Number,
    default: 0, // Default value of 0
  },
  plan_review_timeline: {
    type: Number,
    default: 0, // Default value of 0
  },
  exit_plan: {
    type: String,
    default: "", // Default empty string
  },
  leave_comfort_level: {
    type: Number,
    default: 0, // Default value of 0
  },
  treating_hours: {
    type: Number,
    default: 0, // Default value of 0
  },
  managing_hours: {
    type: Number,
    default: 0, // Default value of 0
  },
  pay_treating_clients: {
    type: Number,
    default: 0, // Default value of 0
  },
  pay_managing_business: {
    type: Number,
    default: 0, // Default value of 0
  },
  turnover: {
    type: Number,
    default: 0, // Default value of 0
  },
  profit: {
    type: Number,
    default: 0, // Default value of 0
  },
  total_wages: {
    type: Number,
    default: 0, // Default value of 0
  },
  non_clinician_wages: {
    type: Number,
    default: 0, // Default value of 0
  },
  rent: {
    type: Number,
    default: 0, // Default value of 0
  },
  cash_reserves: {
    type: Number,
    default: 0, // Default value of 0
  },
  client_survey: {
    type: String,
    default: "", // Default empty string
  },
  last_client_survey: {
    type: Number,
    default: 0, // Default value of 0
  },
  email_software: {
    type: String,
    default: "", // Default empty string
  },
  client_source: {
    type: String,
    default: "", // Default empty string
  },
  written_treatment_plans: {
    type: String,
    default: "", // Default empty string
  },
  employee_satisfaction_survey: {
    type: String,
    default: "", // Default empty string
  },
  last_employee_survey: {
    type: Number,
    default: 0, // Default value of 0
  },
  number_of_clinicians: {
    type: Number,
    default: 0, // Default value of 0
  },
  number_of_non_clinicians: {
    type: Number,
    default: 0, // Default value of 0
  },
  work_life_balance: {
    type: Number,
    default: 0, // Default value of 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });



export const Users = mongoose.models.Users || mongoose.model("Users", user_schema);
export const UserMeta = mongoose.models.UserMeta || mongoose.model("UserMeta", userMetaSchema);
export const DB_TeamSurveyData = mongoose.models.TeamSurveyData || mongoose.model("TeamSurveyData", teamSurveyDataSchema);
export const DB_ClientSurveyData = mongoose.models.ClientSurveyData || mongoose.model("ClientSurveyData", clientSurveyDataSchema);
export const DB_OwnerSurveyData = mongoose.models.OwnerSurveyData || mongoose.model("OwnerSurveyData", ownerSurveyDataSchema);


export type UserType = InferSchemaType<typeof user_schema>;

