import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Tour, Destination, TourFilterParams } from '../core/models/tour.model';
import { ApiResponse } from '../core/models/api-response.model';
import { MOCK_TOURS, MOCK_DESTINATIONS } from '../core/mock/mock-data';

@Injectable({ providedIn: 'root' })
export class TourService {
  private readonly apiUrl = `${environment.apiUrl}/tours`;
  private readonly destUrl = `${environment.apiUrl}/destinations`;

  constructor(private http: HttpClient) { }

  getTours(filters?: TourFilterParams): Observable<ApiResponse<Tour[]>> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Tour[]>>(this.apiUrl, { params }).pipe(
      catchError(() => {
        let filtered = [...MOCK_TOURS];
        if (filters?.destination_id) {
          filtered = filtered.filter(t => t.destination_id === Number(filters.destination_id));
        }
        if (filters?.min_price) {
          filtered = filtered.filter(t => (t.discount_price || t.base_price) >= filters.min_price!);
        }
        if (filters?.max_price) {
          filtered = filtered.filter(t => (t.discount_price || t.base_price) <= filters.max_price!);
        }
        if (filters?.search) {
          const s = filters.search.toLowerCase();
          filtered = filtered.filter(t => t.title.toLowerCase().includes(s) || t.overview.toLowerCase().includes(s));
        }
        return of({ success: true, data: filtered });
      })
    );
  }

  getFeaturedTours(): Observable<ApiResponse<Tour[]>> {
    return this.http.get<ApiResponse<Tour[]>>(`${this.apiUrl}/featured`).pipe(
      catchError(() => of({ success: true, data: MOCK_TOURS.filter(t => t.is_featured) }))
    );
  }

  getTourBySlug(slug: string): Observable<ApiResponse<Tour>> {
    return this.http.get<ApiResponse<Tour>>(`${this.apiUrl}/${slug}`).pipe(
      catchError(() => {
        const found = MOCK_TOURS.find(t => t.slug === slug) || MOCK_TOURS[0];
        return of({ success: true, data: found });
      })
    );
  }

  getDestinations(): Observable<ApiResponse<Destination[]>> {
    return this.http.get<ApiResponse<Destination[]>>(this.destUrl).pipe(
      catchError(() => of({ success: true, data: MOCK_DESTINATIONS }))
    );
  }

  // Agency Vendor Operations
  createTour(tourData: Partial<Tour>): Observable<ApiResponse<Tour>> {
    return this.http.post<ApiResponse<Tour>>(this.apiUrl, tourData).pipe(
      catchError(() => {
        const newTour: Tour = {
          ...(tourData as Tour),
          id: Date.now(),
          slug: (tourData.title || 'new-tour').toLowerCase().replace(/\s+/g, '-'),
          rating: 5.0,
          reviews_count: 0,
          created_at: new Date().toISOString()
        };
        MOCK_TOURS.unshift(newTour);
        return of({ success: true, data: newTour });
      })
    );
  }

  updateTour(id: number, tourData: Partial<Tour>): Observable<ApiResponse<Tour>> {
    return this.http.put<ApiResponse<Tour>>(`${this.apiUrl}/${id}`, tourData).pipe(
      catchError(() => of({ success: true, data: { ...MOCK_TOURS[0], ...tourData } as Tour }))
    );
  }

  deleteTour(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of({ success: true, data: null }))
    );
  }
}
