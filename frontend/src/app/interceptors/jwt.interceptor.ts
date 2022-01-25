import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SessionService } from '../services/auth/session.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private sessionService: SessionService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let user = this.sessionService.getCurrentUser();

    //Caso seja o login, lidar com o response para definir o header
    if (request.url === `${environment.endpoint}login`) {
      return next.handle(request).pipe(map((event: HttpEvent<any>) => {

        if (event instanceof HttpResponse) {
          // console.log('Response-Login', event);
          const token = event.headers.get('x-access-token');
          if (token) {
            let user = { id: event.body.id, name: event.body.name, role: event.body.role, expiresAt: event.body.expiresAt, token };

            //Definir o User para depois, e colocar o seu token definido no interceptor
            localStorage.setItem('user', JSON.stringify(user));
            document.cookie = `x-access-token=${token}`
          }
        }
        return event;
      }))
    }

    //Colocar o token no header para os restantes pedidos, para caso seja gerado um novo token a cada pedido
    if (user != {} && user.token) {

      document.cookie = `x-access-token=${user.token}`
      request = request.clone({
        // withCredentials: true,
        setHeaders: {
          'x-access-token': user.token,
        }
      });
    }
    return next.handle(request);

  }
}