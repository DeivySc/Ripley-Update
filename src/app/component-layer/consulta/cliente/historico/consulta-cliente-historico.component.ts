import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { DialogConfirmComponent } from '../../../utils/dialog-confirm/dialog-confirm.component';
import { ConsultaClienteService } from 'src/app/service-layer/consulta/cliente/consulta-cliente.service';
import { ConsultaClienteHistoricoModel } from 'src/app/model-layer/consulta/cliente/consulta-cliente-historico.model';
import { ApiTable } from 'src/app/utils-layer/api-table/api-table';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ConsultaClienteCanjeModel } from 'src/app/model-layer/consulta/cliente/consulta-cliente-canje.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

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
  selector: 'app-consulta-cliente-historico',
  templateUrl: './consulta-cliente-historico.component.html',
  styleUrls: ['./consulta-cliente-historico.component.css'],
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
export class ConsultaClienteHistoricoComponent implements OnInit {
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;
  list: ApiTable;  
  isExist: boolean;
  
  errorMatcher = new CrossFieldErrorMatcher();
  
  minDateStart = new Date("1900-01-01");
  minDateEnd = new Date("1900-01-01");
  maxDate = new Date();

  constructor(
    public dialogRef: MatDialogRef<ConsultaClienteHistoricoComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private _service: ConsultaClienteService,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.apiValidator = new ApiValidator();
    
    this.isExist = null;
    
    this.apiForm = new ApiForm();
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;    
    this.apiForm.datepipe = this.datepipe;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new ConsultaClienteCanjeModel();

    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";  
    this.apiForm.fields = {
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],
      tipoMovimiento: ['', []],
    };
    this.apiForm.mapping = ({
      fechaInicio: "fechaInicio",
      fechaFin: "fechaFin",
      tipoMovimiento: "tipoMovimiento"
    });
    this.apiForm.mappingToForm = () => {
    }
    this.apiForm.mappingToModel = () => {
      this.apiForm.model.fechaInicio = this.apiForm.convertDateToString(this.apiForm.model.fechaInicio);
      this.apiForm.model.fechaFin = this.apiForm.convertDateToString(this.apiForm.model.fechaFin);
    }
    this.apiForm.build();
        
    this.list = new ApiTable();
    this.list.columns = ['Código', 'Glosa Mov.', 'Sucursal', 'Caja', 'Ticket', 'Fecha', 'Origen', 'Monto Ticket', 'Puntos', 'Tipo Mov.', 'Usuario'];
    this.list.service = this._service;
    this.list.method = "findAllHistorico";
    this.list.resultMap = {
      "source": "listMovimiento",
      "length": "totalRegistros"
    };
    this.list.methodComplete = "findAllHistoricoList";
    this.list.resultMapComplete = {
      "sourceComplete": "listMovimiento",
      "lengthComplete": "totalRegistros"
    };
    this.list.sort = {
      "column": "FECHA_TRANSACCION",
      "direction": "desc"
    }
    this.list.sortMap = {
      "fechaTransaccion": "FECHA_TRANSACCION",
      "codMov": "CODIGO"
    };

    this.list.apiExcel.columns = this.list.columns;
    this.list.apiExcel.values = ['codigo', 'descripcion', 'sucursal', 'caja', 'ticket', 'fechaTransaccion', 'origenMovimiento', 'montoTotal', 'ptosModificados', 'tipoMovimiento', 'usrTransaccion'];

    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }  
  
  ngOnInit(): void {    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      this.apiLoading.close();
    });
    
    this.apiLoading.show();
  }  
    
  closeDialog(value?: any) {
    this.dialogRef.close({ event: value });
  }
  
  close(): void {
    this.dialogRef.close();
  }

  getChange(e:any):void{
    this.minDateEnd = e.value;
    if(this.apiForm.getField("fechaFin").value < this.minDateEnd){
      this.apiForm.getField("fechaFin").setValue("");
    }
  }

  action(): void{
    this.apiForm.toModel();
    this.apiForm.mappingToModel();

    this.list.service.filterCanjeObj = this.apiForm.model;
    this.list.service.filterCanjeObj.idCliente = this.data.cliente.codigo;

    this.list.search(()=>{console.log(this.list.source);});
  }

  copiar() {
    this.list.apiExcel.nameFile = "HISTORICO";
    this.list.apiExcel.nameSheet = "Datos";

    this.list.convertExcel();
  }
}