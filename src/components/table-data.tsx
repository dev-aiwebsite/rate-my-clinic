
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import ExcelJS from 'exceljs';
interface ColumnMeta {
    field: string;
    header: string;
}

export default function TableData({data}:{data:any}) {
    let fileName = `${data.fname} ${data.lname}`

    const dt = useRef<DataTable<any[]>>(null);
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

   
    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

   
    const exportCSV = (selectionOnly: boolean) => {
        if(!dt.current) return
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        
        const doc = new jsPDF() as any
        // const doc = new jsPDF.default("p", "px");
        doc.autoTable(exportColumns, tableData);
        doc.save(`${fileName}.pdf`);
        
    };
    const exportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('data');
      
        // Assuming tableData is an array of objects
        worksheet.columns = Object.keys(tableData[0]).map(key => ({ header: key, key }));
      
        tableData.forEach(data => {
          worksheet.addRow(data);
        });
      
        const buffer = await workbook.xlsx.writeBuffer();
      
        saveAsExcelFile(buffer, fileName);
    };
      

    const saveAsExcelFile = (buffer: BlobPart, fileName: string) => {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION); 
    };


    const header = (
        <div className="flex align-items-center justify-end gap-2 w-full sticky top-0 z-10 bg-white p-2">
            <Button type="button" icon="pi pi-file" className='bg-blue-500 text-white p-2 w-fit aspect-square' onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" className='bg-green-600 text-white p-2 w-fit aspect-square' onClick={exportExcel} data-pr-tooltip="XLS" />
            <Button type="button" icon="pi pi-file-pdf" className='bg-red-500 text-white p-2 w-fit aspect-square' onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>
    );

    return (
        <>
            <Tooltip target=".export-buttons>button" position="bottom" />
            {header}
            <DataTable ref={dt} value={tableData} stripedRows>
                {cols.map((col, index) => (
                    <Column key={index} field={col.field} header={col.header} />
                ))}
            </DataTable>
        </>
    );
}
        