import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CabeceraService {
  private _viewState = new BehaviorSubject<'login' | 'register' | 'none'>('login');
  viewState$ = this._viewState.asObservable();

  setViewState(state: 'login' | 'register' | 'none') {
    this._viewState.next(state);
  }
}
