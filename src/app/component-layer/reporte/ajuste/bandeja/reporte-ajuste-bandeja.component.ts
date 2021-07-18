import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ReporteAjusteService } from '../../../../service-layer/reporte/ajuste/reporte-ajuste.service';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { MatPaginator } from '@angular/material/paginator';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { ReporteAjusteModel } from 'src/app/model-layer/reporte/ajuste/reporte-ajuste.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

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
  selector: 'app-reporte-ajuste-bandeja',
  templateUrl: './reporte-ajuste-bandeja.component.html',
  styleUrls: ['./reporte-ajuste-bandeja.component.css'],
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
export class ReporteAjusteBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  title: string = "Reporte de Ajustes";

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  sublist: any;  
  periodos: any;
  
  minDateStart = new Date("1900-01-01");
  minDateEnd = new Date("1900-01-01");
  maxDate = new Date();
  
  constructor(
    private _header: HeaderService,
    private _service: ReporteAjusteService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['Fecha', 'Usuario', 'Documento', 'Puntos', 'Código Movimiento', 'Motivo'];
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
    this.list.apiExcel.values = ['fechaTransaccion', 'usuarioTransaccion', null, 'ptosModif', 'codigoMovimiento', 'observacionTransaccion'];
    this.list.apiExcel.formats = [
      null,
      null,
      (row:any) => { return row.tipoDocumento + "-" + row.numeroDocumento; },
      null,
      null,
      null,
      null
    ];

    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new ReporteAjusteModel();
    this.apiForm.fields = {
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]]
    };
    this.apiForm.build();
  
    this._service.filterObj.estado = "1";
   
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

  search(): void {
    this._service.filterObj.fechaInicio = this.apiForm.reorderDateToInsert(this.apiForm.getField('fechaInicio').value._i).replace(/\-/gi, "");    
    this._service.filterObj.fechaFin = this.apiForm.reorderDateToInsert(this.apiForm.getField('fechaFin').value._i).replace(/\-/gi, "");   
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