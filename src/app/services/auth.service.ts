import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

const API_URL = 'http://localhost:8080/api/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(API_URL + 'login', credentials).pipe(
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', credentials.username);
          this.userSubject.next(credentials.username);
        }
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(API_URL + 'register', user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.userSubject.next(null);
  }

  test(): Observable<string> {
    return this.http.get(API_URL + 'test', { responseType: 'text' });
  }
}
