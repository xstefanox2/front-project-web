import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'web2-users';

  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit() {
    this.authService.setUser().pipe(
      tap(user => {
        if (!user) {
          this.route.navigate(['/']);
        }
      })
    ).subscribe();
  }
}
