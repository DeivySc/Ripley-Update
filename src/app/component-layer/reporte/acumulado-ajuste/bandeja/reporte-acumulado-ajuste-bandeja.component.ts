import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ReporteAcumuladoAjusteService } from 'src/app/service-layer/reporte/acumulado-ajuste/reporte-acumulado-ajuste.service';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { MatPaginator } from '@angular/material/paginator';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { ReporteAcumuladoAjusteModel } from 'src/app/model-layer/reporte/acumulado-ajuste/reporte-acumulado-ajuste.model';
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
  selector: 'app-reporte-acumulado-ajuste-bandeja',
  templateUrl: './reporte-acumulado-ajuste-bandeja.component.html',
  styleUrls: ['./reporte-acumulado-ajuste-bandeja.component.css'],
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
export class ReporteAcumuladoAjusteBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiFormParametro: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  title: string = "Reporte de Acumulado Ajustes";

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  sublist: any;  
  periodos: any;
  listaAcumulado: any;
  
  constructor(
    private _header: HeaderService,
    private _service: ReporteAcumuladoAjusteService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private _http: HttpClient
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['Tarjeta', 'Código Movimiento', 'Tipo de Descripción', 'Puntos'];
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
    this.list.apiExcel.values = ['descripcionSubProducto', 'codigoMovimiento', 'descripcionMovimiento', 'puntos'];
    this.list.apiExcel.formats = [];

    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new ReporteAcumuladoAjusteModel();
    this.apiForm.fields = {
      mes: ['', [Validators.required]],
      anio: ['', [Validators.required, Validators.min(1990), Validators.max((new Date()).getFullYear())]]
    };
    this.apiForm.build();
  
    this._service.filterObj.estado = "1";
    
    this.apiFormParametro = new ApiForm();    
    this.apiFormParametro.service = new MantenimientoParametroService(_http);
   
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
        this.periodos = data.listaParametro;

        this.apiLoading.close();
      });      
    });
    
    this.apiLoading.show();
  }

  search(): void {
    this._service.filterObj.mes = this.apiForm.getField('mes').value;  
    this._service.filterObj.anio = this.apiForm.getField('anio').value; 
    this.list.search();
  }
  
  copiar() {
    this.list.apiExcel.nameFile = this.title;
    this.list.apiExcel.nameSheet = "Datos";

    this.list.convertExcel();
  }
}

