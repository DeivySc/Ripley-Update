import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { MantenimientoEmailProcesoService } from '../../../../service-layer/mantenimiento/email-proceso/mantenimiento-email-proceso.service';
import { MantenimientoEmailProcesoFormComponent } from '../form/mantenimiento-email-proceso-form.component';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { MatPaginator } from '@angular/material/paginator';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { MantenimientoEmailProcesoModel } from 'src/app/model-layer/mantenimiento/email-proceso/mantenimiento-email-proceso.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { MantenimientoParametroService } from 'src/app/service-layer/mantenimiento/parametro/mantenimiento-parametro.service';
import { HttpClient } from '@angular/common/http';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'app-mantenimiento-email-proceso-bandeja',
  templateUrl: './mantenimiento-email-proceso-bandeja.component.html',
  styleUrls: ['./mantenimiento-email-proceso-bandeja.component.css']
})
export class MantenimientoEmailProcesoBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiFormParametro: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  title: string = "Mantenimiento de E-mail por Procesos";

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  sublist: any;
  
  tiposEnvio: any;
  
  constructor(
    private _header: HeaderService,
    private _service: MantenimientoEmailProcesoService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private _http: HttpClient
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['nombreProceso', 'nombreUsuario', 'tipoEnvio', 'email', 'editar', 'eliminar'];
    this.list.service = this._service;
    this.list.method = "page";
    this.list.resultMap = {
      "source": "listaEnvioMail",
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
    this.apiForm.model = new MantenimientoEmailProcesoModel();
    this.apiForm.fields = {
      tipoProceso: ['', [Validators.required]]
    };
    this.apiForm.build();
  
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
      this.apiFormParametro.service.filterObj.padre = "90003";
      this.apiFormParametro.errorCallback = ((data:any) => { this.apiLoading.error(data); });
      
      this.apiFormParametro.consume("filterParent", {}, (data:any) => {
        this.tiposEnvio = data.listaParametro;
  
        this.apiForm.errorCallback = this.apiLoading.error;
        this.apiForm.consume("findAllProcesos", {}, (data:any) => {
          if(data.listaProceso != null){
            this._service.filterObj.codigoProceso = data.listaProceso[0].codigo;
            this.apiForm.getField('tipoProceso').value = data.listaProceso[0].codigo;
    
            this.sublist = data.listaProceso;
            this.list.search();
          }

          this.apiLoading.close();
        });
      });
    });
    
    this.apiLoading.show();
  }


  new() {
    const dialogRef = this.dialog.open(MantenimientoEmailProcesoFormComponent, {
      width: '500px',
      height: '635px',
      data: {
        isEdit: false,
        codigo: null,
        tipoProceso: this.apiForm.getField('tipoProceso').value,
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
    const dialogRef = this.dialog.open(MantenimientoEmailProcesoFormComponent, {
      width: '500px',
      height: '635px',
      data: {
        isEdit: true,
        id: row.id,
        tipoProceso: null,
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
    this._service.filterObj.codigoProceso = e.value;
    this.list.search();
  }
  
  getTipoEnvio(_codigo:any):any{
    for(let i of Object.keys(this.tiposEnvio)){
      if(this.tiposEnvio[i].descripcion == _codigo){
        return this.tiposEnvio[i].comentario;
      }
    }
    return "";
  }
}

