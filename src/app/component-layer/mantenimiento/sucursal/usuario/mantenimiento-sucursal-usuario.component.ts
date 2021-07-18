import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { DialogConfirmComponent } from '../../../../component-layer/utils/dialog-confirm/dialog-confirm.component';
import { MantenimientoSucursalUsuarioService } from '../../../../service-layer/mantenimiento/sucursal/mantenimiento-sucursal-usuario.service';
import { MantenimientoSucursalUsuarioModel } from '../../../../model-layer/mantenimiento/sucursal/mantenimiento-sucursal-usuario.model';
import { ApiTable } from 'src/app/utils-layer/api-table/api-table';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiValidator } from 'src/app/utils-layer/api-validator/api-validator';
import { ApiLoading } from 'src/app/utils-layer/api-loading/api-loading';

@Component({
  selector: 'mantenimiento-sucursal-usuario',
  templateUrl: './mantenimiento-sucursal-usuario.component.html',
  styleUrls: ['./mantenimiento-sucursal-usuario.component.css']
})
export class MantenimientoSucursalUsuarioComponent implements OnInit {
  apiForm: ApiForm;
  apiValidator: ApiValidator;
  apiLoading: ApiLoading;
  list: ApiTable;

  isExist: boolean = null;

  tempUser = [];
  tempUserOptions = [];

  constructor(
    public dialogRef: MatDialogRef<MantenimientoSucursalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private _mantenimientoSucursalUsuarioService: MantenimientoSucursalUsuarioService,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    public datepipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.apiValidator = new ApiValidator();
    
    this.apiForm = new ApiForm();
    this.apiForm.service = this._mantenimientoSucursalUsuarioService;
    this.apiForm.formBuilder = this.formBuilder;    
    this.apiForm.datepipe = this.datepipe;
    this.apiForm.formSnackBar = this.matSnackBar;    
    this.apiForm.model = new MantenimientoSucursalUsuarioModel();
    this.apiForm.model.codigoSucursal = this.data.codigo;
    this.apiForm.model.usrCre = this.apiForm.model.usrMod = "SRP";

    this.route.paramMap.subscribe(params => {
      if(params["params"]["id"] != null){
        this.data.codigo = params["params"]["id"];
        this.data.isEdit = true;
      }
    });    
    this.apiForm.fields = {
      codigoUsuario: ['', [Validators.pattern(this.apiValidator.regularExpression(["text"]))]],
      codigoSucursal: ['', []],
      listaUsuarios: [[], ""]
    };    
    this.apiForm.mapping = ({
      codigoUsuario: "codigoUsuario"
    });
    this.apiForm.mappingToForm = () => {
    }
    this.apiForm.mappingToModel = () => {
      this.apiForm.model.listaUsuarios = this.apiForm.formGroup.value.listaUsuarios
    }
    this.apiForm.build();
    
    this._mantenimientoSucursalUsuarioService.filterObj.codigoSucursal = this.data.codigo;
    this._mantenimientoSucursalUsuarioService.filterObj.estado = null;
    this.list = new ApiTable();
    this.list.columns = ['Código', 'Nombre Completo', 'eliminar'];
    this.list.service = this._mantenimientoSucursalUsuarioService;
    this.list.method = "page";
    this.list.resultMap = {
      "source": "listaSucursalUsuario",
      "length": "totalRegistros"
    };
    this.list.sort = {
      "column": "codigoUsuario",
      "direction": "asc"
    }
    this.list.search();
    
    this.apiLoading = new ApiLoading();
    this.apiLoading.dialog = this.dialog;
  }

  ngOnInit(): void {    
    this.apiLoading.errorCallback = (() => {
    });
    
    this.apiLoading.loadCallback = (() => {
      this.apiLoading.close();
    });
    
    this.apiLoading.show();
  }

  action() {
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
            if (data.codigo != 0) {
              this.apiForm.message(data);
            }else{
              this.apiForm.getField("codigoSucursal").setValue('');
              this.apiForm.getField("listaUsuarios").setValue([]);
              this.tempUser = [];

              this.apiForm.message("guardar");
              this.list.search();
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
  
  delete(row:any) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: {
        isExist: false
      },
      disableClose: true,
      autoFocus: true,
      panelClass: 'custom-modalbox'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isExist = result.event.isExist;
      if (this.isExist) {        
        row.estado = "0";
        row.id = row.idSucursalUsuario;
        
        this.apiForm.consume("updateFieldEstado", row, (data:any) => {
          if (data.codigo == 0) {
            this.apiForm.message("updateState");
          }
          this.list.search();
        });
      }
    });
  }

  autocomplete() {
    this.tempUserOptions = [];
    
    this._mantenimientoSucursalUsuarioService.filterObj.nombre = this.apiForm.getField("codigoUsuario").value;
    this._mantenimientoSucursalUsuarioService.filterObj.codigoSucursal = this.data.codigo;

    this._mantenimientoSucursalUsuarioService.searchUser().then(
      (data) => {
        if (data.mensaje.codigo == 0) {
          this.tempUserOptions = data.listaUsuario;
        }else{
          this.tempUserOptions = [];
        }
      },
      (err) => { },
    )
  }
  
  closeDialog(value?: any) {
    this.dialogRef.close({ event: value });
  }

  close(): void {
    this.dialogRef.close();
  }
  
  add() {
    let user = this.apiForm.formGroup.value.codigoUsuario;
    if (user == "") {
      this.apiForm.message("validacionCodigoUsuario");
      return;
    }
    this.tempUser.push(user);
    this.apiForm.getField("codigoUsuario").setValue('');
    
    this.apiForm.getField("listaUsuarios").setValue(this.tempUser);
  }
}