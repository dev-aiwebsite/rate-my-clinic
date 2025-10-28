"use client"
import ExcelJS from 'exceljs';
import 'jspdf-autotable';
import { formatDateTime, isDateValue, saveAsExcelFile } from "lib/helperFunctions";
import { deleteAData } from "lib/server_actions/deleteAData";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableRowClickEvent, DataTableSortEvent } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { useRef, useState, useEffect } from "react";

type CustomDataTableProps = {
    datatable:any[];
    filename?:string;
    options?:{
        [key:string]:any
    }
}

export default function CustomDataTable({datatable,filename = 'RMC_REPORT_DATA',options}:CustomDataTableProps) {
    const [tableData, setTableData] = useState(datatable || []);
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sortField, setSortField] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<1 | -1 | null>(null);

    const toast = useRef<Toast>(null);

    const deleteEnabled = options?.delete?.enabled || false;
    
    useEffect(() => {
        // This ensures the table data updates when the prop changes
        setTableData(datatable || []);
    }, [datatable]);

    if (!tableData) return <><span>No data found.</span></>;

    const hasExcelExport = options?.export?.excel;
    const exportExcel = async () => {
        if (!tableData || tableData.length === 0) {
            console.error("No data to export.");
            return;
        }
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('data');
      
        worksheet.columns = Object.keys(tableData[0]).map(key => ({ header: key, key }));
      
        tableData.forEach((row: any) => {
          worksheet.addRow(row);
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
        setIsDeleting(true);
        const ids = selectedItems.map(i => i.id);

        if(!ids.length || !options?.delete?.enabled || !options?.delete.db_name) {
            console.warn("Delete action was triggered without valid parameters.");
            setIsDeleting(false);
            return;
        }
         
        const deleteConfig = {
            userId: options?.delete?.userId,
            ids,
            dbName: options?.delete?.db_name
        };
        
        deleteAData(deleteConfig).then((res: { success: any; message: any; }) => {
            if(res.success){
                let updatedData = tableData.filter(i => !ids.includes(i.id));
                setTableData(updatedData);
                let updateSurveyData = options?.data?.filter((i: { _id: any; }) => !ids.includes(i._id));
                if(updateSurveyData){
                    options?.updateData(updateSurveyData);
                }

                setSelectedItems([]);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: res.message, life: 3000 });   
            } else {
                toast.current?.show({ severity: 'warn', summary: '', detail: res.message, life: 3000 });
            }
            
            setIsDeleting(false);
            setDeleteDialog(false);
        })
        .catch((err: any) => {
            console.error(err);
            toast.current?.show({ severity: 'error', summary: '', detail: err, life: 3000 });
            setIsDeleting(false);
        });
    }

    function handleDialogClose() {
        if(isDeleting) return;
        setDeleteDialog(false);
    }

    function handleOnRowClick(e:DataTableRowClickEvent){
        if(options?.onRowClick){
            options.onRowClick(e);
        }
    }

    function handleCustomSort(event: DataTableSortEvent) {
        const { sortField, sortOrder } = event;
        
        // Update the sorting state immediately
        setSortField(sortField as string);
        setSortOrder(sortOrder as 1 | -1);

        if (!tableData || tableData.length === 0) {
            return;
        }

        // Use a defensive check
        const firstRow = tableData[0];
        const valueToCheck = firstRow && firstRow[sortField as keyof typeof firstRow];
        const isDateColumn = isDateValue(valueToCheck);
        let sortedData = [...tableData];

        if (isDateColumn) {
            sortedData.sort((a: any, b: any) => {
                const aTime = new Date(a[sortField as keyof typeof a]).getTime() || 0;
                const bTime = new Date(b[sortField as keyof typeof b]).getTime() || 0;
                return (sortOrder as number) === 1 ? aTime - bTime : bTime - aTime;
            });
        } else {
            // Default sorting logic for non-date columns
            sortedData.sort((a: any, b: any) => {
                const aValue = a[sortField as keyof typeof a];
                const bValue = b[sortField as keyof typeof b];

                if (aValue === null || aValue === undefined) return sortOrder as number;
                if (bValue === null || bValue === undefined) return -(sortOrder as number);

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return aValue.localeCompare(bValue) * (sortOrder as number);
                }
                
                return ((aValue as number) - (bValue as number)) * (sortOrder as number);
            });
        }
        setTableData(sortedData);
    };

    return (
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
            <DataTable
                className="text-sm"
                value={tableData}
                selectionMode="checkbox"
                onRowClick={(e)=>handleOnRowClick(e)}
                onSelectionChange={(e) => setSelectedItems(e.value)} selection={selectedItems!}
                globalFilter={globalFilter}
                removableSort
                onSort={handleCustomSort}
                sortField={sortField as string}
                sortOrder={sortOrder as 1 | -1}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="ID" header="ID" style={{display:'none'}}/>
                <Column field="id" header="ID" style={{display:'none'}}/>
                {tableData?.length > 0 && Object.keys(tableData[0]).filter((key) => key !== "id").map((key, indx) => {
                    const limitArea = "max-w-[200px] overflow-hidden whitespace-nowrap text-overflow-ellipsis";
                    const isDateCol = isDateValue(tableData[0][key]);
                    return (
                        <Column
                            key={`${key}_${indx}`}
                            field={key}
                            header={key}
                            sortable
                            className={limitArea}
                            style={{ minWidth: "10rem" }}
                            body={(rowData) => {
                                const value = rowData[key];
                                return (
                                    <div className={limitArea}>
                                        {isDateCol ? formatDateTime(value) : value}
                                    </div>
                                );
                            }}
                        />
                    );
                })}
            </DataTable>
        </div>
    );
}