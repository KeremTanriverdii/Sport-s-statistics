import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true,
})
export class LoginComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  errorMessage: string | null = null;

  form = this.fb.nonNullable.group({
    email: ["", Validators.required],
    password: ["", Validators.required]
  })

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    this.authService.login(rawForm.email, rawForm.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/')
        },
        error: (err) => {
          this.errorMessage = err.code
        }
      })
    console.log('register with: ')
  }
}
