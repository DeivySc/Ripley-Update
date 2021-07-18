import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MantenimientoValoradoService } from '../../../../service-layer/mantenimiento/valorado/mantenimiento-valorado.service';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { HeaderService } from '../../../../services/header.service';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { MantenimientoValoradoFormComponent } from '../form/mantenimiento-valorado-form.component';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { MantenimientoValoradoModel } from 'src/app/model-layer/mantenimiento/valorado/mantenimiento-valorado.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'app-mantenimiento-valorado-bandeja',
  templateUrl: './mantenimiento-valorado-bandeja.component.html',
  styleUrls: ['./mantenimiento-valorado-bandeja.component.css']
})
export class MantenimientoValoradoBandejaComponent implements OnInit {
  list: ApiTable;
  apiValidator: ApiValidator;
  apiForm: ApiForm;
  isExist: boolean = null;
  apiLoading: ApiLoading;

  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    private _header: HeaderService,
    private _service: MantenimientoValoradoService,
    private router: Router,
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['codigo', 'ruc', 'establecimiento', 'valorado', 'estado', 'editar', 'eliminar'];
    this.list.service = this._service;
    this.list.method = "page";
    this.list.resultMap = {
      "source": "listaValorado",
      "length": "totalRegistros"
    };
    this.list.sort = {
      "column": "ID",
      "direction": "desc"
    }
    this.list.sortMap = {
      "codigo": "ID"
    };
    this.list.search();

    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service; 
    this.apiForm.formSnackBar = this.matSnackBar;  
    this.apiForm.model = new MantenimientoValoradoModel();
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }

  ngOnInit() {
    this._header.settingValues({ title: "Mantenimiento de Valorados" });
       
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      this.apiLoading.close();
    });
    
    this.apiLoading.show();
  }

  new() {
    const dialogRef = this.dialog.open(MantenimientoValoradoFormComponent, {
      width: '975px',
      height: '635px',
      data: {
        isEdit: false,
        codigo: null,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result;
      if (this.isExist) {
        this.list.search();
      }
    });
  }

  edit(row:any) {
    const dialogRef = this.dialog.open(MantenimientoValoradoFormComponent, {
      width: '975px',
      height: '635px',
      data: {
        isEdit: true,
        codigo: row.codigoValorado,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result;
      if (this.isExist) {
        this.list.search();
      }
    });
  }

  delete(row:any) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: { isExist: false, isDelete: true },
      disableClose: true,
      autoFocus: true,
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result.event.isExist;
      if (this.isExist) {
        this.apiForm.model.codigo = row.codigoValorado;
        this.apiForm.model.estado = "0";

        this.apiForm.consume("updateFieldEstado", this.apiForm.model, (data:any) => {
          if (data.codigo == "0"){
            this.apiForm.message("eliminar");
          }
          this.list.search();
        });
      }
    });
  }
}