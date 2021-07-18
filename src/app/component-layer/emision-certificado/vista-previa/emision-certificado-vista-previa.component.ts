import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiForm } from 'src/app/utils-layer/api-form/api-form';
//import { EmisionCertificado } from '../model/emision-certificado';
//import { ConfirmEmisionComponent } from '../confirm-emision/confirm-emision.component';
//import { EmisionCertificadoService } from '../service/emision-certificado.service';
import { SrpFileManager } from 'src/app/shared/util/fileExport';
import { SrpEncryption } from 'src/app/shared/util/srpEncyption';
import { EmisionCertificadoService } from 'src/app/service-layer/emision-certificado/emision-certificado.service';
import { ModalErrorVistaPreviaComponent } from '../modal-error/modal-error-vista-previa.component';

@Component({
  selector: 'app-emision-certificado-vista-previa',
  templateUrl: './emision-certificado-vista-previa.component.html',
  styleUrls: ['./emision-certificado-vista-previa.component.css']
})
export class EmisionCertificadoVistaPreviaComponent implements OnInit {

  model:any = {};
  date = new Date();
  isExist: boolean = null;
  param: any;
  apiForm: ApiForm;
  constructor(
    public dialogRef: MatDialogRef<EmisionCertificadoVistaPreviaComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    //private _emisionCertificadoService: EmisionCertificadoService,
    private srpFileManager: SrpFileManager,
    private srpEncryption: SrpEncryption,
    private _service: EmisionCertificadoService,
  ) {

    this.apiForm = new ApiForm(); 
    this.apiForm.service = this._service;
    if(this.data){
      this.model = this.data.jsonVistaPrevia;
      this.param = this.data.param;
    }
   }

  ngOnInit(): void {

  }

  emitir(){

    let paramEmitir = {
      codigo:this.param.codigo,
      observacion:this.param.observacion,
      valorado:this.param.valorado, 
      descValorado:this.param.descValorado,
      sucursal:this.param.sucursal, 
      puntosDescuento:this.param.puntosDescuento,
      establecimiento:this.param.establecimiento, 
      tipoTarjeta:this.param.tipoTarjeta
    };

    this.apiForm.consume("certificadoEmitir", paramEmitir, (data:any) => {
      if(data.codigoCertificado != null){
        let emitirPdf = {
          nroDocumento: this.param.nroDocumento,
          nroCuenta: this.param.nroCuenta,
          puntos: this.param.puntosDescuento,
          valorado: this.param.descValorado,
          codigoCertificado: data.codigoCertificado,
          valorCertificado: data.valorCertificado,
          cliente: this.param.cliente,
          descripcionSucursal: this.param.descripcionSucursal,
          codigo:this.param.codigo
        }
        this.apiForm.consume("certificadoEmitirPDF", emitirPdf, (data:any) => {
          if(data != null){
            this.srpFileManager.downloadFileFromBase64(data.statusResponseBody);
            this.onClose();
          }
        });

      }else
        this.onClose();
        const dialogRef = this.dialog.open(ModalErrorVistaPreviaComponent, {
          width: '600px',
          height: '320px',
          data: {
            mensajeRespuesta: data.mensaje
          },
          panelClass: '',
          disableClose: true,
          autoFocus: true
        });
      
    });
  }

  cancel(): void {
    this.data.isExist = false;
    this.closeDialog(this.data);
  }

  toAccept() {
    this.data.isExist = true;
    this.closeDialog(this.data);
  }

  closeDialog(value?: any) {
    this.dialogRef.close({ event: value });
  }

  onClose() {
    this.dialogRef.close();
  }

  /**
   * Método que permite mostrar mensajes en base a las acciones del usuario
   * @param data mensaje de respuesta del endpoint
   */
  messageInformation(data: any) {
    let message: string;
    if (parseInt(data.codigo) == 0) {
      message = "Registro agregado satifactoriamente.";
      this.openSnackBar(message, '', 'success-snackbar');
    } else if (parseInt(data.codigo) == 1) {
      message = "Ocurrió un error, comunicarse con el administrador.";
      this.openSnackBar(message, '', 'danger-snackbar', 5000);
    } else if (parseInt(data.codigo) == 3) {
      message = "Registro ya existe, favor de ingresar otro código.";
      this.openSnackBar(message, '', 'warning-snackbar');
    } else if (data == "updateState") {
      message = "Registro eliminado satifactoriamente.";
      this.openSnackBar(message, '', 'info-snackbar');
    }
  }

  /**
   * Método que permite mostrar el Snackbar
   * @param message Lo que se va a mostrar
   * @param action
   * @param styleClass Tipo de estilo del mensaje
   */
  openSnackBar(message?: string, action?: string, styleClass?: string, duration?: number) {
    this.matSnackBar.open(message, action, {
      duration: duration ? duration : 2000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: [styleClass]
    });
  }

}
