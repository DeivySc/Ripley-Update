import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../../../../component-layer/utils/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReglaCanjeService } from '../../../../service-layer/reglas/canje/regla-canje.service';
import { TipoTarjetaService } from '../../../../service-layer/tipo-tarjeta.service';
import { ReglaCanjeModel } from '../../../../model-layer/reglas/canje/regla-canje.model';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ApiForm } from "../../../../utils-layer/api-form/api-form";
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { HttpClient } from '@angular/common/http';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
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
  selector: 'regla-canje-form',
  templateUrl: './regla-canje-form.component.html',
  styleUrls: ['./regla-canje-form.component.css'],
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
export class ReglaCanjeFormComponent implements OnInit {
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;
  errorMatcher = new CrossFieldErrorMatcher();

  minDateStart = new Date();
  minDateEnd = new Date();
  maxDate = new Date();

  tipoTarjeta: any;

  constructor(
    public dialogRef: MatDialogRef<ReglaCanjeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private _http: HttpClient,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private _service: ReglaCanjeService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.apiValidator = new ApiValidator();
    
    this.apiForm = new ApiForm();
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;    
    this.apiForm.datepipe = this.datepipe;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new ReglaCanjeModel();
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";

    this.apiForm.fields = this.data.isEdit ? {
      id: ['', []],
      codTarjeta: ['', [Validators.required,]],
      inicioVigencia: ['', [Validators.required]],
      finVigencia: ['', [Validators.required]],
      valorPuntaje: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["number"], 8)), Validators.min(1), Validators.max(99999999)]],
      montoMinimo: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["number"], 8)), Validators.min(1), Validators.max(99999999)]],
      valorSoles: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["decimal"], 5, 3)), Validators.min(0.01), Validators.max(99999.999)]]
    } :  {
      id: ['', []],
      codTarjeta: ['', [Validators.required,]],
      inicioVigencia: ['', [Validators.required]],
      finVigencia: ['', [Validators.required]],
      valorPuntaje: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["number"], 8)), Validators.min(1), Validators.max(99999999)]],
      montoMinimo: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["number"], 8)), Validators.min(1), Validators.max(99999999)]],
      valorSoles: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["decimal"], 5, 3)), Validators.min(0.01), Validators.max(99999.999)]]
    };    
    this.apiForm.mapping = (this.data.isEdit ? {
      id: "id",
      codTarjeta: "codTarjeta",
      inicioVigencia: "inicioVigencia",
      finVigencia: "finVigencia",
      valorPuntaje: "valorPuntaje",
      valorSoles: "valorSoles",
      montoMinimo: "montoMinimo"
    } : {
      id: "id",
      codTarjeta: "codTarjeta",
      inicioVigencia: "inicioVigencia",
      finVigencia: "finVigencia",
      valorPuntaje: "valorPuntaje",
      valorSoles: "valorSoles",
      montoMinimo: "montoMinimo"
    });    
    this.apiForm.mappingToForm = () => {      
      if(this.data.isEdit){
        this.apiForm.model.inicioVigencia = this.apiForm.convertDateToString(this.apiForm.reorderDateToUpdate(this.apiForm.model.inicioVigencia));
        this.apiForm.model.valorPuntaje = parseInt(this.apiForm.model.valorPuntaje);
        this.apiForm.model.montoMinimo = parseInt(this.apiForm.model.montoMinimo);
      }else{
        this.apiForm.model.inicioVigencia = this.apiForm.reorderDateToUpdate(this.apiForm.model.inicioVigencia);
      }
      this.apiForm.model.finVigencia = this.apiForm.reorderDateToUpdate(this.apiForm.model.finVigencia);
      this.minDateStart = this.minDateEnd = this.apiForm.model.inicioVigencia;
      this.maxDate = this.apiForm.model.finVigencia;

      this.apiForm.model.estado = (this.apiForm.model.estado == null || this.apiForm.model.estado == "") ? "1" : this.apiForm.model.estado;
    }
    this.apiForm.mappingToModel = () => {
      if(this.data.isEdit){
        this.apiForm.model.finVigencia = this.apiForm.convertDateToString(this.apiForm.model.finVigencia);
      }else{
        this.apiForm.model.inicioVigencia = this.apiForm.reorderDateToInsert(this.apiForm.model.inicioVigencia._i);
        this.apiForm.model.finVigencia = this.apiForm.reorderDateToInsert(this.apiForm.model.finVigencia._i);
      }
      this.apiForm.model.estado = (this.apiForm.model.estado == null || this.apiForm.model.estado == "") ? 1 : this.apiForm.model.estado;
    }
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }


  ngOnInit(): void {
    this.apiForm.build();
    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {    
      if (this.data.isEdit) {
        this.apiForm.consume("findById", this.data.codigo, (data:any) => {
          this.apiForm.message("obtener");        
          this.apiForm.model = data;
          
          this.apiForm.consume("findAllTarjetas", {}, (data:any) => {
            this.tipoTarjeta = data.listTarjeta;
          });
          
          this.apiForm.mappingToForm();
          this.apiForm.toForm();
          
          this.apiLoading.close();
        });
      }else{
        this.apiForm.consume("findAllTarjetas", {}, (data:any) => {
          this.tipoTarjeta = data.listTarjeta;

          this.apiLoading.close();
        });
      }
    });
    
    this.apiLoading.show();
  }

  action(){
    if (this.apiForm.formGroup.status == "VALID") {
      if(this.validate()){
        const dialogRef = this.dialog.open(DialogConfirmComponent, {
          data: {
            isExist: false
          },
          disableClose: true,
          autoFocus: true,
          panelClass: 'custom-modalbox'
        });
    
        dialogRef.afterClosed().subscribe(result => {
          this.apiLoading.loadCallback = (() => {       
            this.isExist = result.event.isExist;
            if (this.isExist) {
              if(this.data.isEdit){
                this.apiForm.toModel();
                this.apiForm.mappingToModel();
        
                this.apiForm.model.codigo = this.data.codigo;
                this.apiForm.consume("update", this.apiForm.model, (data:any) => {
                  if(data.id != null){
                    this.apiForm.message("actualiza");
                    this.data.isExist = true;
                    this.closeDialog(this.data.isExist);    
                  }
                  
                  this.apiLoading.close();          
                });
              }else{
                this.apiForm.toModel();
                this.apiForm.mappingToModel();
                
                this.apiForm.consume("save", this.apiForm.model, (data:any) => {
                  if(data.id != null){
                    this.apiForm.message("guardar");
                    this.data.isExist = true;
                    this.closeDialog(this.data.isExist);
                  }

                  this.apiLoading.close();
                });
              }
            }else{
              this.apiLoading.close();
            }
          });
          this.apiLoading.show(true);
        });
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  closeDialog(value?: any) {
    this.dialogRef.close({ event: value });
  }
  
  getChange(e:any):void{
    this.minDateEnd = e.value;
    if(this.apiForm.getField("finVigencia").value < this.minDateEnd){
      this.apiForm.getField("finVigencia").setValue("");
    }
  }
    
  validate():boolean{
    return true;
  }
}