import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { DialogConfirmComponent } from "src/app/component-layer/utils/dialog-confirm/dialog-confirm.component";
import { MatDialog } from "@angular/material/dialog";

@Injectable({
    providedIn: "root"
})
export class ApiLoading {
    public dialog: MatDialog;
    public dialogRef: any;
    public isError: boolean;
    public loadCallback: any;
    public errorCallback: any;
    public unloadCallback: any;
    
    constructor() { 
        this.isError = false;
    }

    public show(_isSaving?:boolean): any {
        this.dialogRef = this.dialog.open(DialogConfirmComponent, {
            width: '350px',
            height: '100px',
            data: {
                isLoading:true,
                isSaving:_isSaving
            },
            panelClass: '',
            disableClose: true,
            autoFocus: true
        });
        
        if(this.loadCallback != null){
            this.loadCallback();
        }

        this.dialogRef.afterClosed().subscribe((result:any) => {
            if(result?.isError){
                if(this.errorCallback != null){
                    this.errorCallback();
                }
            }else{
                if(this.unloadCallback != null){
                    this.unloadCallback();
                }
            }
        });
    }

    close(value?: any) {
        if(this.dialogRef != null){
            this.dialogRef.close({ event: value });
        }
    }

    error(objError:any):void{
        console.log(objError);
        this.close();

        this.dialogRef = this.dialog.open(DialogConfirmComponent, {
            width: '650px',
            height: '120px',
            data: {
                isError:true,
                errorMessage: (objError.error?.message != null ? objError.error.message : (objError.message != null ? objError.message : "Ocurrio un error en el Sistema"))
            },
            panelClass: '',
            disableClose: false,
            autoFocus: true
        });

        this.dialogRef.afterClosed().subscribe((result:any) => {
            if(this.errorCallback != null){
                this.errorCallback();
            }
        });

    }
  }