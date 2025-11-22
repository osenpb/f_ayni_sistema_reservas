import { Routes } from "@angular/router";
import { ListHotelComponent } from "./pages/list-hotel/list-hotel.component";

export const hotelAdminRoutes: Routes = [
  {
    path: 'list',
    component: ListHotelComponent
  }
]

export default hotelAdminRoutes;
