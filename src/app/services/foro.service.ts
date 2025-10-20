import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Topic {
  id: number;
  nombre: string;
  categoria: Categoria;
}

export interface Usuario {
  id: number;
  username: string;
  password: string | null;
  email: string;
  roles: string[] | null;
}

export interface Mensaje {
  id: number;
  contenido: string;
  topic: Topic;
  usuario: Usuario;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class ForoService {
  private readonly API_URL = 'http://192.168.1.130:8080/api/foro';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.API_URL}/categorias`);
  }

    getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.API_URL}/topics`);
  }

  getTopicById(id: number): Observable<Topic> {
  return this.http.get<Topic>(`${this.API_URL}/topics/${id}`);
}

    getMensajes(): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.API_URL}/mensajes`);
  }

    crearMensaje(contenido: string, topicId: number, usuarioId: number): Observable<Mensaje> {
    const body = {
      contenido,
      topic: { id: topicId },
      usuario: { id: usuarioId }
    };
    return this.http.post<Mensaje>(`${this.API_URL}/mensaje`, body);
  }

    crearTopic(nombre: string, categoriaId: number): Observable<Topic> {
    const body = {
      nombre,
      categoria: { id: categoriaId }
    };
    return this.http.post<Topic>(`${this.API_URL}/topic`, body);
  }
}
