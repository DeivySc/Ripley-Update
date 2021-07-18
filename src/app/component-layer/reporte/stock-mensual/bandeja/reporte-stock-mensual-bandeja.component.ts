import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ReporteStockMensualService } from 'src/app/service-layer/reporte/stock-mensual/reporte-stock-mensual.service';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { MatPaginator } from '@angular/material/paginator';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { ReporteStockMensualModel } from 'src/app/model-layer/reporte/stock-mensual/reporte-stock-mensual.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
import { MantenimientoParametroService } from 'src/app/service-layer/mantenimiento/parametro/mantenimiento-parametro.service';
import { HttpClient } from '@angular/common/http';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-reporte-stock-mensual-bandeja',
  templateUrl: './reporte-stock-mensual-bandeja.component.html',
  styleUrls: ['./reporte-stock-mensual-bandeja.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'es-ES'
    }
  ]
})
export class ReporteStockMensualBandejaComponent implements OnInit {
  list: ApiTable;
  listDetalle: ApiTable;
  listValidar: ApiTable;
  listLeyenda: ApiTable;
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;
  apiFormParametro: ApiForm;

  title: string = "Reporte de Stock Mensual de Ripley Puntos";

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  sublist: any;
  
  periodos: any;

  listaAcumulado: any;
  tipoSubProducto: any;
  
  constructor(
    private _header: HeaderService,
    private _service: ReporteStockMensualService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private _http: HttpClient,
    public datepipe: DatePipe
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['Tarjeta', 'Stock Inicial', 'Puntos por Compras', 'Tarjeta Ripley', 'Certificado', 'Cta Cancelada',
                          'Cta Mora', 'Cta sin Compras', 'Caducidad', 'Ajustes', 'Ajustes Negativos', 'Stock Final'];
    this.list.service = this._service;
    this.list.method = "page";
    this.list.resultMap = {
      "source": "lista",
      "length": "totalRegistros"
    };
    this.list.sort = {
      "column": "codigo",
      "direction": "desc"
    }

    this.list.methodComplete  = "list";
    this.list.resultMapComplete = {
      "sourceComplete": "lista",
      "lengthComplete": "totalRegistros"
    };



    this.listDetalle = new ApiTable();
    this.listDetalle.columns = ['Tarjeta', 'Compra Tienda', 'Compra Establecimiento', 'No Acum. LC', 'Total'];
    this.listDetalle.service = this._service;
    this.listDetalle.method = "fillDetalle";
    this.listDetalle.resultMap = {
      "source": "lista",
      "length": "totalRegistros"
    };
    this.listDetalle.sort = {
      "column": "codigo",
      "direction": "desc"
    }
    //this.listDetalle.methodComplete  = "listDetalle";
    this.listDetalle.resultMapComplete = {
      "sourceComplete": "lista",
      "lengthComplete": "totalRegistros"
    };

    this.listValidar = new ApiTable();
    this.listValidar.columns = ['Concepto', 'Puntos del Mes'];
    this.listValidar.service = this._service;
    this.listValidar.method = "fillValidar";
    this.listValidar.resultMap = {
      "source": "lista",
      "length": "totalRegistros"
    };
    this.listValidar.sort = {
      "column": "codigo",
      "direction": "desc"
    }
    //this.listDetalle.methodComplete  = "listDetalle";
    this.listValidar.resultMapComplete = {
      "sourceComplete": "lista",
      "lengthComplete": "totalRegistros"
    };
    
    this.listLeyenda = new ApiTable();
    this.listLeyenda.columns = ['Producto', 'Unidad'];
    this.listLeyenda.service = this._service;
    this.listLeyenda.method = "fillLeyenda";
    this.listLeyenda.resultMap = {
      "source": "lista",
      "length": "totalRegistros"
    };
    this.listLeyenda.sort = {
      "column": "codigo",
      "direction": "desc"
    }
    //this.listDetalle.methodComplete  = "listDetalle";
    this.listLeyenda.resultMapComplete = {
      "sourceComplete": "lista",
      "lengthComplete": "totalRegistros"
    };

    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new ReporteStockMensualModel();
    this.apiForm.fields = {
      mes: ['', [Validators.required]],
      anio: ['', [Validators.required]],
      tipoSubProducto: ['']
    };
    this.apiForm.build();
  
    this._service.filterObj.estado = "1";
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;

    this.apiFormParametro = new ApiForm();    
    this.apiFormParametro.service = new MantenimientoParametroService(_http);
  }

  ngOnInit(): void {
    this._header.settingValues({ title: this.title });
    this.apiLoading.errorCallback = (() => {
    });

    
    this.apiLoading.loadCallback = (() => {  
      this._service.filterObj.estado = "1";
      this.apiForm.errorCallback = ((data:any) => { this.apiLoading.error(data); });
      this.apiForm.consume("findTipoSubproducto", {}, (data:any) => {
        if(data != null){
          this.sublist = data;  
        }
        this.apiFormParametro.service.filterObj.padre = '90006';
        this.apiFormParametro.service.filterObj.estado = '1';

        this.apiFormParametro.consume("filterParent", {}, (data:any) => {
          this.periodos = data.listaParametro;

          this.apiLoading.close();
        });
      });
    });
    this.apiLoading.show();
    
  }

  search(): void {
    this._service.filterObj.mes = this.apiForm.getField('mes').value;  
    this._service.filterObj.anio = this.apiForm.getField('anio').value; 
    this._service.filterObj.tipoSubProducto = this.apiForm.getField('tipoSubProducto').value; 
    this.list.search();
    this.listDetalle.search();
    this.listValidar.search();
    this.listLeyenda.search();
      
  }
  
  copiar() {
    this.list.apiExcel.nameFile = this.title;
    this.list.apiExcel.nameSheet = "Datos";
    
    this.listDetalle.apiExcel.nameFile = this.title;
    this.listDetalle.apiExcel.nameSheet = "Detalle";
    
    this.listValidar.apiExcel.nameFile = this.title;
    this.listValidar.apiExcel.nameSheet = "Validar";
    
    this.listLeyenda.apiExcel.nameFile = this.title;
    this.listLeyenda.apiExcel.nameSheet = "Leyenda";

    this.list.convertExcel();
    this.listDetalle.convertExcel();
    this.listValidar.convertExcel();
    this.listLeyenda.convertExcel();
  }
}