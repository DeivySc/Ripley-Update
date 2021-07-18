import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { HeaderService } from '../../../../services/header.service';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';

import { ReglaValoradoFormComponent } from '../form/regla-valorado-form.component';
import { ReglaValoradoService } from '../../../../service-layer/reglas/valorado/regla-valorado.service';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ReglaValoradoModel } from 'src/app/model-layer/reglas/valorado/regla-valorado.model';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'app-regla-valorado-bandeja',
  templateUrl: './regla-valorado-bandeja.component.html',
  styleUrls: ['./regla-valorado-bandeja.component.css']
})
export class ReglaValoradoBandejaComponent implements OnInit {
  list: ApiTable[];
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    private _header: HeaderService,
    private _service: ReglaValoradoService,
    private router: Router,
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = [];
    let index = 0;
    this.list[index] = new ApiTable();
    this.list[index].columns = ['codigo', 'establecimiento', 'valorado', 'factor', 'puntajeminimo', 'inicio', 'fin', 'vigencia', 'editar', 'eliminar'];;
    this.list[index].service = this._service;
    this.list[index].method = "findAllVigente";
    this.list[index].resultMap = {
      "source": "listReglaCanjeValoradoVigente",
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
    this.list[index].columns = ['codigo', 'establecimiento', 'valorado', 'factor', 'puntajeminimo', 'inicio', 'fin', 'vigencia', 'estado'];
    this.list[index].service = this._service;
    this.list[index].method = "findAllHistorica";
    this.list[index].resultMap = {
      "source": "listReglaCanjeValoradoHistorica",
      "length": "totalRegistros"
    };
    this.list[index].sort = this.list[index - 1].sort;
    this.list[index].sortMap = this.list[index - 1].sortMap;
    this.list[index].search();
    
    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.model = new ReglaValoradoModel();
    this.apiForm.formSnackBar = this.matSnackBar;  
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog; 
  }

  ngOnInit() {
    this._header.settingValues({ title: "Reglas de Valorados" });
    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      this.apiLoading.close();
    });
    
    this.apiLoading.show();
  }

  new() {
    const dialogRef = this.dialog.open(ReglaValoradoFormComponent, {
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
    const dialogRef = this.dialog.open(ReglaValoradoFormComponent, {
      width: '500px',
      height: '705px',
      data: {
        isEdit: true,
        codigo: row.rceId,
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
        this.apiForm.model.id = row.rceId;
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
}