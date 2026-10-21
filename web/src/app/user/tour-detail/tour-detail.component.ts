import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Tour, TourBatch } from '../../core/models/tour.model';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.css'
})
export class TourDetailComponent implements OnInit {
  tour!: Tour;
  isLoading = true;
  selectedBatchId!: number;

  adultsCount = 1;
  childrenCount = 0;
  selectedAddons: { id: number; name: string; price: number; selected: boolean }[] = [
    { id: 1, name: 'Single Room Supplement', price: 80, selected: false },
    { id: 2, name: 'VIP Airport Express Transfer', price: 35, selected: false },
    { id: 3, name: 'Adventure Activity Pass & Equipment', price: 45, selected: false }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService,
    private bookingService: BookingService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.loadTour(slug);
    });
  }

  loadTour(slug: string): void {
    this.isLoading = true;
    this.tourService.getTourBySlug(slug).subscribe(res => {
      this.tour = res.data;
      if (this.tour.batches && this.tour.batches.length > 0) {
        this.selectedBatchId = this.tour.batches[0].id;
      }
      this.isLoading = false;
    });
  }

  get selectedBatch(): TourBatch | undefined {
    return this.tour?.batches?.find(b => b.id === Number(this.selectedBatchId));
  }

  get unitPrice(): number {
    return this.tour?.discount_price || this.tour?.base_price || 0;
  }

  get childUnitPrice(): number {
    return this.tour?.child_price || 0;
  }

  get addonsTotal(): number {
    return this.selectedAddons
      .filter(a => a.selected)
      .reduce((sum, a) => sum + a.price * this.adultsCount, 0);
  }

  get totalPrice(): number {
    const adultsTotal = this.adultsCount * this.unitPrice;
    const childrenTotal = this.childrenCount * this.childUnitPrice;
    return adultsTotal + childrenTotal + this.addonsTotal;
  }

  incrementAdults(): void {
    if (this.adultsCount < (this.tour?.max_group_size || 20)) {
      this.adultsCount++;
    }
  }

  decrementAdults(): void {
    if (this.adultsCount > 1) {
      this.adultsCount--;
    }
  }

  incrementChildren(): void {
    this.childrenCount++;
  }

  decrementChildren(): void {
    if (this.childrenCount > 0) {
      this.childrenCount--;
    }
  }

  onProceedToBooking(): void {
    const selectedBatch = this.selectedBatch;
    if (!selectedBatch) {
      alert('Please select an available departure date');
      return;
    }

    const draft = {
      tour_id: this.tour.id,
      batch_id: selectedBatch.id,
      travel_date: selectedBatch.start_date,
      adults_count: this.adultsCount,
      children_count: this.childrenCount,
      addons: this.selectedAddons.filter(a => a.selected).map(a => ({ id: a.id, quantity: this.adultsCount }))
    };

    this.bookingService.setBookingDraft(draft);

    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth'], {
        queryParams: { returnUrl: '/checkout', mode: 'login' }
      });
    } else {
      this.router.navigate(['/checkout']);
    }
  }
}
