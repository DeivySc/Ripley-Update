import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ReglaAcumulacionService } from '../../../../service-layer/reglas/acumulacion/regla-acumulacion.service';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { HeaderService } from '../../../../services/header.service';
import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { ReglaAcumulacionFormComponent } from '../form/regla-acumulacion-form.component';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { ReglaAcumulacionModel } from 'src/app/model-layer/reglas/acumulacion/regla-acumulacion.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
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
  selector: 'app-regla-acumulacion-bandeja',
  templateUrl: './regla-acumulacion-bandeja.component.html',
  styleUrls: ['./regla-acumulacion-bandeja.component.css'],
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
export class ReglaAcumulacionBandejaComponent implements OnInit {
  list: ApiTable[];
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    private _header: HeaderService,
    private _service: ReglaAcumulacionService,
    private router: Router,
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = [];
    let index = 0;
    this.list[index] = new ApiTable();
    this.list[index].columns = ['codigo', 'descripcion', 'puntaje', 'inicio', 'fin', 'vigencia', 'editar', 'eliminar'];
    this.list[index].service = this._service;
    this.list[index].method = "findAllVigente";
    this.list[index].resultMap = {
      "source": "listReglaAcumulacionVigente",
      "length": "totalRegistros"
    };
    this.list[index].sort = {
      "column": "id",
      "direction": "desc"
    }
    this.list[index].sortMap = {
      "codigo": "id",
      "inicio": "FECHA_INICIO",
      "fin": "FECHA_FIN"
    };
    this.list[index].search();

    index = 1;
    this.list[index] = new ApiTable();
    this.list[index].columns = ['codigo', 'descripcion', 'puntaje', 'inicio', 'fin', 'vigencia', 'estado'];
    this.list[index].service = this._service;
    this.list[index].method = "findAllHistorica";
    this.list[index].resultMap = {
      "source": "listReglaAcumulacionHistorica",
      "length": "totalRegistros"
    };
    this.list[index].sort = this.list[index - 1].sort;
    this.list[index].sortMap = this.list[index - 1].sortMap;
    this.list[index].search();
    
    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.model = new ReglaAcumulacionModel();
    this.apiForm.formSnackBar = this.matSnackBar;   
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }

  ngOnInit() {
    this._header.settingValues({ title: "Reglas de Acumulación" });
    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      this.apiLoading.close();
    });
    
    this.apiLoading.show();
  }

  new() {
    const dialogRef = this.dialog.open(ReglaAcumulacionFormComponent, {
      width: '975px',
      height: '635px',
      data: {
        isEdit: false,
        codigo: null,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result;
      if (this.isExist) {
        this.list[0].search();
        this.list[1].search();
      }
    });
  }

  edit(row:any) {
    const dialogRef = this.dialog.open(ReglaAcumulacionFormComponent, {
      width: '975px',
      height: '635px',
      data: {
        isEdit: true,
        codigo: row.regId,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result;
      if (this.isExist) {
        this.list[0].search();
        this.list[1].search();
      }
    });
  }

  delete(row:any) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: { isExist: false, isDelete: true },
      disableClose: true,
      autoFocus: true,
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result.event.isExist;
      if (this.isExist) {

        this.apiForm.model.id = row.regId;
        this.apiForm.model.estado = "0";
        this.apiForm.model.usrMod = "SRP";

        this.apiForm.consume("delete", this.apiForm.model, (data:any) => {
          if (data.codigo == 0) this.apiForm.message("eliminar");
          
          this.list[0].search();
          this.list[1].search();
        });
      }
    });
  }
  
  parseIntegerField(s:string):any{
    return parseInt(s);
  }
}