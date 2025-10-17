import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForoService, Categoria, Topic, Mensaje } from '../../services/foro.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.css']
})
export class ForoComponent implements OnInit {
  categorias: Categoria[] = [];
  topics: Topic[] = [];
  mensajes: Mensaje[] = [];
  loading = false;
  error = '';

  constructor(private foroService: ForoService) {}

  ngOnInit() {
    this.loadData();
  }

  // Cargar categorías, topics y mensajes
  loadData() {
    this.loading = true;
    this.error = '';

    this.foroService.getCategorias().subscribe({
      next: (cats) => {
        this.categorias = cats.sort((a, b) => a.id - b.id);
        this.loadTopicsYMensajes();
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        this.error = 'No se pudieron cargar las categorías';
        this.loading = false;
      }
    });
  }

  loadTopicsYMensajes() {
    this.foroService.getTopics().subscribe({
      next: (topics) => {
        this.topics = topics.sort((a, b) => b.id - a.id);

        // Luego cargamos los mensajes
        this.foroService.getMensajes().subscribe({
          next: (mensajes) => {
            this.mensajes = mensajes;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error al cargar mensajes', err);
            this.error = 'No se pudieron cargar los mensajes';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar topics', err);
        this.error = 'No se pudieron cargar los topics';
        this.loading = false;
      }
    });
  }

  // Obtener los topics de una categoría
  getTopicsByCategoria(catId: number): Topic[] {
    return this.topics.filter(t => t.categoria.id === catId);
  }

  // Contar los mensajes asociados a un topic
  getMensajesCountByTopic(topicId: number): number {
    return this.mensajes.filter(m => m.topic.id === topicId).length;
  }

  // Capitalizar primera letra
  capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
