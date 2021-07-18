import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})
export class DialogConfirmComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }

  text:any;
  emphasis: any;

  ngOnInit(): void {
    this.text = "¿Está seguro de que quiere realizar esta acción?";
    if(this.data.isDelete != null){
      if(this.data.isDelete){
        if(this.data.messageDelete != null){
          this.text = this.data.messageDelete;
          if(this.data.messageEmphasis != null){
            this.emphasis = this.data.messageEmphasis;
          }
        }else{
          this.text = "¿Está seguro de eliminar este registro?";
        }
      }
    }

    if(this.data.isLoading != null){
      if(this.data.isLoading){
        this.text = "Cargando Información...";
        
        if(this.data.isSaving != null){
          if(this.data.isSaving){
            this.text = "Guardando Información...";
          }
        }
      }
    }

    if(this.data.isError != null){
      if(this.data.errorMessage){
        this.text = "Error: " + this.data.errorMessage;
      }
    }
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

}
