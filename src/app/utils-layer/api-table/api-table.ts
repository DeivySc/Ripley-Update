import { keyframes } from "@angular/animations";
import { Injectable } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { throwError } from "rxjs";
import { environment } from '../../../environments/environment';
import { ExportToCsv } from 'export-to-csv';
import { ApiExcel } from "../api-excel/api-excel";

@Injectable({
    providedIn: "root"
})
export class ApiTable{
    public source: any;
    public columns: string[];
    public length: any;
    public size:any;
    public page:any;
    public pageSizeOptions: number[];
    public service:any;
    public method:any;
    public sort:any;
    public sortMap:any;
    public resultMap:any;
    public completeChecked:boolean;
    public someChecked:boolean;
    public checkeds : any;
    public checkedsPage : any;
    public checkedIdentifier : any;
    public searchCallback: any;
    public presearchCallback: any;
  
    public sourceComplete: any;
    public methodComplete:any;
    public resultMapComplete:any;
    public lengthComplete:any;
    
    public isSearching:any;
    public isError:any;

    public firstLength:any;
    public options:any;
    
    apiExcel: ApiExcel;

    constructor(){
      this.size = environment.pageSize;
      this.page = 1;
      this.length = 0;
      this.lengthComplete = 0;
      this.sort = {
      };
      this.pageSizeOptions = environment.pageSizeOptions;
      this.someChecked = false;
      this.completeChecked = false;
      this.isSearching = false;
      this.isError = false;
      this.firstLength = false;

      this.checkeds = [];
      this.checkedsPage = {};

      this.options = { 
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true, 
        showTitle: true,
        title: '',
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };

      this.apiExcel = new ApiExcel();
    }
  
    search(callback?:any){      
      if(this.presearchCallback != null){
        this.presearchCallback();
      }

      this.source = null;
      this.length = 0;
      this.isSearching = true;
      this.isError = false;
      this.service[this.method](this.page, this.size, this.sort.column, this.sort.direction).then(
        (data:any) => {
          if(this.resultMap != null){
            for(let k of Object.keys(this.resultMap)){
              if(k != ""){
                this[k] = data[this.resultMap[k]];
              }
            }
          }else{
            this.source = data;
            this.length = data.length;
          }

          if(this.length == 0 && this.source != null){
            this.length = this.source.length;
          }

          if(this.firstLength){
            this.length = this.source[0].total;
          }

          if(this.someChecked){
            this.source.forEach((t:any) => t.checked = (this.checkeds.filter((c:any) => c[this.checkedIdentifier].toString() == t[this.checkedIdentifier].toString()).length > 0));
          }

          this.isSearching = false;

          if(callback != null){
            callback();
          }

          if(this.searchCallback != null){
            this.searchCallback();
          }       
        }
      ).catch((error:any) => {
        console.log(error);
        this.isError = true;
        this.isSearching = false;
        throwError(error);
      });
    }
  
    push(obj:any, callback?:any){
      if(this.source == null){
        this.source = [];
      }
      this.source[this.source.length] = obj;
      this.length++;

      if(callback != null){
        callback();
      }
    }
  
    complete(callback?:any){
      this.isSearching = true;
      this.isError = false;
      this.service[this.methodComplete]().then(
        (data:any) => {
          if(this.resultMapComplete != null){
            for(let k of Object.keys(this.resultMapComplete)){
              if(k != ""){
                this[k] = data[this.resultMapComplete[k]];
              }
            }
          }else{
            this.sourceComplete = data;
            this.lengthComplete = data.length;
          }

          this.isSearching = false;
          
          if(callback != null){
            callback();
          }
        }
      ).catch((error:any) => {
        console.log(error);
        this.isError = true;
        this.isSearching = false;
        throwError(error);
      });
    }
  
    setPage(page:any){
      this.page = page;
      this.source = null;
      this.search();
    }
  
    onPageChange(event: PageEvent) {
      this.page = (event.pageIndex) + 1;
      this.size = event.pageSize;
      this.source = null;
      
      this.search();
    }
  
    onSortChange($event: any){      
      if($event.active == ""){
        for(let k of Object.keys(this.sortMap)){
          this.sort.column = this.sortMap[k];
          break;
        }
      }else{
        this.sort.column = this.sortMap[$event.active];
      }
      this.sort.direction = $event.direction == "" ? "asc" : $event.direction;
      this.search();
    }

    checkAll(completed: boolean) {
      this.completeChecked = completed;
      
      if(this.completeChecked){
        if(this.methodComplete != null){
          if(this.sourceComplete == null){
            this.complete((data:any) => {
              this.checkeds = this.sourceComplete;

              this.source.forEach((t:any) => t.checked = completed);
              this.someChecked  = completed;
              
              this.checkedsPage[this.page] = this.source;

              //console.log(this.checkeds);
            });
          }else{
            this.source.forEach((t:any) => t.checked = completed);
            this.someChecked  = completed;
            
            this.checkeds = this.sourceComplete;
            this.checkedsPage[this.page] = this.source;
          }
        }else{
          this.source.forEach((t:any) => t.checked = completed);
          this.someChecked  = completed;
          
          this.checkeds = this.source;
          this.checkedsPage[this.page] = this.source;
        }
      }else{
        this.source.forEach((t:any) => t.checked = completed);
        this.someChecked  = completed;
        
        this.checkeds = [];
        this.checkedsPage = {};
      }
      //console.log(this.checkeds);
    }

    checkThis(e?:any, row?:any){
      this.completeChecked = this.source != null && this.source.every((t:any) => t.checked);
      this.someChecked = this.source.some((el:any) => el.checked);

      this.checkedsPage[this.page] = this.source.filter((el:any) => el.checked == true);

      if(e){
        for(let k of Object.keys(this.checkedsPage[this.page])){        
          if(this.checkeds.filter((c:any) => c[this.checkedIdentifier].toString() == this.checkedsPage[this.page][k][this.checkedIdentifier].toString()).length == 0){
            this.checkeds[this.checkeds.length] = this.checkedsPage[this.page][k];
          }
        }
      }else{
        if(row != null){             
          var newschecked:any = [];
          for(let k of Object.keys(this.checkeds)){      
            if(this.checkeds[k][this.checkedIdentifier].toString() != row[this.checkedIdentifier].toString()){
              newschecked[newschecked.length] = this.checkeds[k];
            }
          }
          this.checkeds = newschecked;
        }
      }
      //console.log(this.checkeds);
    }

    checkVerify(){
      return this.someChecked && !this.completeChecked;
    }

    convertCSV(){
      if (this.length > 0) {
        if(this.methodComplete != null){
          this.complete((data:any)=>{
            const csvExporter = new ExportToCsv(this.options);
            csvExporter.generateCsv(this.sourceComplete);
          });
        }else{
          const csvExporter = new ExportToCsv(this.options);
          csvExporter.generateCsv(this.source);
        }
      }
    }

    convertExcel(){
      if (this.length > 0) {
        if(this.methodComplete != null){
          this.complete((data:any)=>{
            this.apiExcel.data = this.sourceComplete;
            this.apiExcel.exportTableElmToExcel();
          });
        }else{
          this.apiExcel.data = this.source;
          this.apiExcel.exportTableElmToExcel();
        }
      }
    }
  }