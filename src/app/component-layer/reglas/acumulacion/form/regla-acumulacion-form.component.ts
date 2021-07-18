import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { ApiForm } from "../../../../utils-layer/api-form/api-form";

import { DialogConfirmComponent } from '../../../../component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ReglaAcumulacionService } from "../../../../service-layer/reglas/acumulacion/regla-acumulacion.service";
import { TipoTarjetaService } from "../../../../service-layer/tipo-tarjeta.service";
import { PlazoService } from "../../../../service-layer/plazo.service";
import { ReglaAcumulacionModel } from "../../../../model-layer/reglas/acumulacion/regla-acumulacion.model";
import { EstablecimientoModel } from "../../../../model-layer/establecimiento.model";
import { PlazoModel } from "../../../../model-layer/plazo.model";
import { TipoTarjetaModel } from "../../../../model-layer/tipo-tarjeta.model";
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';

import { HeaderService } from '../../../../services/header.service';

import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MantenimientoSucursalService } from 'src/app/service-layer/mantenimiento/sucursal/mantenimiento-sucursal.service';
import { ReglaAcumulacionPlazoComponent } from '../plazo/regla-acumulacion-plazo.component';
import { ReglaAcumulacionPlazoModel } from 'src/app/model-layer/reglas/acumulacion/regla-acumulacion-plazo.model';
import { ReglaAcumulacionPlazoService } from 'src/app/service-layer/reglas/acumulacion/regla-acumulacion-plazo.service';
import { ApiValidator, optionalValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-regla-acumulacion-form.component',
  templateUrl: './regla-acumulacion-form.component.html',
  styleUrls: ['./regla-acumulacion-form.component.css'],
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
export class ReglaAcumulacionFormComponent implements OnInit {
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;

  titulo: string = "";  
  textoBoton: string = "Guardar regla"

  vista:number = 0;
  list: ApiTable[];

  minDateStart = new Date();
  minDateEnd = new Date();
  maxDate = new Date();

  errorMatcher = new CrossFieldErrorMatcher();
  
  constructor(
    public dialogRef: MatDialogRef<ReglaAcumulacionFormComponent>,
    private _header: HeaderService,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private _http: HttpClient,
    public _service: ReglaAcumulacionService,
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
    this.apiForm.model = new ReglaAcumulacionModel();
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";

    this.apiForm.fields = this.data.isEdit ? {
      tipregId: [''],
      nombre: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["text"]))]],
      tipo: ['', [Validators.required]],
      inicioVigencia: ['', [Validators.required]],
      finVigencia: ['', [Validators.required]],
      puntaje: ['', [Validators.required, Validators.maxLength(4), Validators.pattern(this.apiValidator.regularExpression(["number"], 4)), Validators.min(1), Validators.max(1000)]],
      tipoPuntaje: ['', [Validators.required]],
      unidadCompra: ['', [optionalValidator([Validators.maxLength(8), Validators.pattern(this.apiValidator.regularExpression(["decimal"], 5, 2)), Validators.min(1.00), Validators.max(10000.00)])]],
    } : {
      tipregId: [''],
      nombre: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["text"]))]],
      tipo: ['', [Validators.required]],
      inicioVigencia: ['', [Validators.required]],
      finVigencia: ['', [Validators.required]],
      puntaje: ['', [Validators.required, Validators.maxLength(4), Validators.pattern(this.apiValidator.regularExpression(["number"], 4)), Validators.min(1), Validators.max(1000)]],
      tipoPuntaje: ['', [Validators.required]],
      unidadCompra: ['', [optionalValidator([Validators.maxLength(8), Validators.pattern(this.apiValidator.regularExpression(["decimal"], 5, 2)), Validators.min(1.00), Validators.max(10000.00)])]],
    };
    this.apiForm.mapping = (this.data.isEdit ? {
      tipregId: "id",
      nombre: "nombre",
      tipoPuntaje: "tipoPuntaje",
      tipo: "tipo",
      puntaje: "puntaje",
      inicioVigencia: "inicioVigencia",
      finVigencia: "finVigencia",
      unidadCompra: "unidadCompra"
    } : {
      nombre: "nombre",
      tipoPuntaje: "tipoPuntaje",
      tipo: "tipo",
      puntaje: "puntaje",
      inicioVigencia: "inicioVigencia",
      finVigencia: "finVigencia",
      unidadCompra: "unidadCompra"
    });
    this.apiForm.mappingToForm = () => {
      if(this.data.isEdit){
        this.apiForm.model.inicioVigencia = this.apiForm.convertDateToString(this.apiForm.reorderDateToUpdate(this.apiForm.model.inicioVigencia));
      }else{
        this.apiForm.model.inicioVigencia = this.apiForm.reorderDateToUpdate(this.apiForm.model.inicioVigencia);
      }
      this.apiForm.model.finVigencia = this.apiForm.reorderDateToUpdate(this.apiForm.model.finVigencia);
      this.apiForm.model.puntaje = parseInt(this.apiForm.model.puntaje);
      
      this.minDateStart = this.minDateEnd = this.apiForm.model.inicioVigencia;
      this.maxDate = this.apiForm.model.finVigencia;

      if(this.apiForm.model.tipoPuntaje.toString() == "5002"){
        this.apiForm.getField("unidadCompra").markAsTouched();
        this.apiForm.getField("unidadCompra").enable();
      }else{
        this.apiForm.getField("unidadCompra").markAsUntouched();
        this.apiForm.getField("unidadCompra").disable();
      }
    }
    this.apiForm.mappingToModel = () => {
      if(this.data.isEdit){
        this.apiForm.model.tipo = (this.apiForm.model.tipo == "" || this.apiForm.model.tipo == null) ? "4001" : this.apiForm.model.tipo;
        this.apiForm.model.tipoPuntaje = (this.apiForm.model.tipoPuntaje == "" || this.apiForm.model.tipoPuntaje == null) ? "5001" : this.apiForm.model.tipoPuntaje;
        this.apiForm.model.vigencia = (this.apiForm.model.vigencia == "" || this.apiForm.model.vigencia == null) ? "1" : this.apiForm.model.vigencia;
        this.apiForm.model.finVigencia = this.apiForm.convertDateToString(this.apiForm.model.finVigencia);
        this.apiForm.model.fecCre = this.apiForm.convertDateToString(new Date());
      }else{
        this.apiForm.model.tipo = (this.apiForm.model.tipo == "" || this.apiForm.model.tipo == null) ? "4001" : this.apiForm.model.tipo;
        this.apiForm.model.tipoPuntaje = (this.apiForm.model.tipoPuntaje == "" || this.apiForm.model.tipoPuntaje == null) ? "5001" : this.apiForm.model.tipoPuntaje;
        this.apiForm.model.vigencia = (this.apiForm.model.vigencia == "" || this.apiForm.model.vigencia == null) ? "1" : this.apiForm.model.vigencia;
        this.apiForm.model.inicioVigencia = this.apiForm.reorderDateToInsert(this.apiForm.model.inicioVigencia._i);
        this.apiForm.model.finVigencia = this.apiForm.reorderDateToInsert(this.apiForm.model.finVigencia._i);            
        this.apiForm.model.fecCre = this.apiForm.convertDateToString(new Date());
      }

      if(this.apiForm.model.tipoPuntaje == "5001"){
        this.apiForm.model.unidadCompra = "0";
      }
    }

    this.list = [];

    let year = new Date();
    this.maxDate = new Date(year.getFullYear() + 1, 11, 31);

    this.apiForm.build();
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }


  ngOnInit() {
    this._header.settingValues({ title: 'Reglas de Acumulación' });

    if (this.data.isEdit) {      
      this.titulo = "Modificar Regla";
      this.textoBoton = "Actualizar Regla";
    }else{
      this.titulo = "Nueva Regla";
    }
    this.vista = 1;    
    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      if (this.data.isEdit) {
        this.apiForm.consume("findById", this.data.codigo, (data:any) => {
          this.apiForm.message("obtener");        
          this.apiForm.model = data;
          
          this.minDateStart = this.apiForm.model.inicioVigencia;
          this.minDateEnd = this.apiForm.model.inicioVigencia;
          this.maxDate = this.apiForm.model.finVigencia;

          this.apiForm.mappingToForm();
          this.apiForm.toForm();

          this.loadDetail();
        });
      }else{
        this.loadDetail();
      }
    });
    
    this.apiLoading.show();
  }

  loadDetail(): void{    
    let index = 0;
    this.list[index] = new ApiTable();
    this.list[index].columns = ['codigo', 'departamento', 'todo'];
    this.list[index].service = new MantenimientoSucursalService(this._http);
    this.list[index].method = "page";
    this.list[index].resultMap = {
      "source": "listaSucursal",
      "length": "totalRegistros"
    };
    this.list[index].methodComplete = "list";    
    this.list[index].resultMapComplete = {
      "sourceComplete": "listaSucursal",
      "lengthComplete": "totalRegistros"
    };
    this.list[index].sort = { }
    this.list[index].sortMap = { };
    this.list[index].checkedIdentifier = "codigo";
    
    this.list[index].search(() => {
      index = 1;
      this.list[index] = new ApiTable();
      this.list[index].columns = ['tipo', 'todo'];
      this.list[index].service = new TipoTarjetaService(this._http);
      this.list[index].method = "page";
      this.list[index].resultMap = {
        "source": "listaTipoTarjeta",
        "length": "totalRegistros"
      };
      this.list[index].methodComplete = "list";
      this.list[index].sort = { }
      this.list[index].sortMap = { };
      this.list[index].checkedIdentifier = "id";
      this.list[index].search(() => {
        index = 2;
        this.list[index] = new ApiTable();
        this.list[index].columns = ['descripcion', 'plazoMinimo', 'plazoMaximo', 'editar', 'eliminar'];
        
        if(this.data.isEdit){
          this.apiForm.consume("getDet", parseInt(this.data.codigo), (data:any) => {
            data.forEach((element: any) => {
              if(element.id_sucursal != 0){
                this.list[0].source.find((x: any) => (x.codigo == element.id_sucursal.toString()) ? x.checked = true : null);
                this.list[0].someChecked = true;
                this.list[0].checkeds[this.list[0].checkeds.length] = (<EstablecimientoModel>({codigo:element.id_sucursal}));
              }else if(element.id_plazo != 0 && element.id_plazo != -1 && element.id_plazo != null){
                this.list[2].push((<ReglaAcumulacionPlazoModel>({
                  id: element.id_plazo,
                  codigo: element.id_plazo,
                  tipo: element.id_plazo,
                  descripcion: element.descripcion,
                  plazoMinimo: element.plazoMin,
                  plazoMaximo: element.plazoMax
                })));
              }else if(element.id_subproducto >= 0){
                this.list[1].source.find((x: any) => (x.id == element.id_subproducto.toString()) ? x.checked = true : null);
                this.list[1].someChecked = true;
                this.list[1].checkeds[this.list[1].checkeds.length] = (<TipoTarjetaModel>({id:element.id_subproducto}));
              }
            });            
            
            this.apiLoading.close();  
          });
        }else{
          this.apiLoading.close();          
        }
      });
    });
  }

  action(){
    if (this.apiForm.formGroup.status == "VALID") {
      if(this.validate()){
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

                var _tarjetas: Array<TipoTarjetaModel> = new Array();
                var _plazos: Array<PlazoModel> = new Array();
                var _establecimientos: Array<EstablecimientoModel> = new Array();

                _establecimientos = this.list[0].checkeds;
                _establecimientos.forEach((x:any) => {
                  x.estado = null;
                  x.checked = null;
                });
                _tarjetas = this.list[1].checkeds;
                _tarjetas.forEach((x:any) => {
                  x.estado = null;
                  x.checked = null;
                });
                _plazos = this.list[2].source;
                
                this.apiForm.model.id = this.data.codigo;
                this.apiForm.consume("update", this.apiForm.model, (data:any) => {
                  if(data.id != null && data.id != ""){
                    this.apiForm.consume("saveDet", {
                      tarjetas: _tarjetas, 
                      plazos: _plazos,
                      establecimientos: _establecimientos, 
                      id: parseInt(this.apiForm.model.id), 
                      usrCre: this.apiForm.model.usrCre
                    }, (datares:any) => {
                      if(datares.statusResponseCode == 0){
                        this.data.isExist = true;
                        this.apiForm.message("actualiza");

                        this.closeDialog(this.data.isExist);
                      }else{
                        this.apiForm.message({
                          codigo: 4,
                          message: data.statusResponseMessage
                        });
                      }
                      this.apiLoading.close();
                    });
                  }else{
                    this.apiForm.message({
                      codigo: 4,
                      message: data.mensaje
                    });
                    this.apiLoading.close();
                  }
                });
              }else{
                this.apiForm.toModel();
                this.apiForm.mappingToModel();

                var _tarjetas: Array<TipoTarjetaModel> = new Array();
                var _plazos: Array<PlazoModel> = new Array();
                var _establecimientos: Array<EstablecimientoModel> = new Array();
                
                _establecimientos = this.list[0].checkeds;
                _establecimientos.forEach((x:any) => {
                  x.estado = null;
                  x.checked = null;
                });
                _tarjetas = this.list[1].checkeds;
                _tarjetas.forEach((x:any) => {
                  x.estado = null;
                  x.checked = null;
                });
                _plazos = this.list[2].source;
                
                this.apiForm.consume("save", this.apiForm.model, (data:any) => {
                  if(data.id != null && data.id != ""){
                    this.apiForm.consume("saveDet", {
                      tarjetas: _tarjetas, 
                      plazos: _plazos,
                      establecimientos: _establecimientos, 
                      id: parseInt(data.id),
                      usrCre: this.apiForm.model.usrCre
                    }, (datares:any) => {
                      if(datares.statusResponseCode == 0){
                        this.data.isExist = true;
                        this.apiForm.message("guardar");

                        this.closeDialog(this.data.isExist);
                      }else{
                        this.apiForm.message({
                          codigo: 4,
                          message: data.statusResponseMessage
                        });
                      }
                      this.apiLoading.close();
                    });
                  }else{
                    this.apiForm.message({
                      codigo: 4,
                      message: data.mensaje
                    });
                    this.apiLoading.close();
                  }
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
  }
  
  getChange(e:any):void{
    this.minDateEnd = e.value;
    if(this.apiForm.getField("finVigencia").value < this.minDateEnd){
      this.apiForm.getField("finVigencia").setValue("");
    }
  }

  modificarVista(operacion: number){
    if(operacion == 0){
        if(this.vista > 1){
          this.vista = this.vista - 1;
        }
    }else{
      if(this.verificarLista(this.vista)){
        if(this.vista < 2){
          this.vista = this.vista + 1;
        }
      }else{
        this.apiForm.message("seleccion");
      }
    }
  }

  verificarLista(vista: number){
    switch (vista) {
      case 1:
        return this.list[0].someChecked;
      default:
        break;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  closeDialog(value?: any) {
    this.dialogRef.close({ event: value });
  }

  newPlazo():void{
    const dialogRef = this.dialog.open(ReglaAcumulacionPlazoComponent, {
      width: '500px',
      height: '375px',
      data: {
        isEdit: false,
        codigo: this.data.codigo,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result?.event != null) {
        if (result.event?.returnObj != null) {
          this.list[2].push(result.event.returnObj);
        }
      }
    });
  }

  editPlazo(row:any):void{
    const dialogRef = this.dialog.open(ReglaAcumulacionPlazoComponent, {
      width: '500px',
      height: '375px',
      data: {
        isEdit: true,
        codigo: this.data.codigo,
        returnObj: row,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result?.event != null){
        if (result.event?.returnObj != null) {
          this.list[2].source = null;
          this.list[2].push(result.event.returnObj);
        }
      }
    });
  }

  deletePlazo(row:any):void{
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: { isExist: false, isDelete: true },
      disableClose: true,
      autoFocus: true,
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result.event.isExist;
      if (this.isExist) {
        var lista:any = [];
        for(let i of Object.keys(this.list[2].source)){
          if(this.list[2].source[i].id != row.id){
            lista[lista.length] = this.list[2].source[i];
          }
        }
        this.list[2].source = lista;
        this.list[2].length = lista.length;
      }
    });
  }

  validate():boolean{
    if(this.apiForm.getField("tipoPuntaje").value == "5002" && parseInt(this.apiForm.getField("unidadCompra").value) == 0){
      this.apiForm.message({
        codigo: 4,
        message: "Debe ingresar un Monto de Compra válido"
      });
      return false;
    }
    return true;
  }

  onChangeSelected(event:any):void{
    this.apiForm.getField("unidadCompra").value = "";
    if(event.value.toString() == "5002"){
      this.apiForm.getField("unidadCompra").markAsTouched();
      this.apiForm.getField("unidadCompra").enable();
    }else{
      this.apiForm.getField("unidadCompra").markAsUntouched();
      this.apiForm.getField("unidadCompra").disable();
    }
  }

  /*test():void{
    console.log(this.apiForm.formGroup);
  }*/
}