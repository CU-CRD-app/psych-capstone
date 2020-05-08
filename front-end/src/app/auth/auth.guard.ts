import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router : Router, public http : HttpClient, public nativeStorage : NativeStorage) {}
  
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    if (localStorage.getItem("token")) {

      return this.checkLogin().pipe(map(res => {
        if (!res) {
          this.router.navigate(['/login']);
          localStorage.removeItem("token")
        }
        return res;
      }));

    } else {

      this.router.navigate(['/login']);
      localStorage.removeItem("token")
      return of(false);

    }
  }

  checkLogin() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.put("https://crossfacerecognition.herokuapp.com/checktoken/", {}, httpOptions)
      .pipe(map((res) => true))
      .pipe(catchError((err) => of(false)));
  }

}
