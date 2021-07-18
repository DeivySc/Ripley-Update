import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private obj = new Subject();
  currentMessage = this.obj.asObservable();
  constructor() { }

  settingValues(item: any) {
    this.obj.next(item)
  }

}
