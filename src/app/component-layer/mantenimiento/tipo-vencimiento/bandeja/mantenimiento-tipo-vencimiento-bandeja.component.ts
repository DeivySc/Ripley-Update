import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { MantenimientoTipoVencimientoService } from '../../../../service-layer/mantenimiento/tipo-vencimiento/mantenimiento-tipo-vencimiento.service';
import { MantenimientoTipoVencimientoFormComponent } from '../form/mantenimiento-tipo-vencimiento-form.component';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { MatPaginator } from '@angular/material/paginator';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { MantenimientoTipoVencimientoModel } from 'src/app/model-layer/mantenimiento/tipo-vencimiento/mantenimiento-tipo-vencimiento.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { HttpClient } from '@angular/common/http';
import { MantenimientoParametroService } from 'src/app/service-layer/mantenimiento/parametro/mantenimiento-parametro.service';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'app-mantenimiento-tipo-vencimiento-bandeja',
  templateUrl: './mantenimiento-tipo-vencimiento-bandeja.component.html',
  styleUrls: ['./mantenimiento-tipo-vencimiento-bandeja.component.css']
})
export class MantenimientoTipoVencimientoBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiFormParametro: ApiForm;
  apiLoading: ApiLoading;
  apiValidator: ApiValidator;

  title: string = "Mantenimiento de Tipos de Vencimiento";

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  modosVigencia: any;
  
  constructor(
    private _header: HeaderService,
    private _service: MantenimientoTipoVencimientoService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private _http: HttpClient
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['codigoTipoVencimientoTipoCliente', 'tipoCliente', 'tipoVencimiento', 'tiempoVigencia', 'modoVigencia', 'editar', 'eliminar'];
    this.list.service = this._service;
    this.list.method = "page";
    this.list.resultMap = {
      "source": "listaTipoVencimientoTipoCliente",
      "length": "totalRegistros"
    };
    this.list.sort = {
      "column": "ID",
      "direction": "desc"
    }
    this.list.sortMap = {
      "codigoTipoVencimientoTipoCliente": "ID"
    }
    this.list.search();

    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new MantenimientoTipoVencimientoModel();
    
    this.apiFormParametro = new ApiForm();
    this.apiFormParametro.service = new MantenimientoParametroService(this._http);    
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }

  ngOnInit(): void {
    this._header.settingValues({ title: this.title });
    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      this.apiFormParametro.service.filterObj.estado = "1";
      this.apiFormParametro.service.filterObj.padre = "90004";
      this.apiFormParametro.consume("filterParent", {}, (data:any) => {
        this.modosVigencia = data.listaParametro;
                
        this.apiLoading.close();
      });
    });
      
    this.apiFormParametro.errorCallback = ((data:any) => { this.apiLoading.error(data); });
    this.apiLoading.show();
  }


  new() {
    const dialogRef = this.dialog.open(MantenimientoTipoVencimientoFormComponent, {
      width: '500px',
      height: '635px',
      data: {
        isEdit: false,
        codigoTipoVencimiento: null,
        codigoTipoVencimientoTipoCliente: null,
        codigoTipoCliente: null,
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
    const dialogRef = this.dialog.open(MantenimientoTipoVencimientoFormComponent, {
      width: '500px',
      height: '635px',
      data: {
        isEdit: true,
        codigoTipoVencimiento: row.codigoTipoVencimiento,
        codigoTipoVencimientoTipoCliente: row.codigoTipoVencimientoTipoCliente,
        codigoTipoCliente: row.codigoTipoCliente,
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
        this.apiForm.model.codigoTipoVencimiento = row.codigoTipoVencimiento;
        this.apiForm.model.codigoTipoVencimientoTipoCliente = row.codigoTipoVencimientoTipoCliente;
        this.apiForm.model.codigoTipoCliente = row.codigoTipoCliente;
        this.apiForm.model.codigo = row.codigoTipoVencimientoTipoCliente;
        this.apiForm.model.estado = "0";
        
        this.apiForm.consume("updateFieldEstado", this.apiForm.model, (data:any) => {
          if (data.codigo == 0) this.apiForm.message("eliminar");
          
          this.list.search();
        });
      }
    });
  }

  getModoVigencia(_codigo:any):any{
    if(this.modosVigencia != null){
      for(let i of Object.keys(this.modosVigencia)){
        if(this.modosVigencia[i].descripcion == _codigo){
          return this.modosVigencia[i].comentario;
        }
      }
    }
    return "";
  }
}

