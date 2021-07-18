import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ReporteMovimientoMesService } from '../../../../service-layer/reporte/movimiento-mes/reporte-movimiento-mes.service';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { MatPaginator } from '@angular/material/paginator';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { ReporteMovimientoMesModel } from 'src/app/model-layer/reporte/movimiento-mes/reporte-movimiento-mes.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { DatePipe } from '@angular/common';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
import { HttpClient } from '@angular/common/http';
import { MantenimientoParametroService } from 'src/app/service-layer/mantenimiento/parametro/mantenimiento-parametro.service';

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
  selector: 'app-reporte-movimiento-mes-bandeja',
  templateUrl: './reporte-movimiento-mes-bandeja.component.html',
  styleUrls: ['./reporte-movimiento-mes-bandeja.component.css'],
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
export class ReporteMovimientoMesBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiFormParametro: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  title: string = "Reporte de Detalle de Movimiento del Mes";

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  sublist: any;
  
  periodos: any;
  
  constructor(
    private _header: HeaderService,
    private _service: ReporteMovimientoMesService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private _http: HttpClient
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['Fecha', 'Huerut', 'SRP', 'LOG', 'DIF', '%', 
                         'Huerut C', 'SRP C', 'LOG C', 'DIF C', '% C', 
                         'Huerut J', 'SRP J', 'LOG J', 'DIF J', '% J', 
                         'Huerut R', 'SRP R', 'LOG R', 'DIF R', '% R'
                         ];
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
    this.list.apiExcel.columns = ['Fecha', 'Huerut', 'SRP', 'LOG', 'DIF', '%', 
                                    'Huerut ', 'SRP ', 'LOG ', 'DIF ', '% ',
                                    'Huerut  ', 'SRP  ', 'LOG  ', 'DIF  ', '%  ',
                                    'Huerut   ', 'SRP   ', 'LOG   ', 'DIF   ', '%   '];
    this.list.apiExcel.values = ['fecha', 'huerutV', 'srpV', 'logsV', 'difV', 'porcV',
                                  'huerutC', 'srpC', 'logsC', 'difC', 'porcC',
                                  'huerutJ', 'srpJ', 'logsJ', 'difJ', 'porcJ',
                                  'huerutR', 'srpR', 'logsR', 'difR', 'porcR'];
    this.list.apiExcel.formats = [];

    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new ReporteMovimientoMesModel();
    this.apiForm.fields = {
      tipoTarjeta: [''],
      mes: ['', [Validators.required]],
      anio: ['', [Validators.required, Validators.min(1900), Validators.max((new Date()).getFullYear())]]
    };
    this.apiForm.build();
    
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
      this.apiForm.consume("findAllTipoTarjeta", {}, (data:any) => {
        if(data != null){
          this.sublist = data.listTipoTarjeta;  
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
    this._service.filterObj.mes = this.apiForm.getField('mes').value._i;  
    this._service.filterObj.anio = this.apiForm.getField('anio').value._i; 
    this._service.filterObj.tipoTarjeta = this.apiForm.getField('tipoTarjeta').value;
    this.list.search();
  }
  
  copiar() {
    this.list.apiExcel.nameFile = this.title;
    this.list.apiExcel.nameSheet = "Datos";
    
    this.list.convertExcel();
  }
}