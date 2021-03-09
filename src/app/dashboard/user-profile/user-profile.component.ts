import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  public loading: boolean = false;
  public hidePassword: boolean = true;
  public currentUser: User | null = null;

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      Validators.minLength(6),
      Validators.email,
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      Validators.minLength(4),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      Validators.minLength(4),
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      Validators.minLength(6),
    ]),
    // password: new FormControl('', [
    //   Validators.required,
    //   Validators.maxLength(100),
    //   Validators.minLength(6),
    // ]),
    birthDate: new FormControl(new Date()),
    phoneNumber: new FormControl(''),
    favoriteColor: new FormControl(''),
    country: new FormControl('')
  });

  constructor(
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      this.form.reset(user);
    });
  }

  updateUser(): void {
    this.authService
      .updateUser({
        ...this.currentUser,
        ...this.form.value,
      })
      .subscribe({
        next: (msg) => {
          this.snackbar.open(msg as string, 'OK', {
            duration: 10000,
          });
        },
      });
  }

  deleteUser(): void {
    this.authService
      .deleteUser(this.currentUser as User)
      .pipe(
        catchError((error) => {
          console.log(error);
          this.snackbar.open('Ha ocurrido un error al eliminar.', 'Cerrar', {
            duration: 10000,
            panelClass: ['error-snack'],
          });
          return of(null);
        })
      )
      .subscribe({
        next: () => this.router.navigate(['/']),
      });
  }
}
