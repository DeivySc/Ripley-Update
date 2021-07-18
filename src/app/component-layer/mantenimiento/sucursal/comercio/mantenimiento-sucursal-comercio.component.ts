import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { DialogConfirmComponent } from '../../../../component-layer/utils/dialog-confirm/dialog-confirm.component';import { MantenimientoSucursalComercioService } from 'src/app/service-layer/mantenimiento/sucursal/mantenimiento-sucursal-comercio.service';
import { MantenimientoSucursalComercioModel } from 'src/app/model-layer/mantenimiento/sucursal/mantenimiento-sucursal-comercio.model';
import { ApiTable } from 'src/app/utils-layer/api-table/api-table';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'mantenimiento-sucursal-comercio',
  templateUrl: './mantenimiento-sucursal-comercio.component.html',
  styleUrls: ['./mantenimiento-sucursal-comercio.component.css']
})
export class MantenimientoSucursalComercioComponent implements OnInit {
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;
  list: ApiTable;  
  isExist: boolean;
  
  constructor(
    public dialogRef: MatDialogRef<MantenimientoSucursalComercioComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private _mantenimientoSucursalComercioService: MantenimientoSucursalComercioService,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.apiValidator = new ApiValidator();
    
    this.isExist = null;
    
    this.apiForm = new ApiForm();
    this.apiForm.service = this._mantenimientoSucursalComercioService;
    this.apiForm.formBuilder = this.formBuilder;    
    this.apiForm.datepipe = this.datepipe;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new MantenimientoSucursalComercioModel();
    this.apiForm.model.codigoSucursal = this.data.codigo;
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";    this.route.paramMap.subscribe(params => {
      if(params["params"]["id"] != null){
        this.data.codigo = params["params"]["id"];
        this.data.isEdit = true;
      }
    });    
    this.apiForm.fields = {
      codigoComercio: ['', [Validators.required, Validators.pattern("^[1-9]*$"), Validators.min(1), Validators.max(9999999999)]]
    };    
    this.apiForm.mapping = ({
      codigoComercio: "codigoComercio"
    });
    this.apiForm.mappingToForm = () => {
    }
    this.apiForm.mappingToModel = () => {
    }
    this.apiForm.build();
    
    this._mantenimientoSucursalComercioService.filterObj.codigoSucursal = this.data.codigo;
    this._mantenimientoSucursalComercioService.filterObj.estado = null;

    this.list = new ApiTable();
    this.list.columns = ['comercio', 'sucursal', 'eliminar'];
    this.list.service = this._mantenimientoSucursalComercioService;
    this.list.method = "page";
    this.list.resultMap = {
      "source": "listaComercio",
      "length": "totalRegistros"
    };
    this.list.sort = {
      "column": "codigoComercio",
      "direction": "asc"
    }
    this.list.search();
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }  
  
  ngOnInit(): void {    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      this.apiLoading.close();
    });
    
    this.apiLoading.show();
  }  
  
  action() {    
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        isExist: false
      },
      disableClose: true,
      autoFocus: true,
      panelClass: 'custom-modalbox'
    });    
    
    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result.event.isExist;
      if (this.isExist) {
        this.apiForm.toModel();
        this.apiForm.mappingToModel();
                
        this.apiForm.consume("save", this.apiForm.model, (data:any) => {
          if (data.codigo == 3) {
            this.apiForm.message(data);
          }else{
            this.apiForm.message("actualiza");
            //this.closeDialog(this.data.isExist);
          }
        });
      }
    });
  }
  
  delete(row:any) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        isExist: false
      },
      disableClose: true,
      autoFocus: true,
      panelClass: 'custom-modalbox'
    });    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result.event.isExist;
      if (this.isExist) {        
        row.estado = "0";
        
        this.apiForm.consume("updateFieldEstado", row, (data:any) => {
          if (data.codigo == 0) {
            this.apiForm.message("updateState");
          }
          this.list.search();
        });
      }
    });
  }  
  
  closeDialog(value?: any) {
    this.dialogRef.close({ event: value });
  }  
  
  close(): void {
    this.dialogRef.close();
  }
}