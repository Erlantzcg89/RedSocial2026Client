// mensajes.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ForoService, Mensaje, Topic } from '../../services/foro.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, JwtPayload } from '../../services/auth.service';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit {
  topicId!: number;
  topicNombre = '';
  mensajes: Mensaje[] = [];
  loading = false;
  error = '';
  nuevoMensajeForm!: FormGroup;
  user: JwtPayload | null = null;

  constructor(
    private route: ActivatedRoute,
    private foroService: ForoService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.nuevoMensajeForm = this.fb.group({
      contenido: ['', Validators.required]
    });

    this.authService.user$.subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.topicId = +params['id'];
      this.loadTopic();
      this.loadMensajes();
    });
  }

  loadTopic() {
    this.foroService.getTopicById(this.topicId).subscribe({
      next: (topic: Topic) => {
        this.topicNombre = this.capitalizeFirstLetter(topic.nombre);
      },
      error: (err) => {
        console.error('Error al cargar topic', err);
        this.topicNombre = 'Topic desconocido';
      }
    });
  }

  loadMensajes() {
    this.loading = true;
    this.error = '';

    this.foroService.getMensajes().subscribe({
      next: (msgs: Mensaje[]) => {
        this.mensajes = msgs.filter(m => m.topic.id === this.topicId);
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

  crearMensaje() {
    if (!this.nuevoMensajeForm.valid || !this.user) return;

    const contenido = this.nuevoMensajeForm.value.contenido;

    this.foroService.crearMensaje(contenido, this.topicId, this.user.id).subscribe({
      next: (mensaje: Mensaje) => {
        this.mensajes.push(mensaje); 
        this.nuevoMensajeForm.reset(); 
      },
      error: (err) => {
        console.error('Error al crear mensaje', err);
        this.error = 'No se pudo enviar el mensaje';
      }
    });
  }

  capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

}

