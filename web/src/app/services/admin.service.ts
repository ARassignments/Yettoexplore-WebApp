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
  plans = signal<any[]>([]);
  staff = signal<any[]>([]);
  trialStatus = signal<any | null>(null);
  hotels = signal<any[]>([]);
  flights = signal<any[]>([]);
  vehicles = signal<any[]>([]);
  corporate = signal<any[]>([]);
  invoices = signal<any[]>([]);

  private readonly agencyApiUrl = `${environment.apiUrl}/agency`;

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

  createAgency(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/agencies`, payload);
  }

  updateAgency(id: number, payload: Partial<any>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/agencies/${id}/update`, payload);
  }

  extendTrial(id: number, payload: { days?: number; is_permanently_free?: boolean }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/agencies/${id}/extend-trial`, payload);
  }

  getSubscriptionPlans(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/plans`).pipe(
      tap(res => {
        if (res.data) this.plans.set(res.data);
      }),
      catchError(() => of({ success: true, data: [] }))
    );
  }

  createSubscriptionPlan(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/plans`, payload);
  }

  updateSubscriptionPlan(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/plans/${id}`, payload);
  }

  // --- Agency Tenant / Staff Matrix Methods ---
  getAgencyStaff(): Observable<any> {
    return this.http.get<any>(`${this.agencyApiUrl}/staff`).pipe(
      tap(res => {
        if (res.data) this.staff.set(res.data);
      }),
      catchError(() => of({ success: true, data: [] }))
    );
  }

  createAgencyStaff(payload: any): Observable<any> {
    return this.http.post<any>(`${this.agencyApiUrl}/staff`, payload);
  }

  updateStaffPermissions(staffId: number, permissions: any[]): Observable<any> {
    return this.http.post<any>(`${this.agencyApiUrl}/staff/${staffId}/permissions`, { permissions });
  }

  toggleStaffStatus(staffId: number): Observable<any> {
    return this.http.post<any>(`${this.agencyApiUrl}/staff/${staffId}/toggle-status`, {});
  }

  getTrialStatus(): Observable<any> {
    return this.http.get<any>(`${this.agencyApiUrl}/trial-status`).pipe(
      tap(res => {
        if (res.data) this.trialStatus.set(res.data);
      }),
      catchError(() => of({ success: true, data: null }))
    );
  }

  // --- Manual Inventory Methods ---
  getHotels(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/hotels`).pipe(
      tap(res => {
        if (res.data) this.hotels.set(res.data);
      }),
      catchError(() => of({ success: true, data: [] }))
    );
  }

  createHotel(payload: any): Observable<any> {
    return this.http.post<any>(`${this.agencyApiUrl}/hotels`, payload);
  }

  getFlights(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/flights`).pipe(
      tap(res => {
        if (res.data) this.flights.set(res.data);
      }),
      catchError(() => of({ success: true, data: [] }))
    );
  }

  createFlight(payload: any): Observable<any> {
    return this.http.post<any>(`${this.agencyApiUrl}/flights`, payload);
  }

  getVehicles(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/vehicles`).pipe(
      tap(res => {
        if (res.data) this.vehicles.set(res.data);
      }),
      catchError(() => of({ success: true, data: [] }))
    );
  }

  createVehicle(payload: any): Observable<any> {
    return this.http.post<any>(`${this.agencyApiUrl}/vehicles`, payload);
  }

  getCorporateAccounts(): Observable<any> {
    return this.http.get<any>(`${this.agencyApiUrl}/corporate`).pipe(
      tap(res => {
        if (res.data) this.corporate.set(res.data);
      }),
      catchError(() => of({ success: true, data: [] }))
    );
  }

  createCorporateAccount(payload: any): Observable<any> {
    return this.http.post<any>(`${this.agencyApiUrl}/corporate`, payload);
  }

  getInvoices(): Observable<any> {
    return this.http.get<any>(`${this.agencyApiUrl}/invoices`).pipe(
      tap(res => {
        if (res.data) this.invoices.set(res.data);
      }),
      catchError(() => of({ success: true, data: [] }))
    );
  }

  createInvoice(payload: any): Observable<any> {
    return this.http.post<any>(`${this.agencyApiUrl}/invoices`, payload);
  }

  markInvoicePaid(id: number, paymentMethod: string): Observable<any> {
    return this.http.post<any>(`${this.agencyApiUrl}/invoices/${id}/mark-paid`, { payment_method: paymentMethod });
  }

  // --- Platform Tours & Bookings ---
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
