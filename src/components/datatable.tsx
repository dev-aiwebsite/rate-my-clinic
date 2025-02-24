"use client"
import { formatDateTime, saveAsExcelFile } from "lib/helperFunctions"
import 'jspdf-autotable'
import ExcelJS from 'exceljs';
import { Tooltip } from "primereact/tooltip"
import { Button } from "primereact/button"
import { DataTable, DataTableRowClickEvent } from "primereact/datatable"
import { Column } from "primereact/column"
import { Dialog } from "primereact/dialog";
import { useRef, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { deleteAData } from "lib/server_actions/deleteAData";
import { InputText } from "primereact/inputtext";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';

type CustomDataTable = {
    datatable:any[];
    filename?:string;
    options?:{
        [key:string]:any
    }
    }

export default function CustomDataTable({datatable,filename = 'RMC_REPORT_DATA',options}:CustomDataTable) {
    const [tableData,setTableData] = useState(datatable);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [isDeleting,setIsDeleting] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const toast = useRef<Toast>(null);

    const deleteEnabled = options?.delete.enabled || false
    if(!tableData) return <><span>No data found.</span></>

    console.log(options?.data, 'data')
    console.log(options?.updateData, 'setter')

    const hasExcelExport = options?.export?.excel
    const exportExcel = async () => {
        if(!tableData) return false
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('data');
      
        // Assuming tableData is an array of objects
        worksheet.columns = Object.keys(tableData[0]).map(key => ({ header: key, key }));
      
        tableData.forEach((data: any) => {
          worksheet.addRow(data);
        });
      
        const buffer = await workbook.xlsx.writeBuffer();
      
        saveAsExcelFile(buffer, `${filename}.xlsx`);
    };

    const deleteItemDialogFooter = (
        <>
            {!isDeleting && <>
            <Button label="No" icon="pi pi-times" outlined onClick={() => setDeleteDialog(false)} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedItems} />
            </>}
        </>
    );

    async function deleteSelectedItems(){
        setIsDeleting(true)
        const ids = selectedItems.map(i => i.id)
        console.log(ids, 'ids to delete')
        if(!ids && !options?.delete.enabled && options?.delete.db_name) return
         (ids)

         const deleteConfig = {
            userId: options?.delete?.userId,
            ids,
            dbName: options?.delete.db_name
         }
         deleteAData(deleteConfig).then((res: { success: any; message: any; }) => {
            if(res.success){
                let updatedData = tableData.filter(i => !ids.includes(i.id) )
                setTableData(updatedData)
                let updateSurveyData = options?.data?.filter((i: { _id: any; }) => !ids.includes(i._id) )
                console.log(updateSurveyData,'updateSurveyData')
                if(updateSurveyData){
                    options?.updateData(updateSurveyData)
                }

                setSelectedItems([])
                toast.current?.show({ severity: 'success', summary: 'Success', detail: res.message, life: 3000 });   
            } else {
                toast.current?.show({ severity: 'warn', summary: '', detail: res.message, life: 3000 });
            }

            
            setIsDeleting(false)
            setDeleteDialog(false)
        })
        .catch((err: any) => {
            console.log(err)
            toast.current?.show({ severity: 'error', summary: '', detail: err, life: 3000 });
        })
      
    }

    function handleDialogClose() {
        if(isDeleting) return
        setDeleteDialog(false)
    }

    function handleOnRowClick(e:DataTableRowClickEvent){
        console.log(e, 'tablerowclick event')
        if(options?.onRowClick){
            options.onRowClick(e)
        }
    }

        return <>
                    <div>
                        <Toast ref={toast} />
                       {deleteEnabled && <Dialog visible={deleteDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteItemDialogFooter} onHide={handleDialogClose}>
                            <div className="confirmation-content">
                                {!isDeleting && selectedItems?.length ? <>
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    <span>Are you sure you want to delete the selected items?</span></> : ""}
                                {isDeleting &&  <ProgressSpinner className="!h-[50px] !w-[50px] opacity-40 !flex items-center" strokeWidth="5" animationDuration="2s" />}
                            </div>
                        </Dialog>}
                        <Tooltip target=".export-buttons>button" position="bottom" />
                        <div>
                            <div className="flex align-items-center justify-between gap-2 w-full sticky top-0 z-10 bg-white p-2">
                                <div>
                                {deleteEnabled && selectedItems?.length ? <><Button label="Delete" icon="pi pi-trash" severity="danger" onClick={()=> setDeleteDialog(true)} /></>: ""}
                                </div>
                                <div>
                                    {hasExcelExport && <Button type="button" icon="pi pi-file-excel" className='!bg-green-600 text-white p-2 w-fit aspect-square' onClick={exportExcel} data-pr-tooltip="XLS" />}
                                </div>
                            </div>
                            <div>
                                <IconField iconPosition="left">
                                    <InputIcon className="pi pi-search" />
                                    <InputText className="!shadow-none !py-2" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                                </IconField>
                                </div>
                        </div>
                        {/* paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} */}
                        <DataTable className="text-sm" value={tableData} selectionMode="checkbox" onRowClick={(e)=>handleOnRowClick(e)} onSelectionChange={(e) => setSelectedItems(e.value)} selection={selectedItems!} globalFilter={globalFilter} removableSort>
                            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                            <Column field="ID" header="ID" style={{display:'none'}}/>
                            <Column field="id" header="ID" style={{display:'none'}}/>
                            {tableData?.length ? (Object.keys(tableData[0]).filter((key) => key !== "id").map((key,indx) => {
                                
                                let limitArea = ""
                                const limitAreaFieldsFilter = ['Recommendation Feedback', 'Comments or Question', 'Additional Comments'] as string[]
                                if(limitAreaFieldsFilter.includes(key)){
                                    limitArea = "limitArea"
                                }
                                return <Column style={{minWidth:'10rem'}} className={limitArea} sortable key={`${key}_${indx}`} body={(rowData) => (
                                    <div className={limitArea}>
                                      {rowData[key]}
                                    </div>
                                  )} field={key} header={key} />
                            })): "" }
                        </DataTable>
                    </div>
        </>
}