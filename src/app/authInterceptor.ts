import {  HttpInterceptorFn, HttpRequest } from '@angular/common/http';


    export const AuthInterceptor : HttpInterceptorFn = (req,next) =>{
        console.log("Inside interceptor")
        const userToken  = localStorage.getItem('token');

            const tokenReq: HttpRequest<any> = req.clone( {
              setHeaders: {
                Authorization: `Bearer ${ userToken }`
              }
            } );
            return next(tokenReq);
          }
     