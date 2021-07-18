import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ReporteDiarioAjusteService } from 'src/app/service-layer/reporte/diario-ajuste/reporte-diario-ajuste.service';
import { ApiTable } from "src/app/utils-layer/api-table/api-table";
import { MatPaginator } from '@angular/material/paginator';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { ReporteDiarioAjusteModel } from 'src/app/model-layer/reporte/diario-ajuste/reporte-diaro-ajuste.model';
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
  selector: 'app-reporte-diario-ajuste-bandeja',
  templateUrl: './reporte-diario-ajuste-bandeja.component.html',
  styleUrls: ['./reporte-diario-ajuste-bandeja.component.css'],
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
export class ReporteDiarioAjusteBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  title: string = "Reporte de Diario Ajustes";

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
    
  minDateStart = new Date("1900-01-01");
  minDateEnd = new Date("1900-01-01");
  maxDate = new Date();
  
  constructor(
    private _header: HeaderService,
    private _service: ReporteDiarioAjusteService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['Código de Ajuste', 'Glosa', 'Tarjeta', 'Numero de Tarjeta' ,'Número de Cuenta', 'Importe', 'Usuario'];
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
    this.list.apiExcel.values = ['codigoMovimiento', 'observacionTransaccion', 'subProducto', null, 'importe', 'usuarioTransaccion'];
    this.list.apiExcel.formats = [null, null, null, (row:any) => { return row.tipoDocumento + "-" + row.numeroDocumento; }, null, null];

    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new ReporteDiarioAjusteModel();
    this.apiForm.fields = {
      fechaInicio: ['', [Validators.required]]
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
      this.apiLoading.close();
    });
    
    this.apiLoading.show();
  }

  search(): void {
    this._service.filterObj.fechaInicio = this.apiForm.reorderDateToInsert(this.apiForm.getField('fechaInicio').value._i).replace(/\-/gi, "");    
    this.list.search();
  }

  copiar() {
    this.list.apiExcel.nameFile = this.title;
    this.list.apiExcel.nameSheet = "Datos";
    
    this.list.convertExcel();
  }
}