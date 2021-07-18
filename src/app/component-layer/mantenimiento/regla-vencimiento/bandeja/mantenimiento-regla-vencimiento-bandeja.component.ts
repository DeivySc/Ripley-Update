import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { MantenimientoReglaVencimientoService } from '../../../../service-layer/mantenimiento/regla-vencimiento/mantenimiento-regla-vencimiento.service';
import { MantenimientoReglaVencimientoFormComponent } from '../form/mantenimiento-regla-vencimiento-form.component';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { MatPaginator } from '@angular/material/paginator';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { MantenimientoReglaVencimientoModel } from 'src/app/model-layer/mantenimiento/regla-vencimiento/mantenimiento-regla-vencimiento.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
import { MantenimientoParametroModel } from 'src/app/model-layer/mantenimiento/parametro/mantenimiento-parametro.model';
import { MantenimientoParametroService } from 'src/app/service-layer/mantenimiento/parametro/mantenimiento-parametro.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mantenimiento-regla-vencimiento-bandeja',
  templateUrl: './mantenimiento-regla-vencimiento-bandeja.component.html',
  styleUrls: ['./mantenimiento-regla-vencimiento-bandeja.component.css']
})
export class MantenimientoReglaVencimientoBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiFormParametro: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  title: string = "Mantenimiento de Reglas de Vencimiento";

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  sublist: any;
  
  periodos: any;
  
  constructor(
    private _header: HeaderService,
    private _service: MantenimientoReglaVencimientoService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private _http:HttpClient
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['tipoCliente', 'movimiento', 'periodo', 'editar', 'eliminar'];
    this.list.service = this._service;
    this.list.method = "page";
    this.list.resultMap = {
      "source": "listaReglaVencimiento",
      "length": "totalRegistros"
    };
    this.list.sort = {
      "column": "codigo",
      "direction": "desc"
    }

    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new MantenimientoReglaVencimientoModel();
    this.apiForm.fields = {
      tipoCliente: ['', [Validators.required]]
    };
    this.apiForm.build();
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
    
    this.apiFormParametro = new ApiForm();
    this.apiFormParametro.service = new MantenimientoParametroService(this._http);    
  }

  ngOnInit(): void {
    this._header.settingValues({ title: this.title }); 

    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {  
      this.apiFormParametro.service.filterObj = new MantenimientoParametroModel();
      this.apiFormParametro.service.filterObj.filtroTabla = "'parametro', 'tipocliente'";
      this.apiFormParametro.service.filterObj.filtroParametro = "'90001'";
      this.apiFormParametro.service.filterObj.columnaNombre = "DESCRIPCION";
      this.apiFormParametro.service.filterObj.columnaOrden = "asc";

      this.apiFormParametro.consume("filterMasiva", {}, (data:any) => {
        this.periodos = data.listaParametro.filter((x:any) => x.tabla == "parametro" && x.codigo_padre == "90001");
        this.sublist = data.listaParametro.filter((x:any) => x.tabla == "tipocliente");
        
        if(this.sublist != null){
          this.apiForm.getField('tipoCliente').value = this.sublist[0].id;

          this._service.filterObj.codigoTipoCliente = this.sublist[0].id;
          this._service.filterObj.codigoMovimiento = "";
          this._service.filterObj.estado = "1";
  
          this.list.search();
        }

        this.apiLoading.close();
      });
    });
    
    this.apiLoading.show();
  }


  new() {
    const dialogRef = this.dialog.open(MantenimientoReglaVencimientoFormComponent, {
      width: '500px',
      height: '635px',
      data: {
        isEdit: false,
        codigoMovimiento: null,
        codigoTipoCliente: this._service.filterObj.codigoTipoCliente,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result;

      this._service.filterObj.codigoMovimiento = "";
      this._service.filterObj.estado = "1";

      if (this.isExist) {
        this.list.search();
      }
    });
  }

  edit(row:any) {
    const dialogRef = this.dialog.open(MantenimientoReglaVencimientoFormComponent, {
      width: '500px',
      height: '635px',
      data: {
        isEdit: true,
        codigoMovimiento: row.codigoMovimiento,
        codigoTipoCliente: row.codigoTipoCliente,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result;

      this._service.filterObj.codigoMovimiento = "";
      this._service.filterObj.estado = "1";

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
        this.apiForm.model.codigoTipoCliente = row.codigoTipoCliente;
        this.apiForm.model.codigoTipoClienteCrm = row.codigoTipoCliente;
        this.apiForm.model.codigoMovimiento = row.codigoMovimiento;
        this.apiForm.model.estado = "0";
        
        this.apiForm.consume("updateFieldEstado", this.apiForm.model, (data:any) => {
          if (data.codigo == 0) this.apiForm.message("eliminar");
          
          this._service.filterObj.codigoMovimiento = "";
          this._service.filterObj.estado = "1";
          
          this.list.search();
        });
      }
    });
  }

  onChangeSelected(e:any):void{
    this._service.filterObj.codigoTipoCliente = e.value;
    this._service.filterObj.codigoMovimiento = "";
    this._service.filterObj.estado = "1";
    
    this.list.search();
  }

  getPeriodo(_codigo:any):any{
    if(this.periodos != null){
      for(let i of Object.keys(this.periodos)){
        if(this.periodos[i].codigo == _codigo){
          return this.periodos[i].descripcion;
        }
      }
    }
    return "";
  }
}

