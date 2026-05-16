import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation-links',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex flex-col sm:flex-row gap-3 justify-center pb-4">
      <a
        routerLink="/home/mis-reservas"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-bosque-900 hover:bg-bosque-800 text-white text-sm font-semibold rounded-lg transition-all active:scale-[0.97]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        Ver Mis Reservas
      </a>
      <a
        routerLink="/home"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 text-sm font-medium rounded-lg transition-all"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Volver al Inicio
      </a>
    </div>
  `,
})
export class NavigationLinksComponent {

}