import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../../../utils/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MantenimientoReglaVencimientoService } from '../../../../service-layer/mantenimiento/regla-vencimiento/mantenimiento-regla-vencimiento.service';
import { MantenimientoReglaVencimientoModel } from '../../../../model-layer/mantenimiento/regla-vencimiento/mantenimiento-regla-vencimiento.model';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ApiForm } from "../../../../utils-layer/api-form/api-form";
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
import { MantenimientoParametroService } from 'src/app/service-layer/mantenimiento/parametro/mantenimiento-parametro.service';
import { HttpClient } from '@angular/common/http';
import { MantenimientoParametroModel } from 'src/app/model-layer/mantenimiento/parametro/mantenimiento-parametro.model';

@Component({
  selector: 'app-mantenimiento-regla-vencimiento-form',
  templateUrl: './mantenimiento-regla-vencimiento-form.component.html',
  styleUrls: ['./mantenimiento-regla-vencimiento-form.component.css']
})
export class MantenimientoReglaVencimientoFormComponent implements OnInit {
  apiForm: ApiForm;
  apiFormParametro: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;
  errorMatcher = new CrossFieldErrorMatcher();

  tiposCliente: any;
  tiposMovimiento: any;
  periodos:any;

  constructor(
    public dialogRef: MatDialogRef<MantenimientoReglaVencimientoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private _service: MantenimientoReglaVencimientoService,
    private router: Router,
    private route: ActivatedRoute,
    private _http:HttpClient
  ) { 
    this.apiValidator = new ApiValidator();
    
    this.apiForm = new ApiForm();
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;    
    this.apiForm.datepipe = this.datepipe;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new MantenimientoReglaVencimientoModel();
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";

    this.apiForm.fields = (this.data.isEdit ? {
      periodo: ['', [Validators.required]]
    } : {    
      tipoCliente: ['', [Validators.required]],
      tipoMovimiento: ['', [Validators.required]],
      periodo: ['', [Validators.required]]
    });
    this.apiForm.mapping = (this.data.isEdit ? {
      periodo: "periodo"
    } : {
      tipoCliente: "codigoTipoCliente",
      tipoMovimiento: "codigoMovimiento",
      periodo: "periodo"
    });
    this.apiForm.mappingToForm = () => {
      if(! this.data.isEdit){
        this.apiForm.model.codigoTipoClienteCrm = ((this.apiForm.model.codigoTipoCliente == null || this.apiForm.model.codigoTipoCliente == "") ? "" : this.apiForm.model.codigoTipoCliente);
      }
      this.apiForm.model.estado = ((this.apiForm.model.estado == null || this.apiForm.model.estado == "") ? "1" : this.apiForm.model.estado);
      this.apiForm.model.cantidadMeses = 12;
      this.apiForm.model.inicio = 1;
    }
    this.apiForm.mappingToModel = () => {
      if(! this.data.isEdit){
        this.apiForm.model.codigoTipoClienteCrm = ((this.apiForm.model.codigoTipoCliente == null || this.apiForm.model.codigoTipoCliente == "") ? "" : this.apiForm.model.codigoTipoCliente);
      }
      this.apiForm.model.estado = ((this.apiForm.model.estado == null || this.apiForm.model.estado == "") ? "1" : this.apiForm.model.estado);
      this.apiForm.model.cantidadMeses = 12;
      this.apiForm.model.inicio = 1;
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
      
      if (this.data.isEdit) {
        this.apiFormParametro.service.filterObj = new MantenimientoParametroModel();
        this.apiFormParametro.service.filterObj.filtroTabla = "'parametro'";
        this.apiFormParametro.service.filterObj.filtroParametro = "'90001'";
        this.apiFormParametro.service.filterObj.columnaNombre = "DESCRIPCION";
        this.apiFormParametro.service.filterObj.columnaOrden = "asc";

        this.apiFormParametro.consume("filterMasiva", {}, (data:any) => {
          this.periodos = data.listaParametro.filter((x:any) => x.tabla == "parametro");
          
          this._service.filterObj.codigoTipoCliente = this.data.codigoTipoCliente;
          this._service.filterObj.codigoMovimiento = this.data.codigoMovimiento;
          this.apiForm.consume("findById", {}, (data:any) => {
            this.apiForm.message("obtener");        
            this.apiForm.model = data.reglaVencimiento;
            
            this.apiForm.mappingToForm();
            this.apiForm.toForm();   

            this.apiLoading.close();   
          });
        });
      }else{
        this.apiFormParametro.service.filterObj = new MantenimientoParametroModel();
        this.apiFormParametro.service.filterObj.filtroTabla = "'parametro', 'tipocliente'";
        this.apiFormParametro.service.filterObj.filtroParametro = "'90001'";
        this.apiFormParametro.service.filterObj.columnaNombre = "DESCRIPCION";
        this.apiFormParametro.service.filterObj.columnaOrden = "asc";

        this.apiFormParametro.consume("filterMasiva", {}, (data:any) => {
          this.periodos = data.listaParametro.filter((x:any) => x.tabla == "parametro");
          this.tiposCliente = data.listaParametro.filter((x:any) => x.tabla == "tipocliente");
                    
          if(this.tiposCliente != null){
            if(this.data.codigoTipoCliente != null){
              this.apiForm.getField("tipoCliente").value = this.data.codigoTipoCliente;
            }else{
              this.apiForm.getField("tipoCliente").value = this.tiposCliente[0].codigo;
            }
  
            this.apiLoading.close();
            this.onChangeSelected(null);
          }else{
            this.apiLoading.close();
          }
        });
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
      
              this.apiForm.model.codigoMovimiento = this.data.codigoMovimiento;
              this.apiForm.model.codigoTipoCliente = this.data.codigoTipoCliente;
              this.apiForm.model.codigoTipoClienteCrm = this.data.codigoTipoCliente;
              this.apiForm.model.estado = "1";

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

              this.apiForm.model.estado = "1";
              
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

  onChangeSelected(e:any):void{
    this.apiLoading.loadCallback = (() => {    
      this.apiFormParametro.service.filterObj = new MantenimientoParametroModel();
      this.apiFormParametro.service.filterObj.filtroTabla = "'tipomovimientosinasignar'";
      this.apiFormParametro.service.filterObj.filtroTipoMovimientoSinAsignar = "'" + this.apiForm.getField("tipoCliente").value + "'";
      this.apiFormParametro.service.filterObj.columnaNombre = "CODIGO";
      this.apiFormParametro.service.filterObj.columnaOrden = "asc";

      this.apiFormParametro.consume("filterMasiva", {}, (data:any) => {
        if (data) {
          this.tiposMovimiento = data.listaParametro.filter((x:any) => x.tabla == "tipomovimientosinasignar");
          if(this.tiposMovimiento != null){
            if(this.data.isEdit){
              this.apiForm.getField("tipoMovimiento").value = this.data.codigoMovimiento;
            }else{
              this.apiForm.getField("tipoMovimiento").value = this.tiposMovimiento[0].codigo;
            }
          }
        }
        this.apiLoading.close();
      });      
    });
    this.apiLoading.show();
  }
}
