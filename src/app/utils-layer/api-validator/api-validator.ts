import { keyframes } from "@angular/animations";
import { Injectable } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { throwError } from "rxjs";
import { environment } from '../../../environments/environment';
import { ValidatorFn, AbstractControl, Validators } from '@angular/forms';

export function optionalValidator(validators?: (ValidatorFn | null | undefined)[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
      return control.value ? Validators.compose(validators)(control) : null;
  };
}

@Injectable({
    providedIn: "root"
})
export class ApiValidator{
    type:any;
    constructor(){
      this.type = [
        "number",
        "alpha",
        "decimal",
        "text",
        "address",
        "date",
        "alphanumeric",
        "email",
        "name"
      ]
    }
  
    keyPress(_event:any, _type:any, _recursive?:any):boolean{
      var returned:boolean = false;
      
      for(let i of _type){
        if(i == this.type[0]){//number
          if((_event.code == "Digit0" && _event.key.toString() == "0")
          || (_event.code == "Digit1" && _event.key.toString() == "1")
          || (_event.code == "Digit2" && _event.key.toString() == "2")
          || (_event.code == "Digit3" && _event.key.toString() == "3")
          || (_event.code == "Digit4" && _event.key.toString() == "4")
          || (_event.code == "Digit5" && _event.key.toString() == "5")
          || (_event.code == "Digit6" && _event.key.toString() == "6")
          || (_event.code == "Digit7" && _event.key.toString() == "7")
          || (_event.code == "Digit8" && _event.key.toString() == "8")
          || (_event.code == "Digit9" && _event.key.toString() == "9")
          || _event.code == "Numpad0"
          || _event.code == "Numpad1"
          || _event.code == "Numpad2"
          || _event.code == "Numpad3"
          || _event.code == "Numpad4"
          || _event.code == "Numpad5"
          || _event.code == "Numpad6"
          || _event.code == "Numpad7"
          || _event.code == "Numpad8"
          || _event.code == "Numpad9"
          ){
            returned = true;
            break;
          }
        }else if(i == this.type[1]){//alpha
          if(_event.code == "KeyA"
            || _event.code == "KeyB"
            || _event.code == "KeyC"
            || _event.code == "KeyD"
            || _event.code == "KeyE"
            || _event.code == "KeyF"
            || _event.code == "KeyG"
            || _event.code == "KeyH"
            || _event.code == "KeyI"
            || _event.code == "KeyJ"
            || _event.code == "KeyK"
            || _event.code == "KeyL"
            || _event.code == "KeyM"
            || _event.code == "KeyN"
            || _event.code == "KeyO"
            || _event.code == "KeyP"
            || _event.code == "KeyQ"
            || _event.code == "KeyR"
            || _event.code == "KeyS"
            || _event.code == "KeyT"
            || _event.code == "KeyU"
            || _event.code == "KeyV"
            || _event.code == "KeyW"
            || _event.code == "KeyX"
            || _event.code == "KeyY"
            || _event.code == "KeyZ"
            || _event.code == "Semicolon"
          ){
            returned = true;
            break;
          }
        }else if(i == this.type[2]){//decimal
          if(_event.code == "Period"
          || _event.code == "NumpadDecimal") {
            returned = true;
            break;
          }else{
            returned = this.keyPress(_event, ["number"], true)
          }
        }else if(i == this.type[3]){//text
          if(_event.key.toString() == "*"
          || _event.key.toString() == "#"
          || _event.key.toString() == "-"
          || _event.key.toString() == "_"
          || _event.code == "Space"){
            returned = true;
            break;
          }else{
            returned = this.keyPress(_event, ["number", "alpha"], true);
          }
        }else if(i == this.type[4]){//address
          if(_event.key.toString() == "*"
          || _event.key.toString() == "#"
          || _event.key.toString() == "-"
          || _event.key.toString() == "_"
          || _event.code == "Space"){
            returned = true;
            break;
          }else{
            returned = this.keyPress(_event, ["number", "alpha"], true);
          }
        }else if(i == this.type[5]){//date
          if(_event.key.toString() == "/"
          || _event.key.toString() == "-"){
            returned = true;
            break;
          }else{
            returned = this.keyPress(_event, ["number"], true);
          }
        }else if(i == this.type[6]){//alphanumeric
          returned = this.keyPress(_event, ["decimal", "text"], true);
        }else if(i == this.type[7]){//email
          if(_event.key.toString() == "@"){
            returned = true;
            break;
          }else{
            returned = this.keyPress(_event, ["decimal", "alpha"], true);
          }
        }else if(i == this.type[8]){//name
          if(_event.code == "Space"){
            returned = true;
            break;
          }else{
            returned = this.keyPress(_event, ["alpha"], true);
          }
        }
      }

      if(_recursive == null){
        _event.returnValue = returned;
      }
      return returned;
    }

