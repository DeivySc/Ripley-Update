import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../../../utils/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConsultaClienteService } from '../../../../service-layer/consulta/cliente/consulta-cliente.service';
import { ConsultaClienteModel } from '../../../../model-layer/consulta/cliente/consulta-cliente.model';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ApiForm } from "../../../../utils-layer/api-form/api-form";
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
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
  selector: 'consulta-cliente-actualizar',
  templateUrl: './consulta-cliente-actualizar.component.html',
  styleUrls: ['./consulta-cliente-actualizar.component.css'],
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
export class ConsultaClienteActualizarComponent implements OnInit {
  apiForm: ApiForm;
  apiFormParametro: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;
  errorMatcher = new CrossFieldErrorMatcher();

  listAjustes: any;
  minDate = new Date();
  maxDate = new Date();

  constructor(
    public dialogRef: MatDialogRef<ConsultaClienteActualizarComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private _service: ConsultaClienteService,
    private router: Router,
    private route: ActivatedRoute,
    private _http: HttpClient
  ) { 
    this.apiValidator = new ApiValidator();

    this.minDate.setDate(this.minDate.getDate() + 1)
    this.maxDate.setFullYear(3000);
    
    this.apiForm = new ApiForm();
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;    
    this.apiForm.datepipe = this.datepipe;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new ConsultaClienteModel();
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = this.apiForm.model.usrTransaccion = "SRP";

    this.route.paramMap.subscribe(params => {
      if(params["params"]["id"] != null){
        this._service.sharedData = params["params"]["id"];
        this._service.isEditing = true;

        this.data.isEdit = true;
        this.data.id = params["params"]["id"];
      }
    });

    if (this.data.isEdit) {
      this._service.sharedData = this.data.id;
      this._service.isEditing = true;
    }else{
      this._service.sharedData = null;
      this._service.isEditing = false;
    }

    this.apiForm.fields = {    
      tipoMovimiento: ['', [Validators.required]],
      codMovimiento: ['', [Validators.required]],
      observacion: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["text"]))]],
      ptosModificados: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["number"]))]],  
      fechaVencimiento: ['', [Validators.required]]
    };
    this.apiForm.mapping = {
      tipoMovimiento: "tipoMovimiento",
      codMovimiento: "codMovimiento",
      observacion: "observacion",
      ptosModificados: "ptosModificados",
      fechaVencimiento: "fechaVencimiento"
    };
    this.apiForm.mappingToForm = () => {
      this.apiForm.model.estado = ((this.apiForm.model.estado == null || this.apiForm.model.estado == "") ? "1" : this.apiForm.model.estado);
      this.apiForm.model.observacion = (this.apiForm.model.observacion == null ? "" : this.apiForm.model.observacion);
    }
    this.apiForm.mappingToModel = () => {
      this.apiForm.model.estado = ((this.apiForm.model.estado == null || this.apiForm.model.estado == "") ? "1" : this.apiForm.model.estado);
      this.apiForm.model.observacion = (this.apiForm.model.observacion == null ? "" : this.apiForm.model.observacion);
      this.apiForm.model.fechaVencimiento = this.apiForm.reorderDateToInsert(this.apiForm.model.fechaVencimiento._i);      
      this.apiForm.model.usrCre = this.apiForm.model.usrMod = this.apiForm.model.usrTransaccion = "SRP";      
    }

    this.apiFormParametro = new ApiForm();
    this.apiFormParametro.service = new MantenimientoParametroService(this._http);
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }


  ngOnInit(): void {
    this.apiForm.build();     
    this.onChangeSelected({value: "H"});
    
    this.apiForm.getField("tipoMovimiento").value = "H";
  }

  action(){
    if (this.apiForm.formGroup.status == "VALID") {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        data: {
          isExist: false
        },
        disableClose: true,
        autoFocus: true,
        panelClass: 'custom-modalbox'
      });
      dialogRef.afterClosed().subscribe(result => {
        this.isExist = result.event.isExist;
        if (this.isExist) {
          this.apiForm.toModel();
          this.apiForm.mappingToModel();
          
          this._service.filterObj.codigo = this.data.codigo;
          this.apiForm.consume("save", this.apiForm.model, (data:any) => {
            if (data.codigo != 0) {
              this.apiForm.message(data);
            }else{
              this.apiForm.message("guardar");

              this.data.isExist = true;
              this.closeDialog(this.data.isExist);
            }
          });
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  closeDialog(value?: any) {
    this.dialogRef.close({ event: value });
  }
  
  onChangeSelected(event:any):void{
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {    
      if(event.value.toString() == "H"){
        this.apiFormParametro.service.filterObj.padre = '8000';
      }else{
        this.apiFormParametro.service.filterObj.padre = '9000';  
      }
      this.apiFormParametro.service.estado = '1';
      
      this.listAjustes = null;
      this.apiFormParametro.consume("filterParent", {}, (data:any) => {
        this.listAjustes = data.listaParametro;
        this.apiLoading.close();
      });
    });
    
    this.apiLoading.show(); 
  }
}
