import { Injectable, ElementRef } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ApiExcel {
    nameSheet: any;
    nameFile: any;
    data: any;
    groups: any;
    columns: any;
    values: any;
    formats: any;

    constructor() { 
        this.nameFile = "SRP";
        this.nameSheet = "Datos";
        this.formats = [];
    }

    jsn() : any{
        if(this.columns != null){
            var dataFormat = [];
            for(let i=0;i<this.data.length;i++){
                var item = {};
                for(let k of Object.keys(this.columns)){
                    if(this.formats != null && this.formats[k] != null){
                        item[this.columns[k]] = this.formats[k](this.data[i]);
                    }else{
                        if(this.values != null && this.values[k] != null){
                            item[this.columns[k]] = this.data[i][this.values[k]];
                        }else{
                            item[this.columns[k]] = this.data[i][this.columns[k]];
                        }
                    }
                }
                dataFormat[dataFormat.length] = item;
            }
            return dataFormat;
        }
        return this.data;
    }

    arr() : any{
        if(this.columns != null){
            var dataFormat = [];
            if(this.groups != null){
                dataFormat[dataFormat.length] = this.groups;
            }
            dataFormat[dataFormat.length] = this.columns;

            for(let i=0;i<this.data.length;i++){
                var item = [];
                for(let k of Object.keys(this.columns)){
                    if(this.formats != null && this.formats[k] != null){
                        item[item.length] = this.formats[k](this.data[i]);
                    }else{
                        if(this.values != null && this.values[k] != null){
                            item[item.length] = this.data[i][this.values[k]];
                        }else{
                            item[item.length] = this.data[i][this.columns[k]];
                        }
                    }
                }
                dataFormat[dataFormat.length] = item;
            }

            return dataFormat;
        }
        return this.data;
    }

    public exportTableElmToExcel(): void {
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.arr());
       
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, ws, this.nameSheet);

        XLSX.writeFile(workbook, `${this.nameFile}${EXCEL_EXTENSION}`);
    }
}