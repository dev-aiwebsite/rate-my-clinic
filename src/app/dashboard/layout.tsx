"use server";
import { retrieveCheckoutSession } from "@/api/stripe/actions";
import { auth } from "@/auth";
import AppConfigContextProvider from "@/context/appSettingsContext";
import SessionContextProvider from "@/context/sessionContext";
import SurveyDataContext from "@/context/surveyDataContext";
import Navbar from "@/ui/navbar/navbar";
import Sidebar from "@/ui/sidebar/sidebar";
import { fetchData } from "lib/data";
import { getSurveyData } from "lib/server-actions";
import Image from "next/image";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-blue/theme.css";
import Stripe from "stripe";
import { demoEmail, demoReports, demoSubscription } from "utils/demo";
import { ExtendedSession } from "../../../typings";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = (await auth()) as unknown as ExtendedSession;
  const Users = await fetchData();
  const c_user = JSON.stringify(Users.find((i) => i._id == session.user_id));
  let currentUser = JSON.parse(c_user);
  let allUsers = JSON.parse(JSON.stringify(Users));
  let surveyData = await getSurveyData(currentUser._id);
  let lastCheckoutSession;
  if (currentUser.useremail == demoEmail) {
    demoSubscription[0].lastCheckoutSession_data as Stripe.Checkout.Session;
  } else {
    lastCheckoutSession = await retrieveCheckoutSession(
      currentUser.last_checkout_session_id
    );
  }

  currentUser["lastCheckoutSession_data"] = lastCheckoutSession;

  if (currentUser.useremail == demoEmail) {
    currentUser.reports = demoReports;
    currentUser = { ...currentUser, ...demoSubscription[0] };
  }

  const value = {
    ripple: true,
  };

  return (
    <>
      <PrimeReactProvider value={value}>
        <SurveyDataContext surveyData={surveyData}>
          <SessionContextProvider users={allUsers} current_user={currentUser}>
            <AppConfigContextProvider>
              <div className="h-screen flex flex-col max-md:bg-slate-100">
                <Navbar />
                <div className="!bg-slate-100 md:hidden fixed top-0 h-full w-full max-h-32 my-0 mx-auto p-5 md:hidden !shadow-none !z-[99]">
                  <Image
                    className="!h-full !object-contain"
                    src={
                      currentUser?.clinic_logo || "/images/logos/rmc-logo.png"
                    }
                    width={600}
                    height={600}
                    alt="ratemyclinic"
                  />
                </div>

                <div className="h-full max-md:mt-32 max-h-[calc(100vh_-_3.5rem)] md:max-h-[calc(100vh_-_4rem)] overflow-y-hidden flex-1 flex flex-row">
                  <Sidebar />
                  <div className="flex-1 md:overflow-y-auto">
                    <div className="overflow-scroll max-md:pb-20 min-h-full max-h-[calc(100vh_-_11.25rem)] md:max-h-[calc(100vh_-_4rem)]">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </AppConfigContextProvider>
          </SessionContextProvider>
        </SurveyDataContext>
      </PrimeReactProvider>
    </>
  );
};

export default Layout;
