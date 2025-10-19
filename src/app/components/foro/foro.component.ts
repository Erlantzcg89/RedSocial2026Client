// foro.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // 👈 añadimos Router
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForoService, Categoria, Topic, Mensaje } from '../../services/foro.service';
import { AuthService, JwtPayload } from '../../services/auth.service';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.css']
})
export class ForoComponent implements OnInit {
  categorias: Categoria[] = [];
  topics: Topic[] = [];
  mensajes: Mensaje[] = [];
  loading = false;
  error = '';
  topicMensaje = '';
  user: JwtPayload | null = null;

  nuevoTopicForm!: FormGroup;

  constructor(
    private foroService: ForoService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router // 👈 añadimos Router
  ) {
    this.nuevoTopicForm = this.fb.group({
      nombre: ['', Validators.required],
      categoriaId: [1, Validators.required],
      primerMensaje: ['', Validators.required]
    });

    this.authService.user$.subscribe(user => this.user = user);
  }

  ngOnInit() {
    this.loadData();
  }

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

  getTopicsByCategoria(catId: number): Topic[] {
    return this.topics.filter(t => t.categoria.id === catId);
  }

  getMensajesCountByTopic(topicId: number): number {
    return this.mensajes.filter(m => m.topic.id === topicId).length;
  }

  capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // 🔥 Crear topic y su primer mensaje
  crearTopic() {
    if (this.nuevoTopicForm.invalid || !this.user) return;

    const { nombre, categoriaId, primerMensaje } = this.nuevoTopicForm.value;
    this.loading = true;
    this.topicMensaje = '';

    this.foroService.crearTopic(nombre, categoriaId).subscribe({
      next: (nuevoTopic) => {
        // 1️⃣ Insertar el topic en la lista
        this.topics.unshift(nuevoTopic);

        // 2️⃣ Crear el primer mensaje
        this.foroService.crearMensaje(primerMensaje, nuevoTopic.id, this.user!.id).subscribe({
          next: (mensaje) => {
            this.mensajes.push(mensaje);
            this.topicMensaje = '✅ Topic y primer mensaje creados con éxito';
            this.nuevoTopicForm.reset({ categoriaId: 1 });
            this.loading = false;

            // 🚀 3️⃣ Navegar automáticamente al componente de mensajes
            this.router.navigate(['/foro/mensajes', nuevoTopic.id]);
          },
          error: (err) => {
            console.error('Error al crear primer mensaje', err);
            this.topicMensaje = '⚠️ Topic creado, pero no se pudo crear el primer mensaje';
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error al crear topic', err);
        this.topicMensaje = '❌ Error al crear topic';
        this.loading = false;
      }
    });
  }
}
