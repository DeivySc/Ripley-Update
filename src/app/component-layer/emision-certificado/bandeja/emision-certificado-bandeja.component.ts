import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HeaderService } from '../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { EmisionCertificadoService } from 'src/app/service-layer/emision-certificado/emision-certificado.service';
import { MantenimientoParametroService } from '../../../service-layer/mantenimiento/parametro/mantenimiento-parametro.service';
import { ApiTable } from "src/app/utils-layer/api-table/api-table";
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { EmisionCertificadoModel } from 'src/app/model-layer/emision-certificado/emision-certificado.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptObjects } from 'src/app/shared/util/encryptObjects';
import { ApiValidator, optionalValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
import { EmisionCertificadoVistaPreviaComponent } from 'src/app/component-layer/emision-certificado/vista-previa/emision-certificado-vista-previa.component';
import { SrpEncryption } from 'src/app/shared/util/srpEncyption';
import { SrpFileManager } from 'src/app/shared/util/fileExport';
import { MatSelectChange } from '@angular/material/select';
import { ModalErrorVistaPreviaComponent } from '../modal-error/modal-error-vista-previa.component';
import { MantenimientoParametroModel } from 'src/app/model-layer/mantenimiento/parametro/mantenimiento-parametro.model';


@Component({
  selector: 'app-emision-certificado-bandeja',
  templateUrl: './emision-certificado-bandeja.component.html',
  styleUrls: ['./emision-certificado-bandeja.component.css']
})
export class EmisionCertificadoBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiFormParametro: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  title: string;

  isExist: boolean = null;
  isAlternative: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  cliente: any;
  sucursales: any;
  establecimientos: any;
  valorados: any;
  showData: boolean = false;

  tipoTarjetas: any;

  constructor(
    private _header: HeaderService,
    private _service: EmisionCertificadoService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private _http: HttpClient,
    private router: Router,
    private encryptObjects: EncryptObjects,
    private route: ActivatedRoute,
    private srpEncryption: SrpEncryption,
    private srpFileManager: SrpFileManager,
    public dialogRef: MatDialogRef<EmisionCertificadoBandejaComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.apiValidator = new ApiValidator();
    this.list = new ApiTable();

    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new EmisionCertificadoModel();
    this.apiForm.fields = {
      sucursal: ['', [Validators.required]],
      puntosDescuento: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["number"], 8)), Validators.min(1), Validators.max(99999999)]],
      establecimiento: ['', [Validators.required]],
      observacion: ['', [Validators.required]],
      valorado: ['', [Validators.required]],
      tipoTarjeta: ['', [Validators.required]]
    };
    this.apiForm.mapping = {
      valorado: "valorado",
      sucursal: "sucursal",
      puntosDescuento: "puntosDescuento",
      establecimiento: "establecimiento",
      tipoTarjeta: "tipoTarjeta",
      observacion: "observacion"
    };
    this.apiForm.mappingToForm = () => {
    };
    this.apiForm.mappingToModel = () => {      
    };

    this.apiForm.build();
    
    this.apiFormParametro = new ApiForm();
    this.apiFormParametro.service = new MantenimientoParametroService(this._http);    
      
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }

  ngOnInit(): void {    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {      
      this.apiFormParametro.service.filterObj = new MantenimientoParametroModel();
      this.apiFormParametro.service.filterObj.filtroTabla = "'establecimientoreglavigente', 'tipotarjetacliente'";
      this.apiFormParametro.service.filterObj.filtroTipoTarjetaCliente = "'" + this.data.codigo + "'";
      this.apiFormParametro.service.filterObj.columnaNombre = "DESCRIPCION";
      this.apiFormParametro.service.filterObj.columnaOrden = "asc";

      this.apiFormParametro.consume("filterMasiva", {}, (data:any) => {
        this.establecimientos = data.listaParametro.filter((x:any) => x.tabla == "establecimientoreglavigente");
        this.tipoTarjetas = data.listaParametro.filter((x:any) => x.tabla == "tipotarjetacliente");

        if(this.establecimientos != null){
          this.apiForm.getField('establecimiento').setValue(this.establecimientos[0].id);
        }

        if(this.tipoTarjetas != null){
          this.apiForm.getField('tipoTarjeta').setValue(this.tipoTarjetas[0].id);
        }

        this.apiLoading.close();
        this.fillValorado(this.establecimientos[0].id);
      });
    });   
        
    this.apiLoading.show();
  }

  fillValorado(codigoEstablecimiento: string){
    this.apiLoading.loadCallback = (() => {    
      this.apiFormParametro.service.filterObj = new MantenimientoParametroModel();  
      this.apiFormParametro.service.filterObj.filtroTabla = "'valoradoreglavigente'";
      this.apiFormParametro.service.filterObj.filtroValoradoReglaVigente = "'" + codigoEstablecimiento + "'";
      this.apiFormParametro.service.filterObj.columnaNombre = "DESCRIPCION";
      this.apiFormParametro.service.filterObj.columnaOrden = "asc";

      this.apiFormParametro.consume("filterMasiva", {}, (data:any) => {
        this.apiLoading.close();
        if(data != null){
          this.valorados = data.listaParametro.filter((x:any) => x.tabla == "valoradoreglavigente");

          if(this.valorados != null && this.valorados.length > 0){
            this.apiForm.getField("valorado").setValue(this.valorados[0].id);
            this.resetPuntajeMinimo(null);
            
            this.fillSucursal(this.valorados[0].id);
          }else{
            this.apiForm.getField("valorado").reset();
            this.apiForm.getField("sucursal").reset();
            this.sucursales = null;
          }
        }
      });
    });   
        
    this.apiLoading.show();
  }

  fillSucursal(codigoValorado: string){
    this.apiLoading.loadCallback = (() => {    
      this.apiFormParametro.service.filterObj = new MantenimientoParametroModel();  
      this.apiFormParametro.service.filterObj.filtroTabla = "'sucursalreglavigente'";
      this.apiFormParametro.service.filterObj.filtroSucursalReglaVigente = "'" + codigoValorado + "'";
      this.apiFormParametro.service.filterObj.columnaNombre = "DESCRIPCION";
      this.apiFormParametro.service.filterObj.columnaOrden = "asc";

      this.apiFormParametro.consume("filterMasiva", {}, (data:any) => {
        if(data != null){
          this.sucursales = data.listaParametro.filter((x:any) => x.tabla == "sucursalreglavigente");

          if(this.valorados != null && this.valorados.length > 0){
            this.apiForm.getField("sucursal").setValue(this.sucursales[0].id);
          }
        }
        this.apiLoading.close();
      });
    });   
        
    this.apiLoading.show();
  }

  emitir(){
    if(this.validate()){
      this.apiLoading.loadCallback = (() => {
        this.apiForm.toModel();
        this.apiForm.mappingToModel();
        this.apiForm.model.codigo = this.data.codigo;
        this.apiForm.model.descripcionSucursal = this.sucursales.find((x:any) => x.id = this.apiForm.model.sucursal).descripcion;
        this.apiForm.model.descValorado = this.valorados.find((x:any) => x.id = this.apiForm.model.valorado).descripcion;
        this.apiForm.model.factor = this.valorados.find((x:any) => x.id = this.apiForm.model.valorado).comentario;

        this.apiForm.consume("certificadoEmitir", this.apiForm.model, (data:any) => {
          if(data.codigoCertificado  != null){
            this.apiForm.model.nroDocumento = this.srpEncryption.encryptText(this.data.numeroDocumento);
            this.apiForm.model.nroCuenta = this.srpEncryption.encryptText(this.data.numeroCuenta);
            this.apiForm.model.puntos = this.apiForm.model.puntosDescuento;
            this.apiForm.model.valorado = this.apiForm.model.descValorado;
            this.apiForm.model.codigoCertificado = data.codigoCertificado;
            this.apiForm.model.valorCertificado = data.valorCertificado;
            this.apiForm.model.cliente = this.data.nombres +' '+ this.data.apellidoPaterno+' '+this.data.apellidoMaterno;

            console.log(this.apiForm.model);
            this.apiForm.consume("certificadoEmitirPDF", this.apiForm.model, (data:any) => {
              console.log(data);
              if(data != null){
                this.srpFileManager.downloadFileFromBase64(data.statusResponseBody);
                this.apiForm.message({
                  codigo: 4,
                  message: 'El certificado ha sido emitido correctamente'
                });

                this.closeDialog(true);
              }
              this.apiLoading.close();
            });
          }else{
            this.apiForm.message({
              codigo: 4,
              message: data.mensaje
            });
            this.close();   
            this.apiLoading.close();    
          }
        });    
      });

      this.apiLoading.show(true);
    }
  }

  vistaPrevia() {
    if(this.validate()){
      this.apiForm.toModel();
      this.apiForm.mappingToModel();
      
      this.apiForm.model.codigo = this.data.codigo;

      this.apiForm.model.nroCuenta = this.data.numeroCuenta;
      this.apiForm.model.nroDocumento = this.data.numeroDocumento;
      this.apiForm.model.cliente = this.data.nombres +' '+ this.data.apellidoPaterno+' '+this.data.apellidoMaterno;
      
      this.apiForm.model.descripcionSucursal = this.sucursales.find((x:any) => x.id = this.apiForm.model.sucursal).descripcion;
      this.apiForm.model.descripcionEstablecmiento = this.establecimientos.find((x:any) => x.id = this.apiForm.model.establecimiento).descripcion;
      this.apiForm.model.descValorado = this.apiForm.model.descripcionValorado = this.valorados.find((x:any) => x.id = this.apiForm.model.valorado).descripcion;

      this.apiForm.model.producto = this.apiForm.model.valorado;
      this.apiForm.model.puntos = this.apiForm.model.puntosDescuento;
      
      const dialogRef = this.dialog.open(EmisionCertificadoVistaPreviaComponent, {
        width: '500px',
        height: '640px',
        data: {
          jsonVistaPrevia: this.apiForm.model,
          param: this.apiForm.model
        },
        panelClass: '',
        disableClose: true,
        autoFocus: true
      });

      dialogRef.afterClosed().subscribe(result => {     
      });
    }
  }

  validate():boolean{
    this.apiForm.toModel();

    let puntajeMinimo = this.valorados.find((x:any) => x.id = this.apiForm.model.valorado).codigo;
    if(puntajeMinimo != null){
      if(parseInt(this.apiForm.model.puntosDescuento) < parseInt(puntajeMinimo)){
        this.apiForm.message({
          codigo: 4,
          message: 'Debe corregir los puntos, el puntaje mínimo es de ' + puntajeMinimo + ' para este valorado'
        });      
        return false;
      }      
    }else{
      this.apiForm.message({
        codigo: 4,
        message: 'Debe corregir la configuración de reglas para este valorado'
      });      
      return false;
    }

    return true;
  }

  selectedValueEstablecimiento(event: MatSelectChange) {
    this.fillValorado(event.value);
  }

  selectedValueValorado(event: any) {
    if(event.value != null && event.value != ""){
      this.resetPuntajeMinimo(event.value);
      this.fillSucursal(event.value);
    }
  }

  resetPuntajeMinimo(_valorado: any):void{
    if(_valorado == null){
      _valorado = this.apiForm.getField("valorado").value;
    }
    if(this.valorados != null && this.valorados.length > 0){
      let puntajeMinimoPropuesto = this.valorados.find((x:any) => x.id = _valorado).codigo;
      let puntosDescuento = this.apiForm.getField('puntosDescuento').value;

      if(puntosDescuento == null || puntosDescuento == ""){
        this.apiForm.getField('puntosDescuento').setValue(puntajeMinimoPropuesto);
      }else{
        if(parseInt(puntosDescuento) < parseInt(puntajeMinimoPropuesto)){
          this.apiForm.getField('puntosDescuento').setValue(puntajeMinimoPropuesto);
        }
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  closeDialog(value?: any) {
    this.dialogRef.close({ event: value });
  }
}