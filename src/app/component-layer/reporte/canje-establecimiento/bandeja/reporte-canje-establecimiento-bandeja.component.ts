import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ReporteCanjeEstablecimientoService } from 'src/app/service-layer/reporte/canje-establecimiento/reporte-canje-establecimiento.service';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { MatPaginator } from '@angular/material/paginator';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { ReporteCanjeEstablecimientoModel } from 'src/app/model-layer/reporte/canje-establecimiento/reporte-canje-establecimiento.model';
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
  selector: 'app-reporte-canje-establecimiento-bandeja',
  templateUrl: './reporte-canje-establecimiento-bandeja.component.html',
  styleUrls: ['./reporte-canje-establecimiento-bandeja.component.css'],
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
export class ReporteCanjeEstablecimientoBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiFormParametro: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;
  apiLoadingEmision: ApiLoading;

  title: string = "Reporte de Canje Establecimiento";

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  sublist: any;
  
  periodos: any;

  establecimientoCanjeList: any;
  sucursalEmisionList: any;
  promotoraList: any;
  
  minDateStart = new Date("1900-01-01");
  minDateEnd = new Date("1900-01-01");
  maxDate = new Date();
  
  constructor(
    private _header: HeaderService,
    private _service: ReporteCanjeEstablecimientoService,
    public dialog: MatDialog,
    public dialogEmision: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private _http: HttpClient
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['Fecha', 'Cliente', 'Documento', 'Sucursal de Emisión', 'Establecimientos de Canje', 'Producto', 'Puntos S/', 'Promotor', 'Número Certificado'];
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
    
    this.list.apiExcel.columns = this.list.columns;
    this.list.apiExcel.values = ['fechaEmision', 'nombresCliente', null, 'descripcionSucursal', 'descripcionValorado', 'descripcionProducto', 'ptosSoles', 'promotor', 'codigoCertificado'];
    this.list.apiExcel.formats = [
      null,
      null,
      (row:any) => { return (row.tipoDocumento != "" && row.tipoDocumento != null ? row.tipoDocumento + "-" + row.identificacionCliente : row.identificacionCliente); },
      null,
      null,
      null,
      null,
      null,
      null
    ];

    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new ReporteCanjeEstablecimientoModel();
    this.apiForm.fields = {
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      tipoReporte: ['H', []],
      filtroEstablecimientoCanje: [''],
      filtroSucursalEmision: [''],
      filtroPromotora: ['']
    };
    this.apiForm.build();
  
    this._service.filterObj.estado = "1";
   
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
      this.apiFormParametro.service.filterObj.filtroTabla = "'sucursal', 'establecimiento', 'usuario'";
      this.apiFormParametro.service.filterObj.filtroParametro = "";
      this.apiFormParametro.service.filterObj.columnaNombre = "DESCRIPCION";
      this.apiFormParametro.service.filterObj.columnaOrden = "asc";
      this.apiFormParametro.consume("filterMasiva", {}, (data:any) => {
        this.sucursalEmisionList = data.listaParametro.filter((x:any) => x.tabla == "sucursal");
        this.establecimientoCanjeList = data.listaParametro.filter((x:any) => x.tabla == "establecimiento");
        this.promotoraList = data.listaParametro.filter((x:any) => x.tabla == "usuario");

        this.apiLoading.close();
      });
    });
    
    this.apiLoading.show();
  }

  search(): void {
    this._service.filterObj.fechaInicio = this.apiForm.reorderDateToInsert(this.apiForm.getField('fechaInicio').value._i);    
    this._service.filterObj.fechaFin = this.apiForm.reorderDateToInsert(this.apiForm.getField('fechaFin').value._i);   
    this._service.filterObj.tipoReporte = this.apiForm.getField('tipoReporte').value; 
    this._service.filterObj.filtroEstablecimientoCanje = this.apiForm.getField('filtroEstablecimientoCanje').value; 
    this._service.filterObj.filtroSucursalEmision = this.apiForm.getField('filtroSucursalEmision').value; 
    this._service.filterObj.filtroPromotora = this.apiForm.getField('filtroPromotora').value; 

    console.log(this._service.filterObj.filtroPromotora);
    this.list.search();
  }

  getChange(e:any):void{
    this.minDateEnd = e.value;
    if(this.apiForm.getField("fechaFin").value < this.minDateEnd){
      this.apiForm.getField("fechaFin").setValue("");
    }
  }
  
  copiar() {
    this.list.apiExcel.nameFile = this.title;
    this.list.apiExcel.nameSheet = "Datos";
    
    this.list.convertExcel();
  }
}