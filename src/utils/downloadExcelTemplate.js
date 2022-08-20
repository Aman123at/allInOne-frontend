import  ExcelJS from 'exceljs'
import FileSaver from "file-saver";
import { useDispatch } from 'react-redux';
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const EXCEL_EXTENSION = ".xlsx";

export const transform=(data)=> {
    const noOfRowaToGenerate = 10000;
    return data.map(({
        name,
        values
    }) => {
        const headers = values.reduce(
            (prev, next) => ({
                ...prev,
                [next.header]: Array.isArray(next.value) ?
                    next.value.map(({
                        name
                    }) => name) :
                    next.value
            }), {}
        );
        return {
            workSheet: name,
            rows: Array(noOfRowaToGenerate).fill(headers)
        };
    });
}

function getSpreadSheetCellNumber(row, column) {
    let result = "";

    // Get spreadsheet column letter
    let n = column;
    while (n >= 0) {
      result = String.fromCharCode((n % 26) + 65) + result;
      n = Math.floor(n / 26) - 1;
    }

    // Get spreadsheet row number
    result += `${row + 1}`;

    return result;
  }

const saveAsExcelFile=(buffer,fileName)=>{
    const data = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(
        data,
        fileName +  EXCEL_EXTENSION
      );
}


export  const exportAsExcelFile=async(workbookData,excelFileName)=>{
    
    const workbook = new ExcelJS.Workbook();
    workbookData.forEach(({ workSheet, rows }) => {
          const sheet = workbook.addWorksheet(workSheet);
         
          const uniqueHeaders = [
            ...new Set(
                rows.reduce((prev, next) => [...prev, ...Object.keys(next)], []) 
            )
          ];
          sheet.columns = uniqueHeaders.map(x => ({ header: x, key: x }));
    rows.forEach((jsonRow, i) => {
            let cellValues = { ...jsonRow };
    uniqueHeaders.forEach((header, j) => {
              if (Array.isArray(jsonRow[header])) {
                cellValues[header] = "";
              }
            });
            sheet.addRow(cellValues);
            uniqueHeaders.forEach((header, j) => {
              if (Array.isArray(jsonRow[header])) {
                const jsonDropdown = jsonRow[header];
                sheet.getCell(
                  getSpreadSheetCellNumber(i + 1, j)
                ).dataValidation = {
                  type: "list",
                  formulae: [`"${jsonDropdown.join(",")}"`]
                };
              }
            });
          });
        });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAsExcelFile(buffer, excelFileName)
}
