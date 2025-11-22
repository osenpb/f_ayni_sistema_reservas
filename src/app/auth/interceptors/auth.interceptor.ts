import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";


// para transferir entre peticiones http el token del login
export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn) {

  const token = inject(AuthService).token(); // antes habia puesto .token, pero eso devolvia el signal completo, con el parentesis estas llamando al valor interno.

    console.log("INTERCEPTOR, AQUI ESTA EL TOKEN: ", token);

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });
  return next(newReq);
}
