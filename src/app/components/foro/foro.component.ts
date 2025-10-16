import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForoService, Categoria } from '../../services/foro.service';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.css']
})
export class ForoComponent implements OnInit {
  categorias: Categoria[] = [];
  loading = false;
  error = '';

  constructor(private foroService: ForoService) {}

  ngOnInit() {
    this.loadCategorias();
  }

  loadCategorias() {
    this.loading = true;
    this.foroService.getCategorias().subscribe({
      next: (cats) => {
        this.categorias = cats;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        this.error = 'No se pudieron cargar las categorías';
        this.loading = false;
      }
    });
  }
}
