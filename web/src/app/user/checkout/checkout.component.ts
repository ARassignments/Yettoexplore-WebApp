import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { TourService } from '../../services/tour.service';
import { AuthService } from '../../services/auth.service';
import { Tour } from '../../core/models/tour.model';
import { Passenger, CreateBookingRequest } from '../../core/models/booking.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  tour!: Tour;
  draft: any;
  isLoading = true;
  isSubmitting = false;
  bookingSuccess = false;
  confirmedBookingNumber = '';

  passengers: Passenger[] = [];
  couponCode = '';
  discountAmount = 0;
  paymentMethod = 'card';

  cardDetails = {
    cardNumber: '•••• •••• •••• 4242',
    cardHolder: '',
    expiry: '12/28',
    cvv: '123'
  };

  constructor(
    private bookingService: BookingService,
    private tourService: TourService,
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.draft = this.bookingService.getBookingDraft();
    if (!this.draft || !this.draft.tour_id) {
      // Fallback draft if navigated directly
      this.draft = {
        tour_id: 1,
        batch_id: 201,
        travel_date: '2026-10-15',
        adults_count: 1,
        children_count: 0,
        addons: []
      };
    }

    this.tourService.getTours().subscribe(res => {
      this.tour = res.data.find(t => t.id === this.draft.tour_id) || res.data[0];
      this.initializePassengers();
      this.isLoading = false;
    });
  }

  initializePassengers(): void {
    this.passengers = [];
    const user = this.auth.currentUser();
    // Lead passenger
    this.passengers.push({
      full_name: user?.name || '',
      cnic_passport: '',
      phone: user?.phone || '',
      is_lead: true,
      gender: 'male'
    });

    if (this.cardDetails) {
      this.cardDetails.cardHolder = user?.name || 'Hamza Khan';
    }

    // Additional adult passengers
    for (let i = 1; i < (this.draft.adults_count || 1); i++) {
      this.passengers.push({
        full_name: '',
        cnic_passport: '',
        is_lead: false,
        gender: 'female'
      });
    }

    // Child passengers
    for (let j = 0; j < (this.draft.children_count || 0); j++) {
      this.passengers.push({
        full_name: '',
        age: 6,
        is_lead: false
      });
    }
  }

  get unitPrice(): number {
    return this.tour?.discount_price || this.tour?.base_price || 0;
  }

  get subtotal(): number {
    const adults = (this.draft.adults_count || 1) * this.unitPrice;
    const children = (this.draft.children_count || 0) * (this.tour?.child_price || 0);
    return adults + children;
  }

  get totalAmount(): number {
    return Math.max(0, this.subtotal - this.discountAmount);
  }

  applyCoupon(): void {
    if (this.couponCode.toUpperCase() === 'EXPLORE50' || this.couponCode.toUpperCase() === 'SUMMER10') {
      this.discountAmount = 50;
      alert('Coupon applied: $50 Discount added!');
    } else {
      alert('Invalid Promo Code. Try EXPLORE50');
    }
  }

  onConfirmPayment(): void {
    const lead = this.passengers[0];
    if (!lead.full_name || !lead.phone) {
      alert('Please fill the Lead Traveler full name and contact phone.');
      return;
    }

    this.isSubmitting = true;

    const bookingRequest: CreateBookingRequest = {
      tour_id: this.tour.id,
      batch_id: this.draft.batch_id,
      travel_date: this.draft.travel_date,
      adults_count: this.draft.adults_count,
      children_count: this.draft.children_count,
      passengers: this.passengers,
      coupon_code: this.discountAmount > 0 ? this.couponCode : undefined
    };

    this.bookingService.initiateBooking(bookingRequest).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.bookingSuccess = true;
        this.confirmedBookingNumber = res.data.booking.booking_number;
      },
      error: () => {
        this.isSubmitting = false;
        alert('Booking initiation failed. Please try again.');
      }
    });
  }

  goToMyBookings(): void {
    this.router.navigate(['/my-bookings']);
  }
}
