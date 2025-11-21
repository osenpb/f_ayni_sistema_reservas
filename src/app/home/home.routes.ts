import { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home-page/home-page.component";

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  // {
  //   path: 'reservar',
  //   component: ReservaPageComponent
  // }
]

export default homeRoutes;
