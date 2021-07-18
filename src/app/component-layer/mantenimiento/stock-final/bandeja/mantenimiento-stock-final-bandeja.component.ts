import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { MantenimientoStockFinalService } from '../../../../service-layer/mantenimiento/stock-final/mantenimiento-stock-final.service';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { MatPaginator } from '@angular/material/paginator';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { MantenimientoStockFinalModel } from 'src/app/model-layer/mantenimiento/stock-final/mantenimiento-stock-final.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
import { MantenimientoParametroService } from 'src/app/service-layer/mantenimiento/parametro/mantenimiento-parametro.service';
import { HttpClient } from '@angular/common/http';
import { ReglaCanjeService } from 'src/app/service-layer/reglas/canje/regla-canje.service';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

@Component({
  selector: 'mantenimiento-stock-final-bandeja',
  templateUrl: './mantenimiento-stock-final-bandeja.component.html',
  styleUrls: ['./mantenimiento-stock-final-bandeja.component.css']
})
export class MantenimientoStockFinalBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiFormParametro: ApiForm;
  apiFormTipoTarjeta: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  title: string = "Stock Final";

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  meses: any;
  tiposTarjeta: any;
  
  constructor(
    private _header: HeaderService,
    private _service: MantenimientoStockFinalService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private _http: HttpClient
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['tarjeta', 'unidades', 'valorSoles', 'usuario'];
    this.list.service = this._service;
    this.list.method = "page";
    this.list.resultMap = {
      "source": "listaStockFinal",
      "length": "totalRegistros"
    };
    this.list.sort = {
      "column": "TARJETA",
      "direction": "desc"
    }
    this.list.sortMap = {
      "tarjeta": "TARJETA"
    }

    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new MantenimientoStockFinalModel();
    this.apiForm.model.usrCre = this.apiForm.model.usuario = this.apiForm.model.usuarioRegistra = 'SRP';
    this.apiForm.fields = {
      mes: ['', [Validators.required]],
      anio: ['', [Validators.required, Validators.min(1990), Validators.max(parseInt((new Date()).getFullYear.toString()))]],
      listaTarjetas: ['', [Validators.required]]
    };
    this.apiForm.mapping = {
      mes: "mes",
      anio: "anio",
      listaTarjetas: "listaTarjetas"
    };
    this.apiForm.mappingToModel = () => {
    }
    this.apiForm.build();
    
    this.apiFormParametro = new ApiForm();    
    this.apiFormParametro.service = new MantenimientoParametroService(_http);

    this.apiFormTipoTarjeta = new ApiForm();    
    this.apiFormTipoTarjeta.service = new ReglaCanjeService(_http);    
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }

  ngOnInit(): void {
    this._header.settingValues({ title: this.title });

    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {  
      this.apiFormParametro.service.filterObj.padre = '90006';
      this.apiFormParametro.service.filterObj.estado = '1';

      this.apiFormParametro.consume("filterParent", {}, (data:any) => {
        this.meses = data.listaParametro;

        this.apiFormTipoTarjeta.consume("findAllTipoTarjeta", {}, (data:any) => {
          this.tiposTarjeta = data.listTipoTarjeta;
          this.apiLoading.close();
        });
      });      
    });
    
    this.apiLoading.show();
  }

  process() {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: { isExist: false, isDelete: false },
      disableClose: true,
      autoFocus: true,
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result.event.isExist;
      if (this.isExist) {     
        this.apiForm.toModel();
        this.apiForm.mappingToModel();
        
        this.apiLoading.loadCallback = (() => {
          this.apiForm.consume("save", this.apiForm.model, (data:any) => {
            if (data.codigo == 0){
              this.apiForm.message("guardar");
            }else{
              this.apiForm.message(data);
            }
            this.apiLoading.close();
            
            this._service.filterObj.mes = this.apiForm.model.mes;
            this._service.filterObj.anio = this.apiForm.model.anio;
            this._service.filterObj.listaTarjetas = this.apiForm.model.listaTarjetas.join();
            this.list.search();
          });
        });
        this.apiLoading.show();
      }
    });
  }
}

