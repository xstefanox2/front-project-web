import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public hidePassword: boolean = true;
  public loading: boolean = false;

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
      Validators.minLength(6),
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(100),
    ]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  login() {
    this.loading = true;
    const { email, password } = this.form.value;
    this.authService
      .login(email, password)
      .pipe(
        tap(() => this.router.navigate(['dashboard'])),
        catchError((error) => {
          console.log(error);
          this.snackbar.open(error.error, 'close', {
            duration: 20000,
            panelClass: ['error-snack'],
          });
          return of(null);
        })
      )
      .subscribe({
        complete: () => (this.loading = false),
      });
  }
}
