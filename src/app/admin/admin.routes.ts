import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./layout/admin-layout/admin-layout.component";
import { DashboardPageComponent } from "./pages/dashboard-page/dashboard-page.component";

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardPageComponent // esta sera una pagina x defecto, podria mostrar estadisticas
      },
      {
        path: 'hotel',
        loadChildren: () => import('./hotel/hotel.routes').then(m => m.hotelAdminRoutes)
      }
    ]
  }
]

export default adminRoutes;
