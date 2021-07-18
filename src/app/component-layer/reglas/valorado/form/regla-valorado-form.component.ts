import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../../../utils/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReglaValoradoService } from '../../../../service-layer/reglas/valorado/regla-valorado.service';
import { ReglaValoradoModel } from '../../../../model-layer/reglas/valorado/regla-valorado.model';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ApiForm } from "../../../../utils-layer/api-form/api-form";
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { HttpClient } from '@angular/common/http';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
import { MantenimientoParametroService } from 'src/app/service-layer/mantenimiento/parametro/mantenimiento-parametro.service';
import { MantenimientoParametroModel } from 'src/app/model-layer/mantenimiento/parametro/mantenimiento-parametro.model';
import { MatSelectChange } from '@angular/material/select';

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
  selector: 'regla-valorado-form',
  templateUrl: './regla-valorado-form.component.html',
  styleUrls: ['./regla-valorado-form.component.css'],
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
export class ReglaValoradoFormComponent implements OnInit {
  apiForm: ApiForm;
  apiFormParametro: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;
  errorMatcher = new CrossFieldErrorMatcher();

  minDateStart = new Date();
  minDateEnd = new Date();
  maxDate = new Date();

  establecimientos: any;
  valorados: any;

  constructor(
    public dialogRef: MatDialogRef<ReglaValoradoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private _http: HttpClient,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private _service: ReglaValoradoService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.apiValidator = new ApiValidator();

    this.minDateStart.setDate(this.minDateStart.getDate() + 1);
    this.minDateEnd.setDate(this.minDateEnd.getDate() + 1);
    
    this.apiForm = new ApiForm();
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;    
    this.apiForm.datepipe = this.datepipe;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new ReglaValoradoModel();
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";

    this.apiForm.fields = this.data.isEdit ? {
      id: ['', []],
      codEstablecimiento: ['', [Validators.required,]],
      valorado: ['', [Validators.required,]],
      factor: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["decimal"], 2, 9)), Validators.min(0.000000001), Validators.max(99.999999999)]],
      puntajeMinimo: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["decimal"], 6, 2)), Validators.min(1.00), Validators.max(999999.00)]],
      inicioVigencia: ['', [Validators.required]],
      finVigencia: ['', [Validators.required]]
    } :  {
      id: ['', []],
      codEstablecimiento: ['', [Validators.required,]],
      valorado: ['', [Validators.required,]],
      factor: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["decimal"], 2, 9)), Validators.min(0.000000001), Validators.max(99.999999999)]],
      puntajeMinimo: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["decimal"], 6, 2)), Validators.min(1.00), Validators.max(999999.00)]],
      inicioVigencia: ['', [Validators.required]],
      finVigencia: ['', [Validators.required]]
    };    
    this.apiForm.mapping = (this.data.isEdit ? {
      codEstablecimiento: "codEstablecimiento2",
      valorado: "valorado2",
      factor: "factor",
      inicioVigencia: "inicioVigencia",
      finVigencia: "finVigencia",
      puntajeMinimo: "puntajeMinimo"
    } : {
      codEstablecimiento: "codEstablecimiento",
      valorado: "valorado",
      factor: "factor",
      inicioVigencia: "inicioVigencia",
      finVigencia: "finVigencia",
      puntajeMinimo: "puntajeMinimo"
    });    
    this.apiForm.mappingToForm = () => {
      if(this.data.isEdit){
        this.apiForm.model.inicioVigencia = this.apiForm.convertDateToString(this.apiForm.reorderDateToUpdate(this.apiForm.model.inicioVigencia));
      }else{
        this.apiForm.model.inicioVigencia = this.apiForm.reorderDateToUpdate(this.apiForm.model.inicioVigencia);
      }
      this.apiForm.model.finVigencia = this.apiForm.reorderDateToUpdate(this.apiForm.model.finVigencia);
      this.minDateStart = this.minDateEnd = this.apiForm.model.inicioVigencia;
      this.maxDate = this.apiForm.model.finVigencia;
      
      this.apiForm.model.codEstablecimiento2 = this.apiForm.model.codEstablecimiento;
      this.apiForm.model.valorado2 = this.apiForm.model.valorado;

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
    
    this.apiFormParametro = new ApiForm();
    this.apiFormParametro.service = new MantenimientoParametroService(this._http);
  }


  ngOnInit(): void {
    this.apiForm.build();

    this.apiLoading.errorCallback = (() => {
    });

    this.apiLoading.loadCallback = (() => {      
      this.apiFormParametro.service.filterObj = new MantenimientoParametroModel();
      this.apiFormParametro.service.filterObj.filtroTabla = "'establecimiento'";
      this.apiFormParametro.service.filterObj.columnaNombre = "DESCRIPCION";
      this.apiFormParametro.service.filterObj.columnaOrden = "asc";

      this.apiFormParametro.consume("filterMasiva", {}, (data:any) => {
        this.establecimientos = data.listaParametro.filter((x:any) => x.tabla == "establecimiento");

        if (this.data.isEdit) {
          this.apiForm.consume("findById", this.data.codigo, (data:any) => {
            this.apiForm.message("obtener");        
            this.apiForm.model = data;

            this.apiForm.mappingToForm();
            this.apiForm.toForm();
            
            this.apiForm.getField('codEstablecimiento').disable();
            this.apiForm.getField('valorado').disable();

            this.apiLoading.close();
            
            if(this.establecimientos != null){
              this.fillValorado(this.apiForm.model.codEstablecimiento, this.apiForm.model.valorado);
            }
          });
        }else{
          this.apiLoading.close();
            
          if(this.establecimientos != null){
            this.apiForm.getField('codEstablecimiento').setValue(this.establecimientos[0].id);
            this.fillValorado(this.establecimientos[0].id);
          }
        }
      });
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
  
  selectedValueEstablecimiento(event: MatSelectChange) {
    this.fillValorado(event.value);
  }

  fillValorado(codigoEstablecimiento: string, codigoValorado?: string){
    this.apiLoading.loadCallback = (() => {    
      this.apiFormParametro.service.filterObj = new MantenimientoParametroModel();  
      this.apiFormParametro.service.filterObj.filtroTabla = (this.data.isEdit ? "'valoradoreglavigente'" : "'valoradosinreglavigente'");
      this.apiFormParametro.service.filterObj.filtroValoradoReglaVigente = "'" + codigoEstablecimiento + "'";
      this.apiFormParametro.service.filterObj.filtroValoradoSinReglaVigente = "'" + codigoEstablecimiento + "'";
      this.apiFormParametro.service.filterObj.columnaNombre = "DESCRIPCION";
      this.apiFormParametro.service.filterObj.columnaOrden = "asc";

      this.apiFormParametro.consume("filterMasiva", {}, (data:any) => {
        if(data != null){
          this.valorados = data.listaParametro.filter((x:any) => x.tabla == (this.data.isEdit ? "valoradoreglavigente" : "valoradosinreglavigente"));

          if(this.valorados != null && this.valorados.length > 0){
            if(codigoValorado != null){
              this.apiForm.getField("valorado").setValue(codigoValorado);
            }else{
              this.apiForm.getField("valorado").setValue(this.valorados[0].id);
            }
          }else{
            this.apiForm.getField("valorado").reset();
          }
        }
        this.apiLoading.close();
      });
    });   
        
    this.apiLoading.show();
  }
  
  validate():boolean{
    return true;
  }
}