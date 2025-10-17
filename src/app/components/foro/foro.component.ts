import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForoService, Categoria, Topic } from '../../services/foro.service';
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
  loading = false;
  error = '';

  constructor(private foroService: ForoService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = '';

    // Cargar categorías y topics en paralelo
    this.foroService.getCategorias().subscribe({
      next: (cats) => {
        this.categorias = cats.sort((a, b) => a.id - b.id);
        this.loadTopics();
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        this.error = 'No se pudieron cargar las categorías';
        this.loading = false;
      }
    });
  }

  loadTopics() {
    this.foroService.getTopics().subscribe({
      next: (topics) => {
        // Orden descendente por id
        this.topics = topics.sort((a, b) => b.id - a.id);
        this.loading = false;
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

  // Capitalizar primera letra
  capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
