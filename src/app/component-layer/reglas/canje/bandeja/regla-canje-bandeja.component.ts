import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { HeaderService } from '../../../../services/header.service';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';

import { ReglaCanjeFormComponent } from '../form/regla-canje-form.component';
import { ReglaCanjeService } from '../../../../service-layer/reglas/canje/regla-canje.service';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { ReglaCanjeModel } from 'src/app/model-layer/reglas/canje/regla-canje.model';
import { ReglaAcumulacionModel } from 'src/app/model-layer/reglas/acumulacion/regla-acumulacion.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'app-regla-canje-bandeja',
  templateUrl: './regla-canje-bandeja.component.html',
  styleUrls: ['./regla-canje-bandeja.component.css']
})
export class ReglaCanjeBandejaComponent implements OnInit {
  list: ApiTable[];
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    private _header: HeaderService,
    private _service: ReglaCanjeService,
    private router: Router,
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = [];
    let index = 0;
    this.list[index] = new ApiTable();
    this.list[index].columns = ['codigo', 'descripcion', 'puntaje', 'inicio', 'fin', 'vigencia', 'editar', 'eliminar'];
    this.list[index].service = this._service;
    this.list[index].method = "findAllVigente";
    this.list[index].resultMap = {
      "source": "listReglaCanjeVigente",
      "length": "totalRegistros"
    };
    this.list[index].sort = {
      "column": "id",
      "direction": "desc"
    }
    this.list[index].sortMap = {
      "codigo": "id",
      "inicio": "FECHA_INICIO",
      "fin": "FECHA_FIN"
    };
    this.list[index].search();

    index = 1;
    this.list[index] = new ApiTable();
    this.list[index].columns = ['codigo', 'descripcion', 'puntaje', 'inicio', 'fin', 'vigencia', 'estado'];
    this.list[index].service = this._service;
    this.list[index].method = "findAllHistorica";
    this.list[index].resultMap = {
      "source": "listReglaCanjeHistorica",
      "length": "totalRegistros"
    };
    this.list[index].sort = this.list[index - 1].sort;
    this.list[index].sortMap = this.list[index - 1].sortMap;
    this.list[index].search();
    
    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.model = new ReglaCanjeModel();
    this.apiForm.formSnackBar = this.matSnackBar;   
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }

  ngOnInit() {
    this._header.settingValues({ title: "Reglas de Canje" });
    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      this.apiLoading.close();
    });
    
    this.apiLoading.show();
  }

  new() {
    const dialogRef = this.dialog.open(ReglaCanjeFormComponent, {
      width: '500px',
      height: '705px',
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
        this.list[0].search();
        this.list[1].search();
      }
    });
  }

  edit(row:any) {
    const dialogRef = this.dialog.open(ReglaCanjeFormComponent, {
      width: '500px',
      height: '705px',
      data: {
        isEdit: true,
        codigo: row.id,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result;
      if (this.isExist) {
        this.list[0].search();
        this.list[1].search();
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
        this.apiForm.model.id = row.id;
        this.apiForm.model.estado = "0";
        this.apiForm.model.usrMod = "SRP";

        this.apiForm.consume("delete", this.apiForm.model, (data:any) => {
          if (data.codigo == 0) this.apiForm.message("eliminar");
          
          this.list[0].search();
          this.list[1].search();
        });
      }
    });
  }
  
  parseIntegerField(s:string):any{
    return parseInt(s);
  }
}