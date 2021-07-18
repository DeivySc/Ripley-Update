import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { MantenimientoReporteService } from '../../../../service-layer/mantenimiento/reporte/mantenimiento-reporte.service';
import { MantenimientoReporteFormComponent } from '../form/mantenimiento-reporte-form.component';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { MatPaginator } from '@angular/material/paginator';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { MantenimientoReporteModel } from 'src/app/model-layer/mantenimiento/reporte/mantenimiento-reporte.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConfirmComponent } from 'src/app/component-layer/utils/dialog-confirm/dialog-confirm.component';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';
import { MantenimientoReporteColumnaComponent } from '../columna/mantenimiento-reporte-columna.component';
import { MantenimientoReporteDetalleComponent } from '../detalle/mantenimiento-reporte-detalle.component';

@Component({
  selector: 'app-mantenimiento-reporte-bandeja',
  templateUrl: './mantenimiento-reporte-bandeja.component.html',
  styleUrls: ['./mantenimiento-reporte-bandeja.component.css']
})
export class MantenimientoReporteBandejaComponent implements OnInit {
  list: ApiTable;
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;
  listDet2: ApiTable;
  listDet3: ApiTable;

  title: string = "Mantenimiento de Reportes";

  isExist: boolean = null;
  showDetail: boolean = false;
  showSubDetail: boolean = false;

  selected: MantenimientoReporteModel;
  
  errorMatcher = new CrossFieldErrorMatcher();
    
  constructor(
    private _header: HeaderService,
    private _service: MantenimientoReporteService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar
  ) {
    this.selected = new MantenimientoReporteModel();

    this.apiValidator = new ApiValidator();
    this.showDetail = false;
    this.showSubDetail = false;
    
    this.list = new ApiTable();
    this.list.columns = ['codigo', 'descripcion', 'detalle', 'editar', 'eliminar'];
    this.list.service = this._service;
    this.list.method = "page";
    this.list.resultMap = {
      "source": "listaReporte",
      "length": "totalRegistros"
    };
    this.list.sort = {
      "column": "ID",
      "direction": "desc"
    }
    this.list.sortMap = {
      "codigo": "ID"
    }
    this.list.presearchCallback = (() => {
      this.showDetail = false;
      this.showSubDetail = false;
    });
    this.list.search();


    this.apiForm = new ApiForm();    
    this.apiForm.service = this._service;
    this.apiForm.formBuilder = this.formBuilder;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new MantenimientoReporteModel();
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;


    this.listDet2 = new ApiTable();
    this.listDet2.columns = ['codigo', 'codigoColumna', 'descripcion', 'verDetalle', 'editar', 'eliminar'];
    this.listDet2.service = this._service;
    this.listDet2.method = "pageDetail";
    this.listDet2.resultMap = {
      "source": "listaReporteColumna",
      "length": "totalRegistros"
    };
    this.listDet2.sort = {
      "column": "ID",
      "direction": "desc"
    }
    this.listDet2.sortMap = {
      "codigoColumna": "ID"
    }
    this.listDet2.presearchCallback = (() => {
      this.showSubDetail = false;
    });

    this.listDet3 = new ApiTable();
    this.listDet3.columns = ['codigo', 'codigoColumna', 'codigoMovimiento', 'descripcion', 'tipoMovimiento', 'eliminar'];
    this.listDet3.service = this._service;
    this.listDet3.method = "pageSubDetail";
    this.listDet3.resultMap = {
      "source": "listaReporteColumnaDetalle",
      "length": "totalRegistros"
    };
    this.listDet3.sort = {
      "column": "ID",
      "direction": "desc"
    }
    this.listDet3.sortMap = {
      "codigoMovimiento": "ID"
    }
  }

