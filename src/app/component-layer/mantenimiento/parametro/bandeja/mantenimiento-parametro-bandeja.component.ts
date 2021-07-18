import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { MantenimientoParametroService } from '../../../../service-layer/mantenimiento/parametro/mantenimiento-parametro.service';
import { MantenimientoParametroFormComponent } from '../form/mantenimiento-parametro-form.component';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { MatPaginator } from '@angular/material/paginator';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { MantenimientoParametroModel } from 'src/app/model-layer/mantenimiento/parametro/mantenimiento-parametro.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'mantenimiento-parametro-bandeja',
  templateUrl: './mantenimiento-parametro-bandeja.component.html',
  styleUrls: ['./mantenimiento-parametro-bandeja.component.css']
})
export class MantenimientoParametroBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  title: string = "Mantenimiento de Parámetros";

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  groups: any;
  
  constructor(
    private _header: HeaderService,
    private _service: MantenimientoParametroService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['codigo', 'descripcion', 'descripcionTipoMovimiento', 'comentario', 'editar', 'eliminar'];
    this.list.service = this._service;
    this.list.method = "page";
    this.list.resultMap = {
      "source": "listaParametro",
      "length": "totalRegistros"
    };
    this.list.sort = {
      "column": "CODIGO",
      "direction": "desc"
    }
    this.list.sortMap = {
      "codigo": "CODIGO"
    }

    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new MantenimientoParametroModel();
    this.apiForm.fields = {
      padre: ['', [Validators.required]]
    };
    this.apiForm.build();
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }

  ngOnInit(): void {
    this._header.settingValues({ title: this.title });

    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {  
      this.apiForm.consume("findAllGroups", {}, (data:any) => {
        this._service.filterObj.codigo = data.listaParametro[0].codigo;
        this.apiForm.getField('padre').value = data.listaParametro[0].codigo;
  
        this.groups = data.listaParametro;
        this.list.search();

        this.apiLoading.close();
      });      
    });
    
    this.apiLoading.show();
  }


  new() {
    const dialogRef = this.dialog.open(MantenimientoParametroFormComponent, {
      width: '500px',
      height: '635px',
      data: {
        isEdit: false,
        codigo: null,
        padre: this.apiForm.getField("padre").value,
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
    const dialogRef = this.dialog.open(MantenimientoParametroFormComponent, {
      width: '500px',
      height: '635px',
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
        this.apiForm.model.id = row.id;
        this.apiForm.model.estado = "0";

        this.apiForm.consume("updateFieldEstado", this.apiForm.model, (data:any) => {
          if (data.codigo == 0) this.apiForm.message("eliminar");
          
          this.list.search();
        });
      }
    });
  }

  onChangeSelected(e:any):void{
    this._service.filterObj.codigo = e.value;
    this.list.setPage(1);
  }
}

