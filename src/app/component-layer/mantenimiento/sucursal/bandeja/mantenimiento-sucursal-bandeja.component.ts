import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../../services/header.service';
import { FormGroup } from '@angular/forms';

import { CrossFieldErrorMatcher } from 'src/app/shared/util/crossFielErrotMatcher';
import { MantenimientoSucursalService } from '../../../../service-layer/mantenimiento/sucursal/mantenimiento-sucursal.service';
import { MantenimientoSucursalFormComponent } from '../form/mantenimiento-sucursal-form.component';
import { ApiTable } from "../../../../utils-layer/api-table/api-table";
import { MatPaginator } from '@angular/material/paginator';
import { MantenimientoSucursalComercioComponent } from '../comercio/mantenimiento-sucursal-comercio.component';
import { MantenimientoSucursalUsuarioComponent } from '../usuario/mantenimiento-sucursal-usuario.component';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'mantenimiento-sucursal-bandeja',
  templateUrl: './mantenimiento-sucursal-bandeja.component.html',
  styleUrls: ['./mantenimiento-sucursal-bandeja.component.css']
})
export class MantenimientoSucursalBandejaComponent implements OnInit {
  list: ApiTable;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;

  title: string = "Mantenimiento de Surcursales";

  isExist: boolean = null;

  errorMatcher = new CrossFieldErrorMatcher();
  
  constructor(
    private _header: HeaderService,
    private _mantenimientoSucursalService: MantenimientoSucursalService,
    public dialog: MatDialog
  ) {
    this.apiValidator = new ApiValidator();
    
    this.list = new ApiTable();
    this.list.columns = ['codigo', 'descripcion', 'ruc', 'estado', 'usuarios', 'comercios', 'editar'];
    this.list.service = this._mantenimientoSucursalService;
    this.list.method = "all";
    this.list.resultMap = {
      "source": "listaSucursal",
      "length": "totalRegistros"
    };
    this.list.sort = {
      "column": "codigo",
      "direction": "desc"
    }
    this.list.sortMap = {
      "codigo": "ID"
    };
    this.list.search();
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
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
    const dialogRef = this.dialog.open(MantenimientoSucursalFormComponent, {
      width: '500px',
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
        this.list.search();
      }
    });
  }

  edit(row:any) {
    const dialogRef = this.dialog.open(MantenimientoSucursalFormComponent, {
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
      }
    });
  }

  user(row:any) {
    this.dialog.open(MantenimientoSucursalUsuarioComponent, {
      width: '850px',
      height: '635px',
      data: {
        isUser: true,
        codigo: row.codigo,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });
  }

  commerce(row:any) {
    this.dialog.open(MantenimientoSucursalComercioComponent, {
      width: '850px',
      height: '635px',
      data: {
        isCommerce: true,
        codigo: row.codigo,
        isExist: false
      },
      panelClass: '',
      disableClose: true,
      autoFocus: true
    });
  }
}

