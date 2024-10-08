
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import 'jspdf-autotable'
import ExcelJS from 'exceljs';
import { saveAsExcelFile } from 'lib/helperFunctions';
interface ColumnMeta {
    field: string;
    header: string;
}

export default function TableData({data}:{data:any}) {
    const dt = useRef<DataTable<any[]>>(null);
    if(!data) return 
    let tableData = Object.keys(data).map(question => {
        let template = {
            "question":question,
            "answer":data[question]
        }
        return template
    })

    const cols: ColumnMeta[] = [
        { field: 'question', header: 'Responses' },
        { field: 'answer', header: '' },
    ];

    const exportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('data');
      
        // Assuming tableData is an array of objects
        worksheet.columns = Object.keys(tableData[0]).map(key => ({ header: key, key }));
      
        tableData.forEach(data => {
          worksheet.addRow(data);
        });
      
        const buffer = await workbook.xlsx.writeBuffer();
      
        saveAsExcelFile(buffer, 'RMC_REPORT.xlsx');
    };
      

    const header = (
        <div className="flex align-items-center justify-end gap-2 w-full sticky top-0 z-10 bg-white p-2">
            <Button type="button" icon="pi pi-file-excel" className='bg-green-600 text-white p-2 w-fit aspect-square' onClick={exportExcel} data-pr-tooltip="XLS" />
        </div>
    );


    return (
        <>
            <Tooltip target=".export-buttons>button" position="bottom" />
            {header}
            <DataTable ref={dt} value={tableData} stripedRows>
                {cols.map((col, index) => (
                    <Column sortable key={index} field={col.field} header={col.header} />
                ))}
            </DataTable>
        </>
    );
}
        