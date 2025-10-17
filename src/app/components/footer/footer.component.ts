import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  enviarCorreo(event: MouseEvent) {
    event.preventDefault();

    const email = 'erlantzcg89@gmail.com';
    const asunto = '';
    const cuerpo = '';

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

    // Detección simple: Chrome o Edge tienden a tener Gmail configurado
    const usaGmail = navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Edg');

    if (usaGmail) {
      window.open(gmailLink, '_blank');
    } else {
      window.location.href = mailtoLink;
    }
  }
}
