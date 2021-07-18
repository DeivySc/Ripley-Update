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
  selector: 'app-mantenimiento-reporte-columna',
  templateUrl: './mantenimiento-reporte-columna.component.html',
  styleUrls: ['./mantenimiento-reporte-columna.component.css']
})
export class MantenimientoReporteColumnaComponent implements OnInit {
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;
  errorMatcher = new CrossFieldErrorMatcher();

  tiposCliente: any;
  tiposVencimiento: any;

  constructor(
    public dialogRef: MatDialogRef<MantenimientoReporteColumnaComponent>,
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
      descripcionReporte: [''],
      codigo: [''],
      descripcion: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["text"]))]]
    };
    this.apiForm.mapping = {
      descripcionReporte: "descripcionReporte",
      codigo: "codigo",
      descripcion: "descripcion"
    };    
    this.apiForm.mappingToForm = () => {
      this.apiForm.model.descripcion = this.apiForm.model.descripcionReporteColumna;
      this.apiForm.model.estado = ((this.apiForm.model.estado == null || this.apiForm.model.estado == "") ? "1" : this.apiForm.model.estado);
    }
    this.apiForm.mappingToModel = () => {
      if(! this.data.isEdit){
        this.apiForm.model.codigo = "";
      }
      this.apiForm.model.codigoReporte = this.data.codigoReporte;
      this.apiForm.model.estado = ((this.apiForm.model.estado == null || this.apiForm.model.estado == "") ? "1" : this.apiForm.model.estado);
    }
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }


  ngOnInit(): void {
    this.apiForm.build();
    this.apiForm.getField("descripcionReporte").value = this.data.descripcionReporte;
    this.apiForm.getField("descripcionReporte").disable();
    this.apiForm.getField("codigo").disable();
    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      if (this.data.isEdit) {
        this.apiForm.consume("findByIdColumna", {
          codigoReporte: this.data.codigoReporte,
          codigoColumna: this.data.codigoColumna
        }, (data:any) => {
          this.apiForm.message("obtener");
          this.apiForm.model = data.reporteColumna;
          
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
      if(this.data.isEdit){
        this.apiForm.toModel();
        this.apiForm.mappingToModel();

        this.apiForm.model.codigoColumna = this.data.codigoColumna;
        this.apiForm.model.codigoReporte = this.data.codigoReporte;

        this.apiForm.consume("updateColumna", this.apiForm.model, (data:any) => {
          this.apiForm.message(data);
          if (data.codigo == 0) {
            this.data.isExist = true;
            this.closeDialog(this.data.isExist);
          }
        });
      }else{
        this.apiForm.toModel();
        this.apiForm.mappingToModel();

        this.apiForm.model.codigoReporte = this.data.codigoReporte;
        this.apiForm.consume("saveColumna", this.apiForm.model, (data:any) => {
          if (data.codigo == 1 || data.codigo == 2 || data.codigo == 3) {
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

  close(): void {
    this.dialogRef.close();
  }

  closeDialog(value?: any) {
    this.dialogRef.close({ event: value });
  }
}
