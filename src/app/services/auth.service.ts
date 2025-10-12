import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(API_URL + 'login', credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(API_URL + 'register', user);
  }

  // Test simplificado, sin JWT
  test(): Observable<string> {
    return this.http.get(API_URL + 'test', { responseType: 'text' });
  }
}
