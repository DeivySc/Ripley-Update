import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ReporteErrorProcesoService } from '../../../../service-layer/reporte/error-proceso/reporte-error-proceso.service';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { MatPaginator } from '@angular/material/paginator';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { ReporteErrorProcesoModel } from 'src/app/model-layer/reporte/error-proceso/reporte-error-proceso.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
import { Clipboard } from '@angular/cdk/clipboard';

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
  selector: 'app-reporte-error-proceso-bandeja',
  templateUrl: './reporte-error-proceso-bandeja.component.html',
  styleUrls: ['./reporte-error-proceso-bandeja.component.css'],
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
export class ReporteErrorProcesoBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  title: string = "Reporte de Detalle de Errores de Proceso";

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  sublist: any;
  
  periodos: any;
  
  minDateStart = new Date("1900-01-01");
  minDateEnd = new Date("1900-01-01");
  maxDate = new Date();
  
  constructor(
    private _header: HeaderService,
    private _service: ReporteErrorProcesoService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private clipboard: Clipboard,
    public datepipe: DatePipe
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['Caja', 'Documento', 'Tarjeta', 'Fecha', 'Monto', 'Sucursal', 'Motivo'];
    this.list.service = this._service;
    this.list.method = "page";
    this.list.resultMap = {
      "source": "lista",
      "length": "totalRegistros"
    }; 
    this.list.methodComplete = "list";    
    this.list.resultMapComplete = {
      "sourceComplete": "lista",
      "lengthComplete": "totalRegistros"
    };
    this.list.sort = {
      "column": "codigo",
      "direction": "desc"
    }
    this.list.apiExcel.columns = this.list.columns;
    this.list.apiExcel.values = ['caja', 'numeroDocumento', 'tarjeta', 'fechaTransaccion', 'monto', 'sucursal', 'mensaje'];

    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new ReporteErrorProcesoModel();
    this.apiForm.fields = {
      tipoTarjeta: [''],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]]
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
      this._service.filterObj.estado = "1";
      this.apiForm.errorCallback = ((data:any) => { this.apiLoading.error(data); });
      this.apiForm.consume("findAllTipoTarjeta", {}, (data:any) => {
        if(data != null){
          this.sublist = data.listaTipoTarjeta;  
        }
        this.apiLoading.close();
      });
    });
    
    this.apiLoading.show();   
  }

  search(): void {
    this._service.filterObj.fechaInicio = this.apiForm.reorderDateToInsert(this.apiForm.getField('fechaInicio').value._i);  
    this._service.filterObj.fechaFin = this.apiForm.reorderDateToInsert(this.apiForm.getField('fechaFin').value._i); 
    this._service.filterObj.tipoTarjeta = this.apiForm.getField('tipoTarjeta').value;
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