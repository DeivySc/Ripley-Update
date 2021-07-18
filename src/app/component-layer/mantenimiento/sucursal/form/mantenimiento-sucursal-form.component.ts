import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../../../../component-layer/utils/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MantenimientoSucursalService } from '../../../../service-layer/mantenimiento/sucursal/mantenimiento-sucursal.service';
import { MantenimientoSucursalModel } from '../../../../model-layer/mantenimiento/sucursal/mantenimiento-sucursal.model';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ApiForm } from "../../../../utils-layer/api-form/api-form";
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiValidator, optionalValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'mantenimiento-sucursal-form',
  templateUrl: './mantenimiento-sucursal-form.component.html',
  styleUrls: ['./mantenimiento-sucursal-form.component.css']
})
export class MantenimientoSucursalFormComponent implements OnInit {
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    public dialogRef: MatDialogRef<MantenimientoSucursalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private _service: MantenimientoSucursalService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.apiValidator = new ApiValidator();
    
    this.apiForm = new ApiForm();
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;    
    this.apiForm.datepipe = this.datepipe;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new MantenimientoSucursalModel();
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";

    this.apiForm.fields = this.data.isEdit ? {
      codigo: [''],
      descripcion: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["text"]))]],
      direccion: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["address"]))]],
      ruc: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(this.apiValidator.regularExpression(["number"]))]],
      ciudad: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["text"]))]],
      distrito: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["text"]))]],
      nombre: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["text"]))]],
      sucursalEquivalencia: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["number"])),Validators.min(1), Validators.max(9999999999)]],
      estado: ['']
    } :  {
      codigo: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["number"])), Validators.min(1), Validators.max(9999999999)]],
      descripcion: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["text"]))]],
      direccion: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["address"]))]],
      ruc: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(this.apiValidator.regularExpression(["number"]))]],
      ciudad: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["text"]))]],
      distrito: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["text"]))]],
      nombre: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["text"]))]],
      sucursalEquivalencia: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["number"])),Validators.min(1), Validators.max(9999999999)]],
      sucursalBase: ['', [optionalValidator([Validators.pattern(this.apiValidator.regularExpression(["number"])), Validators.min(1), Validators.max(9999999999)])]]
    };
    this.apiForm.mapping = (this.data.isEdit ? {
      codigo: "codigo",
      descripcion: "descripcion",
      direccion: "direccion",
      ruc: "ruc",
      ciudad: "ciudad",
      distrito: "distrito",
      nombre: "nombre",
      sucursalEquivalencia: "sucursalEquivalencia"
    } : {
      codigo: "codigo",
      descripcion: "descripcion",
      direccion: "direccion",
      ruc: "ruc",
      ciudad: "ciudad",
      distrito: "distrito",
      nombre: "nombre",
      sucursalEquivalencia: "sucursalEquivalencia",
      sucursalBase: "sucursalBase"
    });    
    this.apiForm.mappingToForm = () => {
      this.apiForm.model.estado = (this.apiForm.model.estado == null ? 1 : this.apiForm.model.estado);
    }
    this.apiForm.mappingToModel = () => {
      this.apiForm.model.estado = (this.apiForm.model.estado == null ? 1 : this.apiForm.model.estado);
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
          this.apiForm.model = data.sucursal;
          
          this.apiForm.mappingToForm();
          this.apiForm.toForm();

          this.apiLoading.close();
        });
      }else{
        this.apiLoading.close();
      }
    });
    
    this.apiLoading.show();
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
        this.apiLoading.loadCallback = (() => {   
          this.isExist = result.event.isExist;
          if (this.isExist) {
            if(this.data.isEdit){
              this.apiForm.toModel();
              this.apiForm.mappingToModel();
      
              this.apiForm.model.codigo = this.data.codigo;
              this.apiForm.consume("update", this.apiForm.model, (data:any) => {                
                if (data.codigo != 0) {
                  this.apiForm.message(data);
                }else{
                  this.data.isExist = true;
                  this.closeDialog(this.data.isExist);
                }
                this.apiLoading.close();
              });
            }else{          
              this.apiForm.toModel();
              this.apiForm.mappingToModel();
              
              this.apiForm.consume("save", this.apiForm.model, (data:any) => {                
                if (data.codigo != 0) {
                  this.apiForm.message(data);
                }else{
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

  close(): void {
    this.dialogRef.close();
  }

  closeDialog(value?: any) {
    this.dialogRef.close({ event: value });
  }
}
