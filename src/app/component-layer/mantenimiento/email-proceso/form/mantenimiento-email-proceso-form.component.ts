import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../../../utils/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MantenimientoEmailProcesoService } from '../../../../service-layer/mantenimiento/email-proceso/mantenimiento-email-proceso.service';
import { MantenimientoEmailProcesoModel } from '../../../../model-layer/mantenimiento/email-proceso/mantenimiento-email-proceso.model';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ApiForm } from "../../../../utils-layer/api-form/api-form";
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { MantenimientoParametroService } from 'src/app/service-layer/mantenimiento/parametro/mantenimiento-parametro.service';
import { HttpClient } from '@angular/common/http';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'app-mantenimiento-email-proceso-form',
  templateUrl: './mantenimiento-email-proceso-form.component.html',
  styleUrls: ['./mantenimiento-email-proceso-form.component.css']
})
export class MantenimientoEmailProcesoFormComponent implements OnInit {
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiFormParametro: ApiForm;
  apiLoading: ApiLoading;

  isExist: boolean = null;
  errorMatcher = new CrossFieldErrorMatcher();

  tiposEnvio: any;
  tiposProceso: any;
  tipoProceso: any;

  constructor(
    public dialogRef: MatDialogRef<MantenimientoEmailProcesoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private _service: MantenimientoEmailProcesoService,
    private router: Router,
    private route: ActivatedRoute,
    private _http: HttpClient
  ) { 
    this.apiValidator = new ApiValidator();
    
    this.apiForm = new ApiForm();
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;    
    this.apiForm.datepipe = this.datepipe;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new MantenimientoEmailProcesoModel();
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";

    this.apiForm.fields = (this.data.isEdit ? {    
      tipoProceso: [''],
      tipoEnvio: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["email"]))]],
      nombreUsuario: ['', [Validators.required,Validators.pattern(this.apiValidator.regularExpression(["text"]))]]
    } : {    
      tipoProceso: ['', [Validators.required]],
      tipoEnvio: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["email"]))]],
      nombreUsuario: ['', [Validators.required,Validators.pattern(this.apiValidator.regularExpression(["text"]))]]
    });
    this.apiForm.mapping = {
      tipoProceso: "codigoProceso",
      tipoEnvio: "tipoEnvio",
      email: "email",
      nombreUsuario: "nombreUsuario"
    };
    this.apiForm.mappingToForm = () => {
      this.apiForm.model.estado = ((this.apiForm.model.estado == null || this.apiForm.model.estado == "") ? "1" : this.apiForm.model.estado);
    }
    this.apiForm.mappingToModel = () => {
      this.apiForm.model.estado = ((this.apiForm.model.estado == null || this.apiForm.model.estado == "") ? "1" : this.apiForm.model.estado);
      if(this.data.isEdit){
        this.apiForm.model.codigoProceso = this.tipoProceso;
      }
    }
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }


  ngOnInit(): void {
    this.apiForm.build();      
    
    if (this.data.isEdit) {
      this.apiForm.getField("tipoProceso").disable();
    }
   
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      this.apiFormParametro = new ApiForm();
      this.apiFormParametro.service = new MantenimientoParametroService(this._http);    
      this.apiFormParametro.service.filterObj.estado = "1";
      this.apiFormParametro.service.filterObj.padre = "90003";
      this.apiFormParametro.errorCallback = ((data:any) => { this.apiLoading.error(data); });

      this.apiFormParametro.consume("filterParent", {}, (data:any) => {
        this.tiposEnvio = data.listaParametro;

        this.apiForm.errorCallback = ((data:any) => { this.apiLoading.error(data); });
        this.apiForm.consume("findAllProcesos", {}, (data:any) => {
          this.tiposProceso = data.listaProceso;
          if (this.data.isEdit) {
            this.apiForm.consume("findById", this.data.id, (data:any) => {
              this.apiForm.message("obtener");        
              this.apiForm.model = data.envioMail;
              this.tipoProceso = this.apiForm.model.codigoProceso;
              
              this.apiForm.mappingToForm();
              this.apiForm.toForm();
              
              this.apiLoading.close();
            });
          }else{
            this.apiForm.getField('tipoProceso').value = this.data.tipoProceso;
            
            this.apiLoading.close();
          }  
        });
      });
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
      
              this.apiForm.model.id = this.data.id;
              this.apiForm.model.usrMod = "SRP";

              this.apiForm.consume("update", this.apiForm.model, (data:any) => {               
                console.log(data);
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
