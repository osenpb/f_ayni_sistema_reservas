import { Routes } from '@angular/router';
import { ListReservaComponent } from './pages/list-reserva/list-reserva.component';
import { EditReservaComponent } from './pages/edit-reserva/edit-reserva.component';

export const reservaRoutes: Routes = [
  {
    path: 'list',
    component: ListReservaComponent,
  },
  {
    path: 'editar/:id',
    component: EditReservaComponent,
  },
];

export default reservaRoutes;
