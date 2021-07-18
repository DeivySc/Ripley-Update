import { Injectable } from "@angular/core";
import { throwError } from 'rxjs';
import { FormControl, FormGroup } from "@angular/forms";
import * as moment from "moment";

@Injectable({
    providedIn: "root"
})
export class ApiForm{
    declare service:any;
    declare formGroup:FormGroup;
    declare formBuilder:any;
    declare formSnackBar:any;
    declare model:any;
    declare fields:any;
    declare mapping:any;
    declare mappingToForm:any;
    declare mappingToModel:any;
    declare datepipe:any;
    declare errorCallback:any;
  
    constructor(){
      this.mappingToForm = () => {};
      this.mappingToModel = () => {};
    }
  
    consume(method:any, param:any, callback:any):void{
      this.service[method](param).then(
        (data:any) => {
          if(data != null){
            if(callback != null){
              callback(data);
            }
          }
        }
      ).catch((error:any) => {
        console.log(error);
        if(this.errorCallback != null){
          this.errorCallback(error);
        }
        throwError(error);
      });
    }
    
    build():void{
      this.formGroup = this.formBuilder.group(this.fields, {
        validators: this.validate
      });
    }
    
    rebuild(_fields):void{
      this.formGroup = this.formBuilder.group(_fields, {
        validators: this.validate
      });
    }
  
    getField(key:string):any{
      return this.formGroup.get(key);
    }
  
    toForm(): void {
      let obj:any = {};
      for(let k of Object.keys(this.mapping)){
        obj[k] = this.model[this.mapping[k]];
      }
      this.formGroup.patchValue(obj);
    }
  
    toModel(): void {
      for(let k of Object.keys(this.mapping)){
        this.model[this.mapping[k]] = this.formGroup.value[k];
      }
    }
  
    validate(form: FormControl){
      for(let k of Object.keys(form["controls"])){
        if(form["controls"][k]["validator"] != null){
          if(form.get(k).value == "" && form.get(k).touched){
            return { validationForm: true };
          }
        }
      }
      
      return null;
    }
    
    reorderDateToInsert(json: any) {
      let datee = json.date.toString().length == 2 ? json.date : `0${json.date.toString()}`;
      let month = json.month.toString().length == 2 || json.month == 9? json.month + 1 : `0${(json.month + 1).toString()}`;
      return `${json.year.toString()}-${month}-${datee}`;
    }
  
    reorderDateToUpdate(string: any) {
      let split = string.split("/");
      let temp = `${split[2]}-${split[1]}-${split[0]}`;
      let date = new Date(moment.utc(temp).utc().format("YYYY-MM-DD HH:mm"));
      
      return date;
    }
  
    convertDateToString(date:any) {
      return this.datepipe.transform(date, 'yyyy-MM-dd');
    }
    
    clean() {
      this.formGroup.reset();
    }
  
    message(data: any) {
      let message: string;
      
      if (data == "guardar") {
        message = "Registro guardado satisfactoriamente.";
        this.openSnackBar(message, '', 'success-snackbar');
      } else if (parseInt(data.codigo) == 1) {
        message = "Ocurrió un error, comunicarse con el administrador.";
        this.openSnackBar(message, '', 'danger-snackbar', 5000);
      } else if (parseInt(data.codigo) == 2) {
        message = "Registro no encontrado.";
        this.openSnackBar(message, '', 'warning-snackbar');
      } else if (parseInt(data.codigo) == 3) {
        message = "Registro ya existe, favor de ingresar otro código.";
        this.openSnackBar(message, '', 'warning-snackbar');
      } else if (parseInt(data.codigo) == 4) {
        message = data.message != null ? data.message : data.mensaje;
        this.openSnackBar(message, '', 'warning-snackbar');
      } else if (data == "obtener") {
        message = "Registro encontrado satisfactoriamente.";
        this.openSnackBar(message, '', 'info-snackbar');
      } else if (data == "actualiza") {
        message = "Registro actualizado satisfactoriamente.";
        this.openSnackBar(message, '', 'success-snackbar');
      } else if (data == "seleccion"){
        message = "Debe seleccionar al menos una opción"
        this.openSnackBar(message, '', 'warning-snackbar');
      } else if (data == "codigoinvalido"){
        message = "Debe ingresar un código válido"
        this.openSnackBar(message, '', 'warning-snackbar');
      } else if (data == "eliminar"){
        message = "El registro ha sido eliminado."
        this.openSnackBar(message, '', 'success-snackbar');
      }
    }
  
    openSnackBar(message?: string, action?: string, styleClass?: string, duration?: number) {
      this.formSnackBar.open(message, action, {
        duration: duration ? duration : 5000,
        horizontalPosition: "right",
        verticalPosition: "top",
        panelClass: [styleClass]
      });
    }
  }