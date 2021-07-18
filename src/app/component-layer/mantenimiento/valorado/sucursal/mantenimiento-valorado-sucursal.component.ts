import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { environment } from '@environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../../../utils/dialog-confirm/dialog-confirm.component';

import { MantenimientoValoradoSucursalModel } from '../../../../model-layer/mantenimiento/valorado/mantenimiento-valorado-sucursal.model';
import { MantenimientoValoradoService } from '../../../../service-layer/mantenimiento/valorado/mantenimiento-valorado.service';

import { map, tap } from 'rxjs/operators';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ApiTable } from 'src/app/utils-layer/api-table/api-table';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'app-mantenimiento-valorado-sucursal',
  templateUrl: './mantenimiento-valorado-sucursal.component.html',
  styleUrls: ['./mantenimiento-valorado-sucursal.component.css']
})
export class MantenimientoValoradoSucursalComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    public dialogRef: MatDialogRef<MantenimientoValoradoSucursalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _service: MantenimientoValoradoService,
    private matSnackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['codigo', 'descripcion', 'select'];
    this.list.service = _service;
    this.list.method = "pageSucursalPorAsignar";
    this.list.resultMap = {
      "source": "listaSucursal",
      "length": "totalRegistros"
    };
    this.list.methodComplete = "allSucursalPorAsignar";    
    this.list.resultMapComplete = { 
      "sourceComplete": "listaSucursal",
      "lengthComplete": "totalRegistros"
    };
    this.list.checkedIdentifier = "codigo";    
    this.list.sort = { }
    this.list.sortMap = { };

    _service.filterObj.codigoValorado = this.data.codigo;
    this.list.search();

    this.apiForm = new ApiForm();
    this.apiForm.service = _service;
    
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
        if(this.list.checkeds.length > 0){
          let array = this.list.checkeds.map((data:any) => {
            return data.codigo;
          })

          this.apiForm.consume("saveSucursal", {
            codigoValorado: this.data.codigo,
            listaSucursales: array,
            usuarioRegistra: "SRP",
          }, (data:any) => {
            this.apiForm.message(data);
            this.data.isExist = true;
            this.closeDialog({ isExist: this.data.isExist, codigoValorado: this.data.codigo });
          });          
        }else{
          this.apiForm.message("seleccion");
        }
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

