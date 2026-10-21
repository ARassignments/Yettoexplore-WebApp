import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService, AdminStats } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  activeTab = signal<'overview' | 'agencies' | 'tours' | 'bookings' | 'users' | 'coupons'>('overview');
  loading = signal<boolean>(true);

  // Search & Filter signals
  agencySearch = signal<string>('');
  tourSearch = signal<string>('');
  bookingSearch = signal<string>('');
  userSearch = signal<string>('');
  bookingFilterStatus = signal<string>('all');

  // Selected item for modal
  selectedBooking = signal<any | null>(null);

  // New Coupon Form
  newCoupon = {
    code: '',
    discount_type: 'percentage',
    discount_value: 10,
    min_spend: 10000,
    max_discount: 5000,
    usage_limit: 100
  };
  couponSuccessMsg = signal<string>('');

  // Role helpers
  currentRole = computed(() => this.auth.currentUser()?.role || 'super_admin');
  isSuperAdmin = computed(() => this.currentRole() === 'super_admin');
  isAgencyOwner = computed(() => this.currentRole() === 'agency_owner');
  isAgencyAgent = computed(() => this.currentRole() === 'agency_agent');
  isTourGuide = computed(() => this.currentRole() === 'tour_guide');
  isCustomer = computed(() => this.currentRole() === 'customer');

  constructor(
    public adminService: AdminService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loading.set(true);
    this.adminService.getOverview().subscribe(() => {
      this.adminService.getAgencies().subscribe();
      this.adminService.getTours().subscribe();
      this.adminService.getBookings().subscribe();
      this.adminService.getUsers().subscribe();
      this.adminService.getCoupons().subscribe();
      this.loading.set(false);
    });
  }

  onLogout(): void {
    this.auth.logout();
  }

  setTab(tab: 'overview' | 'agencies' | 'tours' | 'bookings' | 'users' | 'coupons'): void {
    this.activeTab.set(tab);
  }

  // Agency Actions
  toggleAgencyVerification(agency: any): void {
    const nextState = !agency.is_verified;
    agency.is_verified = nextState;
    this.adminService.updateAgency(agency.id, { is_verified: nextState }).subscribe();
  }

  toggleAgencyStatus(agency: any, status: string): void {
    agency.status = status;
    this.adminService.updateAgency(agency.id, { status }).subscribe();
  }

  // Tour Actions
  toggleTourFeatured(tour: any): void {
    const nextState = !tour.is_featured;
    tour.is_featured = nextState;
    this.adminService.updateTour(tour.id, { is_featured: nextState }).subscribe();
  }

  toggleTourStatus(tour: any, status: string): void {
    tour.status = status;
    this.adminService.updateTour(tour.id, { status }).subscribe();
  }

  // User Actions
  toggleUserStatus(user: any): void {
    const nextState = !user.is_active;
    user.is_active = nextState;
    this.adminService.updateUser(user.id, { is_active: nextState }).subscribe();
  }

  // Booking Modal
  openBookingPass(booking: any): void {
    this.selectedBooking.set(booking);
  }

  closeBookingPass(): void {
    this.selectedBooking.set(null);
  }

  // Coupon Creation
  submitCreateCoupon(): void {
    if (!this.newCoupon.code) return;
    this.adminService.createCoupon(this.newCoupon).subscribe({
      next: (res) => {
        this.couponSuccessMsg.set(`Coupon '${this.newCoupon.code.toUpperCase()}' created successfully!`);
        this.adminService.getCoupons().subscribe();
        this.newCoupon = {
          code: '',
          discount_type: 'percentage',
          discount_value: 10,
          min_spend: 10000,
          max_discount: 5000,
          usage_limit: 100
        };
        setTimeout(() => this.couponSuccessMsg.set(''), 4000);
      }
    });
  }

  // Filtered lists
  get filteredAgencies(): any[] {
    const q = this.agencySearch().toLowerCase();
    const list = this.adminService.agencies();
    if (!q) return list;
    return list.filter(a =>
      a.name.toLowerCase().includes(q) ||
      (a.city && a.city.toLowerCase().includes(q)) ||
      (a.email && a.email.toLowerCase().includes(q))
    );
  }

  get filteredTours(): any[] {
    const q = this.tourSearch().toLowerCase();
    let list = this.adminService.tours();
    
    // If agency owner or agent or guide, filter by their agency if available
    const user = this.auth.currentUser();
    if (user && user.agency_id && !this.isSuperAdmin()) {
      list = list.filter(t => t.agency_id === user.agency_id);
    }

    if (!q) return list;
    return list.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.destination?.name && t.destination.name.toLowerCase().includes(q)) ||
      (t.agency?.name && t.agency.name.toLowerCase().includes(q))
    );
  }

  get filteredBookings(): any[] {
    const q = this.bookingSearch().toLowerCase();
    let list = this.adminService.bookings();

    // If traveler, show only their bookings
    const user = this.auth.currentUser();
    if (user && this.isCustomer()) {
      list = list.filter(b => b.user_id === user.id || b.user?.email === user.email);
    } else if (user && user.agency_id && !this.isSuperAdmin()) {
      list = list.filter(b => b.agency_id === user.agency_id);
    }

    const filterStatus = this.bookingFilterStatus();
    if (filterStatus !== 'all') {
      list = list.filter(b => b.status === filterStatus);
    }
    if (!q) return list;
    return list.filter(b =>
      b.booking_number.toLowerCase().includes(q) ||
      (b.user?.name && b.user.name.toLowerCase().includes(q)) ||
      (b.tour?.title && b.tour.title.toLowerCase().includes(q)) ||
      (b.agency?.name && b.agency.name.toLowerCase().includes(q))
    );
  }

  get filteredUsers(): any[] {
    const q = this.userSearch().toLowerCase();
    let list = this.adminService.users();

    const user = this.auth.currentUser();
    if (user && user.agency_id && !this.isSuperAdmin()) {
      list = list.filter(u => u.agency_id === user.agency_id);
    }

    if (!q) return list;
    return list.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  }
}
