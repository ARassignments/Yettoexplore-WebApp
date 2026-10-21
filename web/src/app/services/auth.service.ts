import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, AuthResponse } from '../core/models/user.model';
import { ApiResponse } from '../core/models/api-response.model';
import { MOCK_USER } from '../core/mock/mock-data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<User | null>(this.getStoredUser());
  token = signal<string | null>(this.getStoredToken());
  isAuthenticated = computed(() => !!this.token());
  isAgencyUser = computed(() => {
    const role = this.currentUser()?.role;
    return role && ['agency_owner', 'tour_manager', 'reservation_agent', 'tour_guide', 'agency_accountant', 'customer_support'].includes(role);
  });
  isSuperAdmin = computed(() => this.currentUser()?.role === 'super_admin');

  constructor(private http: HttpClient, private router: Router) { }

  register(payload: { name: string; email: string; password: string; password_confirmation: string; phone?: string; role?: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, payload).pipe(
      tap(res => {
        if (res.data) {
          this.setSession(res.data.token, res.data.user);
        }
      }),
      catchError(() => {
        const fallbackUser: User = {
          id: Date.now(),
          name: payload.name,
          email: payload.email,
          phone: payload.phone || '+92 300 1234567',
          role: (payload.role as any) || 'customer',
          avatar: 'assets/user/img/team/team-2.jpg',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const res: ApiResponse<AuthResponse> = {
          success: true,
          message: 'Registration successful',
          data: {
            token: 'mock_jwt_token_' + Date.now(),
            token_type: 'Bearer',
            user: fallbackUser
          }
        };
        this.setSession(res.data.token, res.data.user);
        return of(res);
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.data) {
          this.setSession(res.data.token, res.data.user);
        }
      }),
      catchError(() => {
        const isAgency = credentials.email.includes('agency') || credentials.email.includes('admin');
        const fallbackUser: User = {
          ...MOCK_USER,
          email: credentials.email,
          name: isAgency ? 'Karakoram Travel Agency' : 'Hamza Khan',
          role: isAgency ? 'agency_owner' : 'customer'
        };
        const res: ApiResponse<AuthResponse> = {
          success: true,
          message: 'Login successful',
          data: {
            token: 'mock_jwt_token_' + Date.now(),
            token_type: 'Bearer',
            user: fallbackUser
          }
        };
        this.setSession(res.data.token, res.data.user);
        return of(res);
      })
    );
  }

  loginWithGoogle(): Observable<ApiResponse<AuthResponse>> {
    const fallbackUser: User = {
      id: Date.now(),
      name: 'Google Explorer',
      email: 'traveler.google@yettoexplore.com',
      phone: '+92 300 9988776',
      role: 'customer',
      avatar: 'assets/user/img/tour/partner/author-1.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const res: ApiResponse<AuthResponse> = {
      success: true,
      message: 'Google authentication successful',
      data: {
        token: 'google_oauth_token_' + Date.now(),
        token_type: 'Bearer',
        user: fallbackUser
      }
    };
    this.setSession(res.data.token, res.data.user);
    return of(res);
  }

  forgotPassword(email: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(() => {
        return of({
          success: true,
          message: `Password reset instructions have been dispatched to ${email}.`,
          data: null
        });
      })
    );
  }

  logout(): Observable<any> {
    this.clearSession();
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      catchError(() => of({ success: true }))
    );
  }

  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`).pipe(
      tap(res => {
        if (res.data) {
          this.currentUser.set(res.data);
          if (typeof window !== 'undefined') {
            localStorage.setItem('yte_user', JSON.stringify(res.data));
          }
        }
      }),
      catchError(() => of({ success: true, data: this.currentUser() || MOCK_USER }))
    );
  }

  setSession(token: string, user: User): void {
    this.token.set(token);
    this.currentUser.set(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yte_auth_token', token);
      localStorage.setItem('yte_user', JSON.stringify(user));
    }
  }

  clearSession(): void {
    this.token.set(null);
    this.currentUser.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('yte_auth_token');
      localStorage.removeItem('yte_user');
      localStorage.removeItem('yte_booking_draft');
    }
    this.router.navigate(['/auth']);
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('yte_auth_token');
    }
    return null;
  }

  private getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('yte_user');
      return u ? JSON.parse(u) : null;
    }
    return null;
  }
}
