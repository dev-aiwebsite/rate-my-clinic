"use client"
import { useSessionContext } from "@/context/sessionContext"
import { useSurveyDataContext } from "@/context/surveyDataContext"
import { Column } from 'primereact/column';
import { formatDateTime, saveAsExcelFile } from "lib/helperFunctions";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Tooltip } from "primereact/tooltip";
import 'jspdf-autotable'
import ExcelJS from 'exceljs';
import { subscriptionLevels } from "lib/Const";
import { redirect, useRouter } from "next/navigation";

export default function Page({searchParams}:{searchParams:any}) {
    const {currentUser,users} = useSessionContext()
    let isAdmin = false
    if(currentUser.role == 'admin'){
        isAdmin = true
    }
    
    const router = useRouter();
    if (!isAdmin) {
        redirect('/dashboard'); // Redirect to /dashboard
    }

    let users_datatable_all:any[] = []
    if(users.length){
        users_datatable_all = users.map((i: { _id: any; username: any; fname: any; lname: any; useremail: any; role: any; clinic_name: any; clinic_type: any; subscription_level: any; subscription_id: any; last_checkout_session_id: any; profile_pic: any; isActive: any; isVerified: any; isDeleted: any; isBlocked: any; createdAt: any; updatedAt: any; clinic_established: any; clinic_location_country: any; clinic_location_postcode: any; clinic_location_state: any; usermobile: any; }) => {

            return {
                // 'Profile Picture': i.profile_pic,
                'First Name': i.fname,
                'Last Name': i.lname,
                'Email': i.useremail,
                'Mobile': i.usermobile,
                'Subscription Level': subscriptionLevels.find(s => s.level == i.subscription_level)?.name,
                'Role': i.role,
                'Clinic Name': i.clinic_name,
                'Clinic Type': i.clinic_type,
                'Clinic Established': i.clinic_established,
                'Clinic Country': i.clinic_location_country,
                'Clinic Postcode': i.clinic_location_postcode,
                'Clinic State': i.clinic_location_state,
                'Verified': i.isVerified,
                'Blocked': i.isBlocked,
                'Created At': formatDateTime(i.createdAt),
                'Updated At': formatDateTime(i.updatedAt),
            };
        })
    }
    
    const exportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('data');
      
        // Assuming tableData is an array of objects
        worksheet.columns = Object.keys(users_datatable_all[0]).map(key => ({ header: key, key }));
      
        users_datatable_all.forEach(data => {
          worksheet.addRow(data);
        });
      
        const buffer = await workbook.xlsx.writeBuffer();
      
        saveAsExcelFile(buffer, 'RMC_USER_DATA.xlsx');
    };

    function tableRowOnClick(e:any){
            let value = e.value
            let user_id = users.find((i: { useremail: any; }) => i.useremail == value.Email)?._id
                 
            if (user_id) {
                // Navigate to the user page
                router.push(`/dashboard/admin/user/${user_id}`);
            }
    }   

    return <>
         <div className="card m-5">
            <Tooltip target=".export-buttons>button" position="bottom" />
            <div className="flex align-items-center justify-end gap-2 w-full sticky top-0 z-10 bg-white p-2">
                <Button type="button" icon="pi pi-file-excel" className='!bg-green-600 text-white p-2 w-fit aspect-square' onClick={exportExcel} data-pr-tooltip="XLS" />
            </div>
            <DataTable value={users_datatable_all} selectionMode="single" onSelectionChange={(e) => tableRowOnClick(e)} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} removableSort stripedRows>
            {Object.keys(users_datatable_all[0]).map((key,indx) => {
                    if(key == 'Profile Picture'){
                        return <Column key={`${key}_${indx}`} field={key} header={key} />
                    } else {
                       return <Column key={`${key}_${indx}`} body={""} field={key} header={key} />
                    }
                    
            })}
            </DataTable>
        </div>

    </>
}