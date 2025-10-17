import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8080/api/auth/';

export interface JwtPayload {
  sub: string;
  id: number;
  email: string;
  role: string;
  exp: number; // timestamp en segundos
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<JwtPayload | null>(this.getUserFromToken());
  public user$ = this.userSubject.asObservable();
  private logoutTimer: any;

  constructor(private http: HttpClient) {
    this.initAutoLogout();
  }

  login(credentials: any): Observable<any> {
    return this.http.post(API_URL + 'login', credentials).pipe(
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          const user = jwtDecode<JwtPayload>(res.token);
          this.userSubject.next(user);
          this.scheduleAutoLogout(user);
        }
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(API_URL + 'register', user).pipe(
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          const userPayload = jwtDecode<JwtPayload>(res.token);
          this.userSubject.next(userPayload);
          this.scheduleAutoLogout(userPayload);
        }
      })
    );
  }

  test(): Observable<string> {
    return this.http.get(API_URL + 'test', { responseType: 'text' });
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getUserFromToken(): JwtPayload | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const user = jwtDecode<JwtPayload>(token);
    this.scheduleAutoLogout(user);
    return user;
  }

  /** Configura un timer para hacer logout antes de que expire el JWT */
  private scheduleAutoLogout(user: JwtPayload) {
    if (this.logoutTimer) clearTimeout(this.logoutTimer);

    const now = Date.now();
    const expMs = user.exp * 1000; // convertir de segundos a ms
    const sessionMs = 45 * 60 * 1000; // 45 minutos
    const timeout = Math.min(sessionMs, expMs - now);

    if (timeout > 0) {
      this.logoutTimer = setTimeout(() => {
        this.logout();
        alert('Tu sesión ha expirado automáticamente');
      }, timeout);
    } else {
      this.logout();
    }
  }

  /** Inicializa auto-logout si hay usuario en localStorage */
  private initAutoLogout() {
    const token = this.getToken();
    if (token) {
      const user = jwtDecode<JwtPayload>(token);
      this.scheduleAutoLogout(user);
    }
  }
}