  ngOnInit(): void {
    this._header.settingValues({ title: this.title });    
    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      this.apiLoading.close();
    });
    
    this.apiLoading.show();
  }


  new() {
    const dialogRef = this.dialog.open(MantenimientoReporteFormComponent, {
      width: '500px',
      height: '635px',
      data: {
        isEdit: false,
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

        this.showDetail = false;
        this.showSubDetail = false;
      }
    });
  }

  edit(row:any) {
    const dialogRef = this.dialog.open(MantenimientoReporteFormComponent, {
      width: '500px',
      height: '635px',
      data: {
        isEdit: true,
        codigo: row.codigo,
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

        this.showDetail = false;
        this.showSubDetail = false;
      }
    });
  }

  delete(row:any) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: { 
        isExist: false, 
        isDelete: true,
        messageDelete: "¿Está seguro de eliminar este registro?",
        messageEmphasis: "ESTA ACCIÓN ELIMINARÁ EL REPORTE Y TODOS SUS DETALLES"
      },
      disableClose: true,
      autoFocus: true,
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result.event.isExist;
      if (this.isExist) {
        this.apiForm.model.codigo = row.codigo;
        this.apiForm.model.estado = "0";
        
        this.apiForm.consume("updateFieldEstado", this.apiForm.model, (data:any) => {
          if (data.codigo == 0) this.apiForm.message("eliminar");
          
          this.list.search();

          this.showDetail = false;
          this.showSubDetail = false;
        });
      }
    });
  }

  viewColumna(row:any){
    this.showDetail = true;
    this.showSubDetail = false;
    this._service.filterObj.codigoReporte = row.codigo;

    this.selected.codigoReporte = row.codigo;
    this.selected.descripcionReporte = row.descripcion;

    this.listDet2.search();
  }

  newColumna() {
    const dialogRef = this.dialog.open(MantenimientoReporteColumnaComponent, {
      width: '500px',
      height: '635px',
      data: {
        isEdit: false,
        codigoReporte: this.selected.codigoReporte,
        descripcionReporte: this.selected.descripcionReporte,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result;
      if (this.isExist) {
        this.listDet2.search();

        this.showSubDetail = false;
      }
    });
  }

  editColumna(row:any) {
    const dialogRef = this.dialog.open(MantenimientoReporteColumnaComponent, {
      width: '500px',
      height: '635px',
      data: {
        isEdit: true,
        codigoReporte: this.selected.codigoReporte,
        descripcionReporte: this.selected.descripcionReporte,
        codigoColumna: row.codigoColumna,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result;
      if (this.isExist) {
        this.listDet2.search();

        this.showSubDetail = false;
      }
    });
  }

  deleteColumna(row:any) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: { isExist: false, isDelete: true },
      disableClose: true,
      autoFocus: true,
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result.event.isExist;
      if (this.isExist) {
        this.apiForm.model.codigoReporte = row.codigoReporte;
        this.apiForm.model.codigoColumna = row.codigoColumna;
        this.apiForm.model.estado = "0";
        
        this.apiForm.consume("updateFieldEstadoColumna", this.apiForm.model, (data:any) => {
          if (data.codigo == 0) this.apiForm.message("eliminar");
          
          this.listDet2.search();

          this.showSubDetail = false;
        });
      }
    });
  }

  viewDetalle(row:any){
    this.showSubDetail = true;
    this._service.filterObj.codigoReporte = this.selected.codigoReporte;
    this._service.filterObj.codigoDetail = row.codigoColumna;
    
    this.selected.codigoColumna = row.codigoColumna;
    this.selected.descripcionReporteColumna = row.descripcionReporteColumna;

    this.listDet3.search();
  }

  newDetalle() {
    const dialogRef = this.dialog.open(MantenimientoReporteDetalleComponent, {
      width: '950px',
      height: '635px',
      data: {
        isEdit: false,
        codigoReporte: this.selected.codigoReporte,
        descripcionReporte: this.selected.descripcionReporte,
        codigoColumna: this.selected.codigoColumna,
        descripcionReporteColumna: this.selected.descripcionReporteColumna,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result;
      if (this.isExist) {
        this.listDet3.search();
      }
    });
  }

  deleteDetalle(row:any) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: { isExist: false, isDelete: true },
      disableClose: true,
      autoFocus: true,
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result.event.isExist;
      if (this.isExist) {
        this.apiForm.model.id = row.idReporteColumnaDetalle;
        this.apiForm.model.estado = "0";
        
        this.apiForm.consume("updateFieldEstadoDetalle", this.apiForm.model, (data:any) => {
          if (data.codigo == 0) this.apiForm.message("eliminar");
          
          this.listDet3.search();
        });
      }
    });
  }

}

