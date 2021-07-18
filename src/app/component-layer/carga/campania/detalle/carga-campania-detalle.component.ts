import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../../../utils/dialog-confirm/dialog-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CargaCampaniaService } from '../../../../service-layer/carga/campania/carga-campania.service';
import { CargaCampaniaModel } from '../../../../model-layer/carga/campania/carga-campania.model';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ApiForm } from "../../../../utils-layer/api-form/api-form";
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
import { ApiTable } from 'src/app/utils-layer/api-table/api-table';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

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
  selector: 'app-carga-campania-detalle',
  templateUrl: './carga-campania-detalle.component.html',
  styleUrls: ['./carga-campania-detalle.component.css'],
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
export class CargaCampaniaDetalleComponent implements OnInit {
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;
  errorMatcher = new CrossFieldErrorMatcher();
  
  list: ApiTable;
  
  minDate = new Date();
  maxDate = new Date("3000-12-31");

  constructor(
    public dialogRef: MatDialogRef<CargaCampaniaDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private _service: CargaCampaniaService,
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
    this.apiForm.model = new CargaCampaniaModel();
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";

    this.apiForm.fields = {    
      descripcion: ['', [Validators.required, Validators.pattern(this.apiValidator.regularExpression(["text"]))]],
      fechaVencimiento: ['', [Validators.required]]
    };
    this.apiForm.mapping = {
      fechaVencimiento: "fechaVencimiento",
      descripcion: "descripcion"
    };    
    this.apiForm.mappingToForm = () => {
      this.apiForm.model.estado = ((this.apiForm.model.estado == null || this.apiForm.model.estado == "") ? "1" : this.apiForm.model.estado);
    }
    this.apiForm.mappingToModel = () => {
      if(! this.data.isEdit){
        this.apiForm.model.codigo = "";
      }
      this.apiForm.model.estado = ((this.apiForm.model.estado == null || this.apiForm.model.estado == "") ? "1" : this.apiForm.model.estado);
    }
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }


  ngOnInit(): void {
    this.apiForm.build();

    this.list = new ApiTable();
    this.list.columns = ['idCabecera', 'tipoDocumento', 'numeroDocumento', 'subProducto','puntos', 'estado', 'todo'];
    this.list.service = new CargaCampaniaService(this._http);
    this.list.method = "findAllCampaniaDetalle";
    this.list.resultMap = {
      "source": "listaCampaniaDetalle",
      "length": "total"
    };
    this.list.methodComplete = "findAllCampaniaDetalleAll";    
    this.list.resultMapComplete = {
      "sourceComplete": "listaCampaniaDetalle",
      "lengthComplete": "total"
    };
    this.list.sort = {
      "column": "ID",
      "direction": "desc"
    }
    this.list.sortMap = {
      "codigo": "ID"
    }
    this.list.checkedIdentifier = "numeroDocumento";
    this.list.service.filterObj.idCabecera = this.data.codigo;
    
    this.list.search(()=>{console.log(this.list.source)});
  }

  action(){
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
      
        this.apiForm.toModel();
        this.apiForm.mappingToModel();

        let array = [];
        this.list.checkeds.map((data: any) => {
          array.push(data);
        });

        let json = {
          idCabecera: this.data.codigo,
          fechaVencimiento: this.apiForm.model.fechaVencimiento,
          descripcion: this.apiForm.model.descripcion,
          listaCampanias: array,
          usuarioActualiza: "SRP",
        };

        this.apiForm.consume("saveDetalle", json, (data:any) => {
          if (data.codigo != 0) {
            this.apiForm.message(data);
          }else{
            this.apiForm.message("guardar");

            this.data.isExist = true;
            this.closeDialog({ isExist: this.data.isExist, idCabecera: this.data.codigo });
          }

          this.apiLoading.close();
        });
      });
      this.apiLoading.show(true);
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  closeDialog(value?: any) {
    this.dialogRef.close({ event: value });
  }
}