    regularExpression(_type:any, _integer?:any, _decimal?:any):any{
      var returned:string = "";
      
      for(let i of _type){
        if(i == this.type[0]){//number
          returned = "^[0-9]*$";
        }else if(i == this.type[1]){//alpha
          returned = '^[a-ñzA-ÑZáéíóúÁÉÍÓÚ]*$';
        }else if(i == this.type[2]){//decimal
          returned = "^[0-9\.]*$";
        }else if(i == this.type[3]){//text
          returned = '^[a-ñzA-ÑZáéíóúÁÉÍÓÚ0-9.\\-\\_\\#\\* ]*$';
        }else if(i == this.type[4]){//address
          returned = '^[a-ñzA-ÑZáéíóúÁÉÍÓÚ0-9.\\-\\_\\#\\* ]*$';
        }else if(i == this.type[5]){//date
          returned = "^[0-9]{4}\\-[0-9]{2}\\-[0-9]{2}$";
        }else if(i == this.type[6]){//alphanumeric
          returned = '^[a-ñzA-ÑZáéíóúÁÉÍÓÚ0-9\\. ]*$';
        }else if(i == this.type[7]){//email
          returned = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}'
        }else if(i == this.type[8]){//name
          returned = '^[a-ñzA-ÑZ ]*$';
        }
      }
      return returned;
    }

    patternMessage(_type:any, _integer?:any, _decimal?:any):string{
      var returned:string = "Debe tener un formato correcto (";
      var returnedAux:string = "";
      
      for(let i of _type){
        if(i == this.type[0]){//number
          returnedAux += (returnedAux != "" ? " o n" : "N") + "úmeros 0-9";
        }else if(i == this.type[1]){//alpha
          returnedAux += (returnedAux != "" ? " o l" : "L") + "etras a-Z";
        }else if(i == this.type[2]){//decimal
          returnedAux += (returnedAux != "" ? " o n" : "N") + "úmeros 0-9, o punto decimal";
        }else if(i == this.type[3]){//text
          returnedAux += (returnedAux != "" ? " o l" : "L") + "etras a-Z, números 0-9, punto, espacio, guión, subguión, o numeral";
        }else if(i == this.type[4]){//address
          returnedAux += (returnedAux != "" ? " o l" : "L") + "etras a-Z, números 0-9, punto, espacio, guión, subguión, o numeral";
        }else if(i == this.type[5]){//date
          returnedAux += (returnedAux != "" ? " o n" : "N") + "úmeros 0-9, barra de división, o guión";
        }else if(i == this.type[6]){//alphanumeric
          returnedAux += (returnedAux != "" ? " o l" : "L") + "etras a-Z, números 0-9, puntos o espacios";
        }else if(i == this.type[7]){//email
          returnedAux += (returnedAux != "" ? " o f" : "F") + "ormato correo electrónico";
        }else if(i == this.type[8]){//name
          returnedAux += (returnedAux != "" ? " o l" : "L") + "etras a-Z, o espacio";
        }
      }

      returned += returnedAux + ")";
      return returned;
    }
  }