import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.css'
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  isLoading = true;
  selectedTicketBooking: Booking | null = null;

  constructor(
    private bookingService: BookingService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getUserBookings().subscribe(res => {
      this.bookings = res.data;
      this.isLoading = false;
    });
  }

  openTicketModal(booking: Booking): void {
    this.selectedTicketBooking = booking;
  }

  closeTicketModal(): void {
    this.selectedTicketBooking = null;
  }

  printTicket(): void {
    window.print();
  }

  cancelBooking(booking: Booking): void {
    if (confirm(`Are you sure you want to request cancellation for booking ${booking.booking_number}?`)) {
      this.bookingService.cancelBooking(booking.id, 'User requested cancellation').subscribe(() => {
        alert('Cancellation request submitted. Agency will process your refund.');
        this.loadBookings();
      });
    }
  }
}
