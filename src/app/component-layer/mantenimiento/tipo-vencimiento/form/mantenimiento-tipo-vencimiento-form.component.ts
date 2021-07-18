import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../../../utils/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MantenimientoTipoVencimientoService } from '../../../../service-layer/mantenimiento/tipo-vencimiento/mantenimiento-tipo-vencimiento.service';
import { MantenimientoTipoVencimientoModel } from '../../../../model-layer/mantenimiento/tipo-vencimiento/mantenimiento-tipo-vencimiento.model';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ApiForm } from "../../../../utils-layer/api-form/api-form";
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MantenimientoTipoClienteService } from 'src/app/service-layer/mantenimiento/tipo-cliente/mantenimiento-tipo-cliente.service';
import { HttpClient } from '@angular/common/http';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { MantenimientoParametroService } from 'src/app/service-layer/mantenimiento/parametro/mantenimiento-parametro.service';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'app-mantenimiento-tipo-vencimiento-form',
  templateUrl: './mantenimiento-tipo-vencimiento-form.component.html',
  styleUrls: ['./mantenimiento-tipo-vencimiento-form.component.css']
})
export class MantenimientoTipoVencimientoFormComponent implements OnInit {
  apiForm: ApiForm;
  apiFormParametro: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;
  errorMatcher = new CrossFieldErrorMatcher();

  tiposCliente: any;
  tiposVencimiento: any;
  modosVigencia: any;

  constructor(
    public dialogRef: MatDialogRef<MantenimientoTipoVencimientoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private _service: MantenimientoTipoVencimientoService,
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
    this.apiForm.model = new MantenimientoTipoVencimientoModel();
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";
  
    this.apiForm.fields = {      
      tipoCliente: ['', Validators.required],
      tipoVencimiento: ['', Validators.required],
      modoVigencia: ['', Validators.required],
      mesesInactividad: ['', [Validators.required, Validators.min(1), Validators.max(99), Validators.pattern(this.apiValidator.regularExpression(["number"]))]],
    };
    this.apiForm.mapping = {
      tipoCliente: "codigoTipoCliente",
      tipoVencimiento: "codigoTipoVencimiento",
      modoVigencia: "modoVigencia",
      mesesInactividad: "mesesInactividad"
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

    this.apiLoading.errorCallback = (() => {
      this.close();
    });
    
    this.apiLoading.loadCallback = (() => {
      this.apiFormParametro = new ApiForm();
      this.apiFormParametro.service = new MantenimientoParametroService(this._http);    
      this.apiFormParametro.service.filterObj.estado = "1";
      this.apiFormParametro.service.filterObj.padre = "90004";
      this.apiFormParametro.errorCallback = ((data:any) => { this.apiLoading.error(data); });

      this.apiFormParametro.consume("filterParent", {}, (data:any) => {
        this.modosVigencia = data.listaParametro;
        this.apiForm.service.filterObj.estado = "1";

        this.apiForm.errorCallback = ((data:any) => { this.apiLoading.error(data); });
        this.apiForm.consume("findAllTipoCliente", {}, (data:any) => {
          this.tiposCliente = data.listaTipoCliente;

          this.apiForm.service.filterObj.estado = "1";
          this.apiForm.consume("findAllTipoVencimiento", {}, (data:any) => {
            this.tiposVencimiento = data.listaTipoVencimiento;

            if (this.data.isEdit) {
              this.apiForm.getField("tipoCliente").disable();
              this.apiForm.getField("tipoVencimiento").disable();
              
              this.apiForm.consume("findById", this.data.codigoTipoVencimientoTipoCliente, (data:any) => {
                this.apiForm.message("obtener");
                this.apiForm.model = data.tipoVencimientoTipoCliente;
                
                this.apiForm.mappingToForm();
                this.apiForm.toForm();

                this.apiLoading.close();
              });
            }else{
              this.apiLoading.close();
            }
          });
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
        
                this.apiForm.model.codigoTipoVencimientoTipoCliente = this.data.codigoTipoVencimientoTipoCliente;
                this.apiForm.model.codigoTipoVencimiento = this.data.codigoTipoVencimiento;
                this.apiForm.model.codigoTipoCliente = this.data.codigoTipoCliente;
                this.apiForm.model.codigo = this.data.codigoTipoVencimientoTipoCliente;

                this.apiForm.consume("update", this.apiForm.model, (data:any) => {
                  console.log(data);
                  if (data.codigo != 0) {
                    this.apiForm.message(data);
                  }else{
                    this.apiForm.message("actualiza");

                    this.data.isExist = true;
                    this.close(this.data.isExist);    
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
                  this.close(this.data.isExist);
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
  
  close(value?: any) {
    this.dialogRef.close({ event: value });
  }
}
