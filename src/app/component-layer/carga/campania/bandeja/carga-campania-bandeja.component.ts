import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { CargaCampaniaService } from '../../../../service-layer/carga/campania/carga-campania.service';
//import { CargaCampaniaFormComponent } from '../form/carga-campania-form.component';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { MatPaginator } from '@angular/material/paginator';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { CargaCampaniaModel } from 'src/app/model-layer/carga/campania/carga-campania.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
import { CargaCampaniaDetalleComponent } from '../detalle/carga-campania-detalle.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MantenimientoParametroModel } from 'src/app/model-layer/mantenimiento/parametro/mantenimiento-parametro.model';
import { MantenimientoParametroService } from 'src/app/service-layer/mantenimiento/parametro/mantenimiento-parametro.service';
import { HttpClient } from '@angular/common/http';

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
  selector: 'app-carga-campania-bandeja',
  templateUrl: './carga-campania-bandeja.component.html',
  styleUrls: ['./carga-campania-bandeja.component.css'],
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
export class CargaCampaniaBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiFormParametro: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  title: string = "Carga de Campaña";

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  groups: any;

  public stepView: any = 1;
  
  constructor(
    private _header: HeaderService,
    private _service: CargaCampaniaService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private _http: HttpClient,
    private matSnackBar: MatSnackBar
  ) {
    this.apiValidator = new ApiValidator();
    
    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new CargaCampaniaModel();
    
    this.apiForm.model.archivoBase = null;
    this.apiForm.model.fileName = "";
    this.apiForm.model.fileExtension = "";
    this.apiForm.model.usuario = this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";

    this.apiForm.fields = {
      codigoAjuste: ['', [Validators.required]],
      nombreArchivo: ['', [Validators.required]],
      archivoBase64: ['']
    };
    this.apiForm.mapping = {
      codigoAjuste: "codigoAjuste",
      nombreArchivo: "nombreArchivo"
    };
    this.apiForm.mappingToModel = () => {
      this.apiForm.model.nombreArchivo = this.apiForm.model.nombreArchivoTemp;
    };
    this.apiForm.build();

    this.list = new ApiTable();
    this.list.columns = ['codigo', 'archivo', 'usuario', 'fecha', 'campania', 'estadoCarga', 'cantidad', 'puntos', 'detalle'];
    this.list.service = this._service;
    this.list.method = "page";
    this.list.resultMap = {
      "source": "listaCampaniaCabecera",
      "length": "total"
    };
    this.list.sort = {
      "column": "CODIGO",
      "direction": "desc"
    }
    this.list.sortMap = {
      "codigo": "CODIGO",
      "fecha": "FECHA_TRANSACCION"
    }        
    this.list.search();
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
    
    this.apiForm.errorCallback = ((data:any) => { this.apiLoading.error(data); });
    
    this.apiFormParametro = new ApiForm();
    this.apiFormParametro.service = new MantenimientoParametroService(this._http);    
  }

  ngOnInit(): void {
    this._header.settingValues({ title: this.title });

    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {  
      this.apiFormParametro.service.filterObj = new MantenimientoParametroModel();
      this.apiFormParametro.service.filterObj.filtroTabla = "'parametro'";
      this.apiFormParametro.service.filterObj.filtroParametro = "'8000', '9000'";
      this.apiFormParametro.service.filterObj.columnaNombre = "CODIGO";
      this.apiFormParametro.service.filterObj.columnaOrden = "asc";

      this.apiFormParametro.consume("filterMasiva", {}, (data:any) => {
        this.groups = data.listaParametro.filter((x:any) => x.tabla == "parametro");

        this.apiLoading.close();
      });
    });

    this.apiLoading.show();
  }

  changeListener(event):void{
    if (event) {
      this.readThis(event.target);
    }
  }

  readThis(inputValue: any) {
    if (inputValue.files.length == 1) {
      let file: File = inputValue.files[0];
      const nameee = file.name.split(".");
      this.apiForm.model.nombreArchivoTemp = this.apiForm.model.fileName = file.name;
      this.apiForm.model.extension = this.apiForm.model.fileExtension = nameee[1];
      
      let validateName = nameee[0].split("_");
      let validateNamePre = validateName[0].trim();
      let size = parseInt(file.size.toString()) / 1024000;

      if(this.apiForm.model.extension.toString().trim().toLowerCase() =="xlsx" || this.apiForm.model.extension.toString().trim().toLowerCase() =="xls"){
        if(this.apiForm.getField('codigoAjuste').value == validateNamePre){
          if(size <= 10){
            this.apiLoading.loadCallback = (() => {  
              var reader = new FileReader();
              reader.onload = this._handleReaderLoaded.bind(this);
              reader.readAsBinaryString(file);
            });
            this.apiLoading.show();
          }else{
            this.apiForm.message({
              codigo: "4",
              message: "El archivo '" + validateNamePre + "' debe tener un tamaño como máximo de 10 MB"
            });
            this.apiForm.getField('nombreArchivo').reset();
          }
        }else{
          this.apiForm.message({
            codigo: "4",
            message: "El archivo '" + validateNamePre + "' debe tener como prefijo el código del ajuste. Ej. 000_"
          });
          this.apiForm.getField('nombreArchivo').reset();
        }
      }else{
        this.apiForm.message({
          codigo: "4",
          message: "Formato de archivo no permitido '" + validateNamePre + "', verifique el nombre y la extensión (Solo se aceptan archivos excel XLS y XLSX)"
        });
        this.apiForm.getField('nombreArchivo').reset();
      }
    }
  }

  _handleReaderLoaded(readerEvt:any) {
    var binaryString = readerEvt.target.result;
    this.apiForm.model.archivoBase = btoa(binaryString);
    this.apiForm.model.archivoBase64 = this.apiForm.model.archivoBase;
    
    this.apiLoading.close();
  }

  precarga():void{
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
            this.apiForm.toModel();
            this.apiForm.mappingToModel();

            this.apiForm.consume("save", this.apiForm.model, (data:any) => {
              console.log(data);
              if (data.codigo != 0) {
                this.apiForm.message(data);

                this.apiForm.getField('nombreArchivo').reset();
                this.apiForm.model.archivoBase = this.apiForm.model.archivoBase64 = null;
              }else{
                this.apiForm.message("guardar");
                this.list.search();
                this.reset();
              }

              this.apiLoading.close();
            });
          }else{
            this.apiLoading.close();
          }
        });     
        this.apiLoading.show(true);
      });
    }
  }

  detail(row:any):void{
    const dialogRef = this.dialog.open(CargaCampaniaDetalleComponent, {
      width: '950px',
      height: '635px',
      data: {
        isEdit: false,
        codigo: row.id,
        campania: row,
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

  onChangeSelected(ev:any):void{
  }

  reset():void{
    this.apiForm.formGroup.reset();
    this.apiForm.model.archivoBase = null;
    this.apiForm.model.archivoBase64 = null;
  }
}