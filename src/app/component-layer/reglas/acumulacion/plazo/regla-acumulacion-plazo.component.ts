import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { ApiForm } from "../../../../utils-layer/api-form/api-form";

import { DialogConfirmComponent } from '../../../utils/dialog-confirm/dialog-confirm.component';
import { ReglaAcumulacionPlazoService } from "../../../../service-layer/reglas/acumulacion/regla-acumulacion-plazo.service";
import { ReglaAcumulacionPlazoModel } from "../../../../model-layer/reglas/acumulacion/regla-acumulacion-plazo.model";
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';

import { HeaderService } from '../../../../services/header.service';

import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiValidator, optionalValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'app-regla-acumulacion-plazo.component',
  templateUrl: './regla-acumulacion-plazo.component.html',
  styleUrls: ['./regla-acumulacion-plazo.component.css']
})
export class ReglaAcumulacionPlazoComponent implements OnInit {
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;

  titulo: string = "";  
  textoBoton: string = "Guardar"

  list: any;

  errorMatcher = new CrossFieldErrorMatcher();
  
  constructor(
    public dialogRef: MatDialogRef<ReglaAcumulacionPlazoComponent>,
    private _header: HeaderService,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private _http: HttpClient,
    public _service: ReglaAcumulacionPlazoService,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {  
    this.apiValidator = new ApiValidator();
    
    this.apiForm = new ApiForm();
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;    
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new ReglaAcumulacionPlazoModel();
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";

    this.route.paramMap.subscribe(params => {
      if(params["params"]["id"] != null){
        this._service.sharedData = params["params"]["id"];
        this._service.isEditing = true;

        this.data.isEdit = true;
        this.data.codigo = params["params"]["id"];
      }
    });

    if (this.data.isEdit) {
      this._service.sharedData = this.data.codigo;
      this._service.isEditing = true;
    }else{
      this._service.sharedData = null;
      this._service.isEditing = false;
    }

    this.apiForm.fields = {
      tipo: ['', [Validators.required]],
      plazoMinimo: ['', [optionalValidator([Validators.pattern(this.apiValidator.regularExpression(["number"], 3))])]],
      plazoMaximo: ['', [optionalValidator([Validators.pattern(this.apiValidator.regularExpression(["number"], 3))])]],
      plazoTotal: ['', [optionalValidator([Validators.pattern(this.apiValidator.regularExpression(["number"], 3))])]]
    };
    this.apiForm.mapping = (this._service.isEditing ? {
      tipo: "tipo",
      plazoMinimo: "plazoMinimo",
      plazoMaximo: "plazoMaximo",
      plazoTotal: "plazoTotal"
    } : {
      tipo: "tipo",
      plazoMinimo: "plazoMinimo",
      plazoMaximo: "plazoMaximo",
      plazoTotal: "plazoTotal"
    });

    this.apiForm.mappingToForm = () => {
      this.apiForm.model.plazoTotal = this.apiForm.model.plazoMaximo;
    }
    this.apiForm.mappingToModel = () => {
      this.apiForm.model.id = (this.apiForm.model.id != null || this.apiForm.model.id == "") ? this.apiForm.model.tipo : this.apiForm.model.id;
      this.apiForm.model.codigo = (this.apiForm.model.codigo != null || this.apiForm.model.codigo == "") ? this.apiForm.model.tipo : this.apiForm.model.codigo;

      for(let i of Object.keys(this.list)){
        if(this.list[i].codigo == this.apiForm.model.tipo){
          this.apiForm.model.descripcion = this.list[i].descripcion;

          if(parseInt(i) == 0) {
            this.apiForm.model.plazoMinimo = "";
            this.apiForm.model.plazoMaximo = "";
            break;
          }else if(parseInt(i) == 1) {
          }else if(parseInt(i) == 2) {
            this.apiForm.model.plazoMinimo = "";
            this.apiForm.model.plazoMaximo = this.apiForm.model.plazoTotal;
          }
        }
      }
    }
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }


  ngOnInit() {
    let year = new Date();

    this.apiForm.build();
    this.apiForm.consume("list", {}, (data:any) => {
      this.list = data;
      
      if (this.data.isEdit) {    
        this.apiForm.model = this.data.returnObj;

        this.apiForm.mappingToForm();
        this.apiForm.toForm();
        
        this.enablePlazos(this.apiForm.model.tipo);
        
        this.titulo = "Modificar Plazo";
        this.textoBoton = "Actualizar";
      }else{
        this.titulo = "Nuevo Plazo";
      }
    });
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
          this.isExist = result.event.isExist;
          if (this.isExist) {
            this.apiForm.toModel();
            this.apiForm.mappingToModel();
            
            this.apiForm.message("actualiza");

            this.data.returnObj = this.apiForm.model;          
            this.data.isExist = true;
            
            this.closeDialog(this.data);
          }
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

  validate():boolean{
    if(this.apiForm.getField("tipo").value != ""){
      if(this.list[1].codigo == this.apiForm.getField("tipo").value){
        if(this.apiForm.getField("plazoMinimo").value == "" || this.apiForm.getField("plazoMaximo").value == ""
          || this.apiForm.getField("plazoMinimo").value == null || this.apiForm.getField("plazoMaximo").value == null
          || parseInt(this.apiForm.getField("plazoMinimo").value) > parseInt(this.apiForm.getField("plazoMaximo").value)
          || parseInt(this.apiForm.getField("plazoMinimo").value) == 0
          || parseInt(this.apiForm.getField("plazoMaximo").value) == 0
          || parseInt(this.apiForm.getField("plazoMinimo").value) > 36
          || parseInt(this.apiForm.getField("plazoMaximo").value) > 36){
          this.apiForm.message({
            codigo: 4,
            message: "Debe ingresar un plazo mínimo y máximo correctos"
          });
          
          return false;          
        }
      }

      if(this.list[2].codigo == this.apiForm.getField("tipo").value){
        if(this.apiForm.getField("plazoTotal").value == ""
         || this.apiForm.getField("plazoTotal").value == null
         || parseInt(this.apiForm.getField("plazoTotal").value) == 0
         || parseInt(this.apiForm.getField("plazoTotal").value) > 36){
          this.apiForm.message({
            codigo: 4,
            message: "Debe ingresar un plazo correcto"
          });

          return false;
        }
      }
    }

    return true;
  }

  onChangeSelected(event:any):void{
    this.enablePlazos(event.value);
  }

  enablePlazos(value:any):void{    
    if(value == 1){      
      this.apiForm.getField("plazoMinimo").value = "";
      this.apiForm.getField("plazoMaximo").value = "";
      this.apiForm.getField("plazoTotal").value = "";
      
      this.apiForm.getField("plazoMinimo").markAsUntouched();
      this.apiForm.getField("plazoMaximo").markAsUntouched();
      this.apiForm.getField("plazoTotal").markAsUntouched();

      this.apiForm.getField("plazoMinimo").disable();
      this.apiForm.getField("plazoMaximo").disable();
      this.apiForm.getField("plazoTotal").disable();
    }else if(value == 2){      
      this.apiForm.getField("plazoTotal").value = "";
      this.apiForm.getField("plazoTotal").markAsUntouched();

      this.apiForm.getField("plazoMinimo").enable();
      this.apiForm.getField("plazoMaximo").enable();
      this.apiForm.getField("plazoTotal").disable();
    }else if(value == 3){      
      this.apiForm.getField("plazoMinimo").value = "";
      this.apiForm.getField("plazoMaximo").value = "";
      
      this.apiForm.getField("plazoMinimo").markAsUntouched();
      this.apiForm.getField("plazoMaximo").markAsUntouched();

      this.apiForm.getField("plazoMinimo").disable();
      this.apiForm.getField("plazoMaximo").disable();
      this.apiForm.getField("plazoTotal").enable();
    }
  }
}