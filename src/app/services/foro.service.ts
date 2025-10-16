import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categoria {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class ForoService {
  private readonly API_URL = 'http://localhost:8080/api/foro';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.API_URL}/categorias`);
  }
}
