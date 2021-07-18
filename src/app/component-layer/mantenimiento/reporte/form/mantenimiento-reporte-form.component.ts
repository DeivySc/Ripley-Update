import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../../../utils/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MantenimientoReporteService } from '../../../../service-layer/mantenimiento/reporte/mantenimiento-reporte.service';
import { MantenimientoReporteModel } from '../../../../model-layer/mantenimiento/reporte/mantenimiento-reporte.model';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ApiForm } from "../../../../utils-layer/api-form/api-form";
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'app-mantenimiento-reporte-form',
  templateUrl: './mantenimiento-reporte-form.component.html',
  styleUrls: ['./mantenimiento-reporte-form.component.css']
})
export class MantenimientoReporteFormComponent implements OnInit {
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;
  errorMatcher = new CrossFieldErrorMatcher();

  tiposCliente: any;
  tiposVencimiento: any;

  constructor(
    public dialogRef: MatDialogRef<MantenimientoReporteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private _service: MantenimientoReporteService,
    private _http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.apiValidator = new ApiValidator();
    
    this.apiForm = new ApiForm();
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;    
    this.apiForm.datepipe = this.datepipe;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new MantenimientoReporteModel();
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";

    this.apiForm.fields = {    
      codigo: [''],
      descripcion: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["text"]))]]
    };
    this.apiForm.mapping = {
      codigo: "codigo",
      descripcion: "descripcion"
    };    
    this.apiForm.mappingToForm = () => {
      this.apiForm.model.estado = ((this.apiForm.model.estado == null || this.apiForm.model.estado == "") ? "1" : this.apiForm.model.estado);
    }
    this.apiForm.mappingToModel = () => {
      if(! this.data.isEdit){
        this.apiForm.model.codigo = "";
      }
      this.apiForm.model.estado = ((this.apiForm.model.estado == null || this.apiForm.model.estado == "") ? "1" : this.apiForm.model.estado);
    }
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }


  ngOnInit(): void {
    this.apiForm.build();
    this.apiForm.getField("codigo").disable();
    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      if (this.data.isEdit) {
        this.apiForm.consume("findById", this.data.codigo, (data:any) => {
          this.apiForm.message("obtener");
          this.apiForm.model = data.reporte;
          
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
                console.log(data);
                if (data.codigo != 0) {
                  this.apiForm.message(data);
                }else{
                  this.apiForm.message("actualizar");

                  this.data.isExist = true;
                  this.closeDialog(this.data.isExist);
                }
                
                this.apiLoading.close();
              });
            }else{
              this.apiForm.toModel();
              this.apiForm.mappingToModel();
              
              this.apiForm.consume("save", this.apiForm.model, (data:any) => {
                console.log(data);
                if (data.codigo != 0) {
                  this.apiForm.message(data);
                }else{
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

  close(): void {
    this.dialogRef.close();
  }

  closeDialog(value?: any) {
    this.dialogRef.close({ event: value });
  }
}
