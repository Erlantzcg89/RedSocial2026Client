import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ForoService, Mensaje, Topic } from '../../services/foro.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit {
  topicId!: number;
  topicNombre = '';
  mensajes: Mensaje[] = [];
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private foroService: ForoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.topicId = +params['id'];
      this.loadMensajes();
    });
  }

  loadMensajes() {
    this.loading = true;
    this.error = '';

    this.foroService.getMensajes().subscribe({
      next: (msgs) => {
        // Filtrar mensajes por topicId
        this.mensajes = msgs.filter(m => m.topic.id === this.topicId);
        // Obtener el nombre del topic
        if (this.mensajes.length > 0) {
          this.topicNombre = this.mensajes[0].topic.nombre;
        } else {
          this.topicNombre = 'Topic sin mensajes';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar mensajes', err);
        this.error = 'No se pudieron cargar los mensajes';
        this.loading = false;
      }
    });
  }

  formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleString();
  }
}
