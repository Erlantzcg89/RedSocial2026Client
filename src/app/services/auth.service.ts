import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8080/api/auth/';

export interface JwtPayload {
  sub: string;  // username
  id: number;
  email: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<JwtPayload | null>(this.getUserFromToken());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(API_URL + 'login', credentials).pipe(
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          const user = jwtDecode<JwtPayload>(res.token);
          console.log(user)
          this.userSubject.next(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  register(user: any): Observable<any> {
    return this.http.post(API_URL + 'register', user);
  }

  test(): Observable<string> {
    return this.http.get(API_URL + 'test', { responseType: 'text' });
  }

  private getUserFromToken(): JwtPayload | null {
    const token = localStorage.getItem('token');
    return token ? jwtDecode<JwtPayload>(token) : null;
  }
}
