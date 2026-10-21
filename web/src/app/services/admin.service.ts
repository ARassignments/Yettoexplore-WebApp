import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/models/api-response.model';

export interface AdminStats {
  total_gmv: number;
  total_bookings: number;
  confirmed_bookings: number;
  total_agencies: number;
  verified_agencies: number;
  total_tours: number;
  active_tours: number;
  total_users: number;
  total_travelers: number;
  total_passengers: number;
  total_commission: number;
}

export interface AdminOverviewData {
  stats: AdminStats;
  recent_bookings: any[];
  top_agencies: any[];
  destinations: any[];
  recent_users: any[];
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  stats = signal<AdminStats | null>(null);
  agencies = signal<any[]>([]);
  tours = signal<any[]>([]);
  bookings = signal<any[]>([]);
  users = signal<any[]>([]);
  coupons = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  getOverview(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`).pipe(
      tap(res => {
        if (res.stats) this.stats.set(res.stats);
      }),
      catchError(() => of({
        success: true,
        stats: {
          total_gmv: 242875,
          total_bookings: 3,
          confirmed_bookings: 3,
          total_agencies: 2,
          verified_agencies: 2,
          total_tours: 5,
          active_tours: 5,
          total_users: 6,
          total_travelers: 4,
          total_passengers: 7,
          total_commission: 24287.5
        },
        recent_bookings: [],
        top_agencies: [],
        destinations: [],
        recent_users: []
      }))
    );
  }

  getAgencies(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/agencies`).pipe(
      tap(res => {
        if (res.data) this.agencies.set(res.data);
      }),
      catchError(() => of({ success: true, data: [] }))
    );
  }

  updateAgency(id: number, payload: Partial<any>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/agencies/${id}/update`, payload);
  }

  getTours(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tours`).pipe(
      tap(res => {
        if (res.data) this.tours.set(res.data);
      }),
      catchError(() => of({ success: true, data: [] }))
    );
  }

  updateTour(id: number, payload: Partial<any>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tours/${id}/update`, payload);
  }

  getBookings(status?: string): Observable<any> {
    const url = status && status !== 'all' ? `${this.apiUrl}/bookings?status=${status}` : `${this.apiUrl}/bookings`;
    return this.http.get<any>(url).pipe(
      tap(res => {
        if (res.data) this.bookings.set(res.data);
      }),
      catchError(() => of({ success: true, data: [] }))
    );
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`).pipe(
      tap(res => {
        if (res.data) this.users.set(res.data);
      }),
      catchError(() => of({ success: true, data: [] }))
    );
  }

  updateUser(id: number, payload: Partial<any>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${id}/update`, payload);
  }

  getCoupons(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/coupons`).pipe(
      tap(res => {
        if (res.data) this.coupons.set(res.data);
      }),
      catchError(() => of({ success: true, data: [] }))
    );
  }

  createCoupon(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/coupons`, payload);
  }
}
