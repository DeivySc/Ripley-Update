import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { ApiForm } from "../../../../utils-layer/api-form/api-form";

import { DialogConfirmComponent } from '../../../utils/dialog-confirm/dialog-confirm.component';
import { MantenimientoValoradoService } from "../../../../service-layer/mantenimiento/valorado/mantenimiento-valorado.service";
import { MantenimientoValoradoModel } from "../../../../model-layer/mantenimiento/valorado/mantenimiento-valorado.model";
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';

import { HeaderService } from '../../../../services/header.service';

import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MantenimientoValoradoSucursalComponent } from '../sucursal/mantenimiento-valorado-sucursal.component';
import { MantenimientoValoradoSucursalModel } from 'src/app/model-layer/mantenimiento/valorado/mantenimiento-valorado-sucursal.model';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-mantenimiento-valorado-form.component',
  templateUrl: './mantenimiento-valorado-form.component.html',
  styleUrls: ['./mantenimiento-valorado-form.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'es-ES'
    }
  ]
})
export class MantenimientoValoradoFormComponent implements OnInit {
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;

  titulo: string = "";  
  textoBoton: string = "Guardar Valorado"

  list: ApiTable;

  minDateStart = new Date();
  minDateEnd = new Date();
  maxDate = new Date();

  errorMatcher = new CrossFieldErrorMatcher();
  
  constructor(
    public dialogRef: MatDialogRef<MantenimientoValoradoFormComponent>,
    private _header: HeaderService,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private _http: HttpClient,
    public _service: MantenimientoValoradoService,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute
  ) {  
    this.apiValidator = new ApiValidator();
    
    this.apiForm = new ApiForm();
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;    
    this.apiForm.datepipe = this.datepipe;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new MantenimientoValoradoModel();
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";

    this.apiForm.fields = {
      codigoValorado: [''],
      descripcionValorado: ['', [Validators.required,Validators.maxLength(100),Validators.pattern(this.apiValidator.regularExpression(["text"]))]],
      razonSocialEstablecimiento: ['', [Validators.required,Validators.maxLength(100),Validators.pattern(this.apiValidator.regularExpression(["text"]))]],
      rucEstablecimiento: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(this.apiValidator.regularExpression(["number"]))]]
    };
    this.apiForm.mapping = (this.data.isEdit ? {
      codigoValorado: "codigo",
      razonSocialEstablecimiento: "razonSocial",
      descripcionValorado: "descripcionValorado",
      rucEstablecimiento: "ruc",
      estado: "estado"
    } : {
      razonSocialEstablecimiento: "razonSocial",
      descripcionValorado: "descripcionValorado",
      rucEstablecimiento: "ruc",
      estado: "estado"
    });

    this.apiForm.mappingToForm = () => {
      this.apiForm.model.estado = (this.apiForm.model.estado == null ? 1 : this.apiForm.model.estado);
      this.apiForm.model.razonSocial = this.apiForm.model.razonSocialEstablecimiento;
      this.apiForm.model.ruc = this.apiForm.model.rucEstablecimiento;
      this.apiForm.model.descripcionValorado = this.apiForm.model.descripcionValorado;
    }
    this.apiForm.mappingToModel = () => {
      this.apiForm.model.estado = (this.apiForm.model.estado == null ? 1 : this.apiForm.model.estado);
      this.apiForm.model.descripcion = this.apiForm.model.descripcionValorado;
    }

    _service.filterObj.codigoValorado = this.data.codigo;

    this.list = new ApiTable();
    this.list.columns = ['codigo', 'descripcion', 'eliminar'];
    this.list.service = _service;
    this.list.method = "allSucursal";
    this.list.resultMap = {
      "source": "listaValoradoSucursal",
      "length": "totalRegistros"
    };
    this.list.methodComplete = "list";    
    this.list.resultMapComplete = { };
    this.list.sort = { }
    this.list.sortMap = { };
    this.list.checkedIdentifier = "codigo";
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
    
    let year = new Date();
    this.maxDate = new Date(year.getFullYear() + 1, 11, 31);

    this.apiForm.build();       
  }


  ngOnInit() {
    if (this.data.isEdit) {
      this.titulo = "Modificar Valorado";
      this.textoBoton = "Actualizar Valorado";
    }else{
      this.titulo = "Nuevo Valorado";
    }
    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      if (this.data.isEdit) {    
        this.list.search(() => {
          this.apiForm.errorCallback = ((data:any) => { this.apiLoading.error(data); });
          this.apiForm.consume("findById", this.data.codigo, (data:any) => {
            this.apiForm.message("obtener");        
            this.apiForm.model = data.valorado;
  
            this.apiForm.mappingToForm();
            this.apiForm.toForm();

            this.apiLoading.close();
          });
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
                if(data.codigo != 0){
                  this.apiForm.message(data);
                }else{
                  this.apiForm.message("actualiza");
                
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
                if(data.codigo != 0){
                  this.apiForm.message(data);
                }else{
                  this.apiForm.message("guardar");

                  this.data.isExist = true;
                  this.closeDialog(this.data.isExist);
                }               
                
                this.apiLoading.close();
              });
            }
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

  newSucursal():void{
    const dialogRef = this.dialog.open(MantenimientoValoradoSucursalComponent, {
      width: '550px',
      height: '600px',
      data: {
        isEdit: false,
        codigo: this.data.codigo
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.isExist = result.event.isExist;
        }
        if (this.isExist) {
          this.list.search();
        }
      }
    );
  }

  deleteSucursal(row:any) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: { isExist: false, isDelete: true },
      disableClose: true,
      autoFocus: true,
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result.event.isExist;
      if (this.isExist) {
        var model: any = new MantenimientoValoradoSucursalModel();
        model.codigo = row.idValoradoSucursal;
        model.estado = "0";

        this.apiForm.consume("updateFieldSucursalEstado", model, (data:any) => {
          if (data.codigo == 0) this.apiForm.message("updateState");
          
          this.list.setPage(1);
        });
      }
    });
  }
}