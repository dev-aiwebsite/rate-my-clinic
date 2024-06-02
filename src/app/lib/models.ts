import mongoose from "mongoose";
const user_schema = new mongoose.Schema({
  username: {
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
  clinic_img: {
    type: String,
    default: ""
  },
  subscription: {
    type: String,
    default: "free"
  },
  img: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
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
    type: Number,
    required: true,
  },
  name: {
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
  social_activities: {
    type: Number,
    required: true,
  },
  communication: {
    type: Number,
    required: true,
  },
  professional_development: {
    type: Number,
    required: true,
  },
  mentoring: {
    type: Number,
    required: true,
  },
  teamwork: {
    type: Number,
    required: true,
  },
  workplace_feedback: {
    type: String,
    required: true,
  },
  clinic_strengths: {
    type: String,
    required: true,
  },
  communication_effectiveness: {
    type: Number,
    required: true,
  },
  improvement_feedback: {
    type: String,
    required: true,
  },
  reward_comparison: {
    type: String,
    required: true,
  },
  service_knowledge: {
    type: Number,
    required: true,
  },
  additional_comments: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const teamSurveyDataSchema = new mongoose.Schema({
  clinicId: {
    type: String,
    required: true,
  },
  name: {
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
}, { timestamps: true });

const ownerSurveyDataSchema = new mongoose.Schema({
  owner_name: {
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
  logo_upload: {
    type: String,
    required: true,
  },
  services_provided: {
    type: String,
    required: true,
  },
  ndis_clients: {
    type: String,
    required: true,
  },
  own_building: {
    type: Boolean,
    required: true,
  },
  pay_market_rent: {
    type: Boolean,
  },
  market_rate_difference: {
    type: Number,
    required: true,
  },
  group_classes: {
    type: Boolean,
    required: true,
  },
  classes_per_week: {
    type: Number,
  },
  practice_management_software: {
    type: String,
    required: true,
  },
  initial_consult_charge: {
    type: Number,
    required: true,
  },
  initial_consult_duration: {
    type: Number,
    required: true,
  },
  followup_consult_charge: {
    type: Number,
    required: true,
  },
  followup_consult_duration: {
    type: Number,
    required: true,
  },
  current_business_plan: {
    type: String,
    required: true,
  },
  plan_execution: {
    type: String,
    required: true,
  },
  plan_review_timeline: {
    type: String,
    required: true,
  },
  exit_plan: {
    type: String,
    required: true,
  },
  leave_comfort_level: {
    type: Number,
    required: true,
  },
  treating_hours: {
    type: Number,
    required: true,
  },
  managing_hours: {
    type: Number,
    required: true,
  },
  pay_treating_clients: {
    type: Number,
    required: true,
  },
  pay_managing_business: {
    type: Number,
    required: true,
  },
  turnover: {
    type: Number,
    required: true,
  },
  profit: {
    type: Number,
    required: true,
  },
  total_wages: {
    type: Number,
    required: true,
  },
  non_clinician_wages: {
    type: Number,
    required: true,
  },
  rent: {
    type: Number,
    required: true,
  },
  cash_reserves: {
    type: Number,
    required: true,
  },
  client_survey: {
    type: String,
    required: true,
  },
  last_client_survey: {
    type: Date,
    required: true,
  },
  email_software: {
    type: String,
    required: true,
  },
  client_source: {
    type: String,
    required: true,
  }, written_treatment_plans: { type: Boolean, required: true, }, employee_satisfaction_survey: { type: String, required: true, }, last_employee_survey: { type: Date, required: true, }, number_of_clinicians: { type: Number, required: true, }, number_of_non_clinicians: { type: Number, required: true, }, work_life_balance: { type: Number, required: true, },
}, { timestamps: true });



export const Users = mongoose.models.Users || mongoose.model("Users", user_schema);
export const UserMeta = mongoose.models.UserMeta || mongoose.model("UserMeta", userMetaSchema);
export const DB_TeamSurveyData = mongoose.models.TeamSurveyData || mongoose.model("TeamSurveyData", teamSurveyDataSchema);
export const DB_ClientSurveyData = mongoose.models.ClientSurveyData || mongoose.model("ClientSurveyData", clientSurveyDataSchema);
export const DB_OwnerSurveyData = mongoose.models.OwnerSurveyData || mongoose.model("OwnerSurveyData", ownerSurveyDataSchema);
