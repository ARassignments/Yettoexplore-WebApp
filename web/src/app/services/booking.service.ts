import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Booking,
  CreateBookingRequest,
  BookingInitResponse,
} from '../core/models/booking.model';
import { ApiResponse } from '../core/models/api-response.model';
import { MOCK_BOOKINGS, MOCK_TOURS } from '../core/mock/mock-data';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly apiUrl = `${environment.apiUrl}/bookings`;

  bookingDraft = signal<Partial<CreateBookingRequest> | null>(this.getStoredDraft());
  private bookingsStore: Booking[] = [...MOCK_BOOKINGS];

  constructor(private http: HttpClient) { }

  setBookingDraft(draft: Partial<CreateBookingRequest>): void {
    this.bookingDraft.set(draft);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yte_booking_draft', JSON.stringify(draft));
    }
  }

  getBookingDraft(): Partial<CreateBookingRequest> | null {
    return this.bookingDraft();
  }

  clearBookingDraft(): void {
    this.bookingDraft.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('yte_booking_draft');
    }
  }

  private getStoredDraft(): Partial<CreateBookingRequest> | null {
    if (typeof window !== 'undefined') {
      const d = localStorage.getItem('yte_booking_draft');
      return d ? JSON.parse(d) : null;
    }
    return null;
  }

  initiateBooking(payload: CreateBookingRequest): Observable<ApiResponse<BookingInitResponse>> {
    return this.http.post<ApiResponse<BookingInitResponse>>(`${this.apiUrl}/initiate`, payload).pipe(
      catchError(() => {
        const tour = MOCK_TOURS.find(t => t.id === payload.tour_id) || MOCK_TOURS[0];
        const adultsPrice = (tour.discount_price || tour.base_price) * payload.adults_count;
        const childrenPrice = (tour.child_price || 0) * (payload.children_count || 0);
        const subtotal = adultsPrice + childrenPrice;
        const discount = payload.coupon_code ? 50 : 0;
        const total = Math.max(0, subtotal - discount);

        const newBooking: Booking = {
          id: Date.now(),
          booking_number: `YTE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          user_id: 1,
          tour_id: tour.id,
          agency_id: tour.agency_id,
          batch_id: payload.batch_id,
          travel_date: payload.travel_date,
          adults_count: payload.adults_count,
          children_count: payload.children_count || 0,
          infants_count: payload.infants_count || 0,
          total_passengers: payload.adults_count + (payload.children_count || 0) + (payload.infants_count || 0),
          subtotal,
          discount_amount: discount,
          coupon_code: payload.coupon_code,
          total_amount: total,
          paid_amount: total,
          due_amount: 0,
          status: 'confirmed',
          payment_status: 'succeeded',
          payment_method: 'Credit Card (Online)',
          qr_code_token: `YTE_QR_${Date.now()}_SECURE`,
          passengers: payload.passengers,
          tour,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        this.bookingsStore.unshift(newBooking);
        this.clearBookingDraft();

        return of({
          success: true,
          message: 'Booking confirmed successfully',
          data: {
            booking: newBooking,
            client_secret: 'mock_stripe_client_secret_' + Date.now()
          }
        });
      })
    );
  }

  getUserBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.apiUrl}/my-bookings`).pipe(
      catchError(() => of({ success: true, data: this.bookingsStore }))
    );
  }

  getBookingDetails(id: number): Observable<ApiResponse<Booking>> {
    return this.http.get<ApiResponse<Booking>>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = this.bookingsStore.find(b => b.id === Number(id)) || this.bookingsStore[0];
        return of({ success: true, data: found });
      })
    );
  }

  cancelBooking(id: number, reason: string): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(`${this.apiUrl}/${id}/cancel`, { reason }).pipe(
      catchError(() => {
        const b = this.bookingsStore.find(x => x.id === Number(id));
        if (b) {
          b.status = 'cancel_requested';
        }
        return of({ success: true, data: b! });
      })
    );
  }
}
