import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
    null
  );

  constructor(private http: HttpClient) {}

  register(user: User): Observable<string> {
    return this.http.post<string>(environment.API + '/Register', user, {
      responseType: 'text' as 'json',
    });
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<string>(
        environment.API + '/Login',
        {
          email,
          password,
        },
        {
          responseType: 'text' as 'json',
        }
      )
      .pipe(mergeMap(() => this.setUser() as Observable<User>));
  }

  setUser(): Observable<User | null> {
    // return of(this.mockUser).pipe(
    return this.http.get<User>(environment.API + '/User').pipe(
      map(user => ({
        ...user,
        birthDate: new Date(user.birthDate)
      })),
      tap((user) => this.currentUser.next(user)),
      catchError((error) => {
        console.log(error);
        return of(null);
      })
    );
  }

  updateUser(user: User): Observable<string | null> {
    return this.http
      .put<string>(environment.API + '/User', user, {
        responseType: 'text' as 'json',
      })
      .pipe(
        tap(() => this.currentUser.next(user)),
        catchError((error) => {
          console.log(error);
          return of(null);
        })
      );
  }

  deleteUser(user: User): Observable<string | null> {
    return this.http
      .delete<string>(environment.API + '/User?id=' + user.id)
      .pipe(
        tap(() => this.currentUser.next(null)),
        catchError((error) => {
          console.log(error);
          return of(null);
        })
      );
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }
}
