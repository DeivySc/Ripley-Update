import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../../../utils/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConsultaClienteService } from '../../../../service-layer/consulta/cliente/consulta-cliente.service';
import { ConsultaClienteModel } from '../../../../model-layer/consulta/cliente/consulta-cliente.model';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ApiForm } from "../../../../utils-layer/api-form/api-form";
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
import { EncryptObjects } from 'src/app/shared/util/encryptObjects';
import { ConsultaClienteCanjeComponent } from '../canje/consulta-cliente-canje.component';
import { ConsultaClienteHistoricoComponent } from '../historico/consulta-cliente-historico.component';
import { ConsultaClienteUltimoComponent } from '../ultimo/consulta-cliente-ultimo.component';
import { ConsultaClienteActualizarComponent } from '../actualizar/consulta-cliente-actualizar.component';
import * as moment from 'moment';

@Component({
  selector: 'app-consulta-cliente-resume',
  templateUrl: './consulta-cliente-resume.component.html',
  styleUrls: ['./consulta-cliente-resume.component.css']
})
export class ConsultaClienteResumeComponent implements OnInit {
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;
  isAlternative: boolean = null;
  errorMatcher = new CrossFieldErrorMatcher();

  tiposPunto: any;
  puntosCliente: any;

  constructor(
    public dialogRef: MatDialogRef<ConsultaClienteResumeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private _service: ConsultaClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.apiValidator = new ApiValidator();
    
    this.apiForm = new ApiForm();
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;    
    this.apiForm.datepipe = this.datepipe;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new ConsultaClienteModel();
    this.apiForm.model = data.cliente;
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";

    this.apiForm.fields = {};
    this.apiForm.mapping = { };    
    this.apiForm.mappingToForm = () => {}
    this.apiForm.mappingToModel = () => {}

    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
    
    this.isAlternative = this.data.isAlternative;
  }


  ngOnInit(): void {
    this.apiForm.build();   

    if (this.data.codigo != null) {    
      this.loadResumen();
    }else{
      this.close();
    }
  }

  loadResumen():void{
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {        
      this.apiForm.errorCallback = ((data:any) => { this.apiLoading.error(data); });
      
      this.apiForm.consume("findById", this.data.codigo, (data:any) => {
        this.apiForm.model = data;
        this.apiForm.model.nombres = this.apiForm.model.nombres.trim();
        this.apiForm.model.apellidoPaterno = this.apiForm.model.apellidoPaterno.trim();
        this.apiForm.model.apellidoMaterno = this.apiForm.model.apellidoMaterno.trim();
        this.apiForm.model.numeroDocumento = this.data.cliente.numeroDocumento;

        this.apiForm.model.fechaCorte = (moment(new Date())).format("DD/MM/YYYY");
        this.apiForm.model.horaCorte = (moment(new Date())).format("hh:mm A");

        this.apiLoading.close();
      });
    });
        
    this.apiLoading.show();
  }

  close(): void {
    this.dialogRef.close();
  }

  closeDialog(value?: any) {
    this.dialogRef.close({ event: value });
  }

  roundUp(number:string):string{
    if(number != null){
      return parseFloat(number).toFixed(0).toString();
    }else{
      return "";
    }
  }
  
  canje() {    
    const dialogRef = this.dialog.open(ConsultaClienteCanjeComponent, {
      width: '85%',
      height: '85%',
      data: {
        isEdit: true,
        codigo: this.data.codigo,
        idSubproducto: this.data.idSubproducto,
        cliente: this.data.cliente,
        isExist: false
      },
      panelClass: '',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {      
    });
  }
  
  historico() {    
    const dialogRef = this.dialog.open(ConsultaClienteHistoricoComponent, {
      width: '85%',
      height: '85%',
      data: {
        isEdit: true,
        codigo: this.data.codigo,
        idSubproducto: this.data.idSubproducto,
        cliente: this.data.cliente,
        last: false,
        isExist: false
      },
      panelClass: '',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {      
    });
  }
  
  reciente() {    
    const dialogRef = this.dialog.open(ConsultaClienteUltimoComponent, {
      width: '85%',
      height: '85%',
      data: {
        isEdit: true,
        codigo: this.data.codigo,
        idSubproducto: this.data.idSubproducto,
        cliente: this.data.cliente,
        last: true,
        isExist: false
      },
      panelClass: '',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {      
    });
  }
  
  actualizar() {    
    const dialogRef = this.dialog.open(ConsultaClienteActualizarComponent, {
      width: '500px',
      height: '635px',
      data: {
        isEdit: true,
        codigo: this.data.codigo,
        idSubproducto: this.data.idSubproducto,
        cliente: this.data.cliente,
        last: true,
        isExist: false
      },
      panelClass: '',
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result?.event){
        this.loadResumen();
      }      
    });
  }
}