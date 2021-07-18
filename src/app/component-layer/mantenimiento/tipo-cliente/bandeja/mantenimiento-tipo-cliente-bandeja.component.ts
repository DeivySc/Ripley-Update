import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { MantenimientoTipoClienteService } from '../../../../service-layer/mantenimiento/tipo-cliente/mantenimiento-tipo-cliente.service';
import { MantenimientoTipoClienteFormComponent } from '../form/mantenimiento-tipo-cliente-form.component';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';

import { MantenimientoTipoClienteModel } from 'src/app/model-layer/mantenimiento/tipo-cliente/mantenimiento-tipo-cliente.model';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'app-mantenimiento-tipo-cliente-bandeja',
  templateUrl: './mantenimiento-tipo-cliente-bandeja.component.html',
  styleUrls: ['./mantenimiento-tipo-cliente-bandeja.component.css']
})
export class MantenimientoTipoClienteBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  title: string = "Mantenimiento de Tipo de Cliente";

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  groups: any;
  
  constructor(
    private _header: HeaderService,
    private _service: MantenimientoTipoClienteService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['codigo', 'descripcion', 'editar', 'eliminar'];
    this.list.service = this._service;
    this.list.method = "page";
    this.list.resultMap = {
      "source": "listaTipoCliente",
      "length": "totalRegistros"
    };
    this.list.sort = {
      "column": "codigo",
      "direction": "desc"
    }
    this.list.sortMap = {
      "codigo": "ID"
    };
    this.list.search();

    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.model = new MantenimientoTipoClienteModel();
    this.apiForm.formSnackBar = this.matSnackBar;   
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }

  ngOnInit(): void {
    this._header.settingValues({ title: this.title });
    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      this.apiLoading.close();
    });
    
    this.apiLoading.show();
  }


  new() {
    const dialogRef = this.dialog.open(MantenimientoTipoClienteFormComponent, {
      width: '500px',
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
    const dialogRef = this.dialog.open(MantenimientoTipoClienteFormComponent, {
      width: '500px',
      height: '635px',
      data: {
        isEdit: true,
        codigo: row.codigo,
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
        this.apiForm.model.codigo = row.codigo;
        this.apiForm.model.estado = "0";

        this.apiForm.consume("delete", this.apiForm.model, (data:any) => {
          if (data.codigo == 0) {
            this.apiForm.message("eliminar");
          }          
          this.list.search();
        });
      }
    });
  }
}
