import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ConsultaClienteService } from '../../../../service-layer/consulta/cliente/consulta-cliente.service';
import { MantenimientoParametroService } from '../../../../service-layer/mantenimiento/parametro/mantenimiento-parametro.service';
import { ConsultaClienteResumeComponent } from '../resume/consulta-cliente-resume.component';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { ConsultaClienteModel } from 'src/app/model-layer/consulta/cliente/consulta-cliente.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptObjects } from 'src/app/shared/util/encryptObjects';
import { ApiValidator, optionalValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
import { EmisionCertificadoBandejaComponent } from 'src/app/component-layer/emision-certificado/bandeja/emision-certificado-bandeja.component';
import { MantenimientoParametroModel } from 'src/app/model-layer/mantenimiento/parametro/mantenimiento-parametro.model';

@Component({
  selector: 'app-consulta-cliente-bandeja',
  templateUrl: './consulta-cliente-bandeja.component.html',
  styleUrls: ['./consulta-cliente-bandeja.component.css']
})
export class ConsultaClienteBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiFormParametro: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  title: string;

  isExist: boolean = null;
  isAlternative: boolean = null;
  isCertificate: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  tiposDocumento: any;
  
  constructor(
    private _header: HeaderService,
    private _service: ConsultaClienteService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private _http: HttpClient,
    private router: Router,
    private encryptObjects: EncryptObjects,
    private route: ActivatedRoute
  ) {
    
    this.route.data.subscribe(data => {
      this.isAlternative = data.isEdit;
      this.isCertificate = data.isCertificate ?? false;

      if(this.isCertificate){
        this.title = "Emisión de Certificados";
      }else{
        if(! this.isAlternative){
          this.title = "Consulta de Clientes";
        }else{
          this.title = "Actualización de Puntos";
        }
      }
    });

    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['numeroTarjeta', 'nombre', 'tipoDocumento', 'numeroDocumento', 'Puntos', 'estado', 'seleccionar'];
    this.list.service = this._service;
    this.list.method = "page";
    this.list.resultMap = {
      "source": "listConsultaClientes",
      "length": "totalRegistros"
    };
    this.list.sort = {
      "column": "codigo",
      "direction": "asc"
    }

    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new ConsultaClienteModel();
    this.apiForm.fields = {
      apellidoPaterno: [''],
      apellidoMaterno: [''],
      nombres: [''],
      tipoDocumento: [''],
      numeroDocumento: ['']
    };
    this.apiForm.build();
    
    this.apiFormParametro = new ApiForm();
    this.apiFormParametro.service = new MantenimientoParametroService(this._http);    
      
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }

  ngOnInit(): void {
    this._header.settingValues({ title: this.title });
    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      
      this.apiFormParametro.service.filterObj = new MantenimientoParametroModel();
      this.apiFormParametro.service.filterObj.filtroTabla = "'parametro'";
      this.apiFormParametro.service.filterObj.filtroParametro = "'11000'";
      this.apiFormParametro.service.filterObj.columnaNombre = "DESCRIPCION";
      this.apiFormParametro.service.filterObj.columnaOrden = "asc";

      this.apiFormParametro.consume("filterMasiva", {}, (data:any) => {
        this.tiposDocumento = data.listaParametro.filter((x:any) => x.tabla == "parametro" && x.codigo_padre == "11000");        
        this.apiLoading.close();
      });
    });
        
    this.apiLoading.show();
  }

  select(row:any) {
    const dialogRef = this.dialog.open(ConsultaClienteResumeComponent, {
      width: '85%',
      height: '85%',
      data: {
        isEdit: true,
        codigo: row.codigo,
        idSubproducto: row.idSubproducto,
        isAlternative: this.isAlternative,
        cliente: row,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result;
      if (this.isExist) {
        this.list.search();
      }
    });
  }

  search():void{
    if((this.apiForm.getField("tipoDocumento").value != "" && this.apiForm.getField("numeroDocumento").value != "")
      || this.apiForm.getField("apellidoPaterno").value != ""
      || this.apiForm.getField("apellidoMaterno").value != ""
      || this.apiForm.getField("nombres").value != ""
    ){
      this._service.filterObj.tipoDocumento = this.apiForm.getField("tipoDocumento").value;
      this._service.filterObj.numeroDocumento = this.apiForm.getField("numeroDocumento").value;
      this._service.filterObj.apellidoPaterno = this.apiForm.getField("apellidoPaterno").value;
      this._service.filterObj.apellidoMaterno = this.apiForm.getField("apellidoMaterno").value;
      this._service.filterObj.nombres = this.apiForm.getField("nombres").value;

      this.list.search();
    }else{
      if(this.apiForm.getField("tipoDocumento").value != "" || this.apiForm.getField("numeroDocumento").value != ""){
        this.apiForm.message({
          codigo: 4,
          message: "Debe ingresar el tipo y número de documento para consultar"
        });
      }else{
        this.apiForm.message({
          codigo: 4,
          message: "Debe seleccionar los filtros correctamente"
        });
      }
    }
  }

  certificate(row:any):void{
    const dialogRef = this.dialog.open(EmisionCertificadoBandejaComponent, {
      width: '85%',
      height: '85%',
      data: {
        isEdit: true,
        codigo: row.codigo,
        idSubproducto: row.idSubproducto,
        isCertificate: this.isCertificate,
        descripcionDocumento: row.descripcionDocumento,
        nombres: row.nombres,
        apellidoPaterno: row.apellidoPaterno,
        apellidoMaterno: row.apellidoMaterno,
        numeroDocumento: row.numeroDocumento,
        tipoDocumento: row.tipoDocumento,
        numeroCuenta: row.cuenta,
        cliente: row,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result;
      if (this.isExist) {
        this.list.search();
      }
    });
  }

  uncertificate(row:any):void{
    this.apiForm.message({
      codigo: 4,
      message: 'No se cuentan con puntos para emitir los certificados'
    });
  }
}