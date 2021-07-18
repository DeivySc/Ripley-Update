import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../../../utils/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MantenimientoTipoClienteService } from '../../../../service-layer/mantenimiento/tipo-cliente/mantenimiento-tipo-cliente.service';
import { MantenimientoTipoClienteModel } from '../../../../model-layer/mantenimiento/tipo-cliente/mantenimiento-tipo-cliente.model';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ApiForm } from "../../../../utils-layer/api-form/api-form";
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'app-mantenimiento-tipo-cliente-form',
  templateUrl: './mantenimiento-tipo-cliente-form.component.html',
  styleUrls: ['./mantenimiento-tipo-cliente-form.component.css']
})
export class MantenimientoTipoClienteFormComponent implements OnInit {
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;
  errorMatcher = new CrossFieldErrorMatcher();

  groups: any;

  constructor(
    public dialogRef: MatDialogRef<MantenimientoTipoClienteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private _service: MantenimientoTipoClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.apiValidator = new ApiValidator();
    
    this.apiForm = new ApiForm();
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;    
    this.apiForm.datepipe = this.datepipe;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new MantenimientoTipoClienteModel();
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";

    this.route.paramMap.subscribe(params => {
      if(params["params"]["id"] != null){
        this._service.sharedData = params["params"]["id"];
        this._service.isEditing = true;

        this.data.isEdit = true;
        this.data.id = params["params"]["id"];
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
      if (this._service.isEditing) {
        this.apiForm.consume("findById", this._service.sharedData, (data:any) => {
          this.apiForm.message("obtener");
          this.apiForm.model = data.tipoCliente;
          
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
      
              this.apiForm.model.codigo = this._service.sharedData;
              this.apiForm.consume("update", this.apiForm.model, (data:any) => {
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
