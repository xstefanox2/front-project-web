import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public hidePassword: boolean = true;
  public loading: boolean = false;

  public form: FormGroup = new FormGroup(
    {
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
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
        Validators.minLength(6),
      ]),
      birthDate: new FormControl(new Date()),
    },
    this.validatePassword as ValidatorFn
  );

  constructor(
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  register(): void {
    this.loading = true;
    this.authService
      .register({
        ...this.form.value,
      })
      .pipe(
        mergeMap(() => this.authService.setUser()),
        tap(() => this.router.navigate(['/dashboard'])),
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

  validatePassword(group: FormGroup) {
    const control = group.controls['password'];
    const matchingControl = group.controls['confirmPassword'];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ notEqual: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}
