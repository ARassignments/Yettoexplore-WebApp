import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export type AuthMode = 'login' | 'register' | 'forgot';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  authMode: AuthMode = 'login';
  returnUrl = '/';

  loginData = {
    email: '',
    password: ''
  };

  registerData = {
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'customer'
  };

  forgotEmail = '';
  isForgotSuccess = false;

  errorMessage = '';
  successMessage = '';
  isLoading = false;
  isGoogleLoading = false;

  get isLoginMode(): boolean {
    return this.authMode === 'login';
  }

  get isRegisterMode(): boolean {
    return this.authMode === 'register';
  }

  get isForgotMode(): boolean {
    return this.authMode === 'forgot';
  }

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    const mode = this.route.snapshot.queryParams['mode'];
    if (mode === 'register') {
      this.authMode = 'register';
    } else if (mode === 'forgot') {
      this.authMode = 'forgot';
    }
  }

  setAuthMode(mode: AuthMode): void {
    this.authMode = mode;
    this.errorMessage = '';
    this.successMessage = '';
    this.isForgotSuccess = false;
  }

  setDemoLogin(role: string): void {
    const creds: Record<string, { email: string; pass: string }> = {
      super_admin: { email: 'admin@yettoexplore.com', pass: 'password123' },
      agency_owner: { email: 'agency@yettoexplore.com', pass: 'password123' },
      agency_agent: { email: 'agent@yettoexplore.com', pass: 'password123' },
      tour_guide: { email: 'guide@yettoexplore.com', pass: 'password123' },
      customer: { email: 'traveler@yettoexplore.com', pass: 'password123' },
    };

    const target = creds[role] || creds['customer'];
    this.loginData.email = target.email;
    this.loginData.password = target.pass;
  }

  quickLogin(role: string): void {
    this.setDemoLogin(role);
    this.onLogin();
  }

  onLogin(): void {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.login(this.loginData).subscribe({
      next: (res) => {
        this.isLoading = false;
        const userRole = res.data?.user?.role || (res as any).user?.role || 'customer';
        this.successMessage = `Login successful as ${userRole.toUpperCase()}! Redirecting...`;
        
        setTimeout(() => {
          const nonCustomerRoles = [
            'super_admin',
            'agency_owner',
            'agency_agent',
            'tour_guide',
            'tour_manager',
            'reservation_agent',
            'agency_accountant',
            'customer_support'
          ];

          if (nonCustomerRoles.includes(userRole)) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigateByUrl(this.returnUrl === '/' ? '/' : this.returnUrl);
          }
        }, 400);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid email or password';
      }
    });
  }

  onGoogleSignIn(): void {
    this.isGoogleLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.loginWithGoogle().subscribe({
      next: (res) => {
        this.isGoogleLoading = false;
        this.successMessage = 'Signed in with Google! Redirecting...';
        setTimeout(() => {
          this.router.navigateByUrl(this.returnUrl);
        }, 500);
      },
      error: (err) => {
        this.isGoogleLoading = false;
        this.errorMessage = err.error?.message || 'Google sign-in failed. Please try standard sign-in.';
      }
    });
  }

  onRegister(): void {
    if (!this.registerData.name || !this.registerData.email || !this.registerData.password) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    if (this.registerData.password !== this.registerData.password_confirmation) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.registerData.role = 'customer';
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.register(this.registerData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = 'Account created successfully! Welcome to Yettoexplore.';
        setTimeout(() => {
          this.router.navigateByUrl(this.returnUrl === '/' ? '/' : this.returnUrl);
        }, 500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  onForgotPassword(): void {
    if (!this.forgotEmail) {
      this.errorMessage = 'Please enter your registered email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.forgotPassword(this.forgotEmail).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isForgotSuccess = true;
        this.successMessage = `We have sent password reset instructions to ${this.forgotEmail}`;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to send reset link. Please check your email.';
      }
    });
  }
}
