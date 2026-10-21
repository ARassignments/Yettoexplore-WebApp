import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService, AdminStats } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

export type DashboardTab =
  | 'overview'
  | 'agencies'
  | 'plans'
  | 'staff'
  | 'inventory'
  | 'tours'
  | 'bookings'
  | 'users'
  | 'coupons';

export type InventorySubTab = 'hotels' | 'flights' | 'vehicles' | 'corporate' | 'invoices';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  activeTab = signal<DashboardTab>('overview');
  inventorySubTab = signal<InventorySubTab>('hotels');
  loading = signal<boolean>(true);

  // Search & Filter signals
  agencySearch = signal<string>('');
  tourSearch = signal<string>('');
  bookingSearch = signal<string>('');
  userSearch = signal<string>('');
  staffSearch = signal<string>('');
  bookingFilterStatus = signal<string>('all');

  // Selected item for modal
  selectedBooking = signal<any | null>(null);

  // Modals visibility signals
  createAgencyModalOpen = signal<boolean>(false);
  extendTrialModalOpen = signal<boolean>(false);
  createPlanModalOpen = signal<boolean>(false);
  createStaffModalOpen = signal<boolean>(false);
  editPermissionsModalOpen = signal<boolean>(false);
  createHotelModalOpen = signal<boolean>(false);
  createFlightModalOpen = signal<boolean>(false);
  createVehicleModalOpen = signal<boolean>(false);
  createCorporateModalOpen = signal<boolean>(false);
  createInvoiceModalOpen = signal<boolean>(false);

  // Success / Notice toast
  toastMessage = signal<string>('');

  // Super Admin: Create Agency Form
  newAgencyData = {
    name: '',
    email: '',
    city: 'Islamabad',
    phone: '',
    license_number: '',
    subscription_tier: 'growth',
    subscription_plan_id: null as number | null,
    trial_days: 14,
    is_permanently_free: false,
    owner_name: '',
    owner_email: '',
    owner_password: 'password123'
  };

  // Super Admin: Extend Trial Form
  extendTrialData = {
    agencyId: 0,
    agencyName: '',
    days: 14,
    is_permanently_free: false
  };

  // Super Admin: Create Plan Form
  newPlanData = {
    name: '',
    price: 49,
    currency: 'USD',
    billing_cycle: 'monthly',
    staff_limit: 5,
    commission_rate: 3.5,
    description: '',
    modules_included: ['packages', 'hotel', 'flight', 'car_rental', 'corporate']
  };

  // Agency Owner: Create Staff Form
  newStaffData = {
    name: '',
    email: '',
    phone: '',
    role: 'operational_manager',
    password: 'password123'
  };

  // Staff Permissions Matrix for Edit Modal
  selectedStaff: any = null;
  staffPermissionsMatrix: any[] = [];

  // New Coupon Form
  newCoupon = {
    code: '',
    discount_type: 'percentage',
    discount_value: 10,
    min_spend: 10000,
    max_discount: 5000,
    usage_limit: 100
  };

  // Inventory Forms
  newHotelData = {
    name: '',
    city: 'Skardu',
    address: '',
    star_rating: 4.8,
    cover_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    description: 'Luxury mountain retreat offering panoramic valley views and modern comforts.'
  };

  newFlightData = {
    flight_number: '',
    airline_name: 'PIA Mountain Express',
    departure_airport: 'ISB',
    departure_city: 'Islamabad',
    arrival_airport: 'KDU',
    arrival_city: 'Skardu',
    departure_time: '',
    arrival_time: '',
    cabin_class: 'Economy',
    adult_price: 24500,
    total_seats: 40
  };

  newVehicleData = {
    name: '',
    make: 'Toyota',
    model_year: 2023,
    type: 'suv',
    license_plate: '',
    seats_capacity: 7,
    daily_rate: 22000,
    with_driver: true
  };

  newCorporateData = {
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    credit_limit: 500000,
    discount_rate_percentage: 5
  };

  newInvoiceData = {
    title: '',
    subtotal: 100000,
    tax_amount: 5000,
    discount_amount: 0,
    currency: 'PKR',
    due_date: '',
    notes: 'Official SaaS travel invoice.'
  };

  // Role helpers
  currentRole = computed(() => this.auth.currentUser()?.role || 'super_admin');
  isSuperAdmin = computed(() => this.currentRole() === 'super_admin');
  isAgencyOwner = computed(() => this.currentRole() === 'agency_owner');
  isAgencyAgent = computed(() => ['sales_agent', 'agency_agent'].includes(this.currentRole()));
  isOpsManager = computed(() => this.currentRole() === 'operational_manager');
  isAccountant = computed(() => this.currentRole() === 'accountant');
  isTourGuide = computed(() => this.currentRole() === 'tour_guide');
  isCustomer = computed(() => this.currentRole() === 'customer');
  couponSuccessMsg = signal<string>('');

  constructor(
    public adminService: AdminService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(''), 4500);
  }

  loadAllData(): void {
    this.loading.set(true);
    this.adminService.getOverview().subscribe(() => {
      this.adminService.getAgencies().subscribe();
      this.adminService.getTours().subscribe();
      this.adminService.getBookings().subscribe();
      this.adminService.getUsers().subscribe();
      this.adminService.getCoupons().subscribe();
      this.adminService.getSubscriptionPlans().subscribe();
      this.adminService.getHotels().subscribe();
      this.adminService.getFlights().subscribe();
      this.adminService.getVehicles().subscribe();

      // If user belongs to an Agency (Tenant)
      const u = this.auth.currentUser();
      if (u && (u.agency_id || u.role === 'agency_owner')) {
        this.adminService.getTrialStatus().subscribe();
        this.adminService.getAgencyStaff().subscribe();
        this.adminService.getCorporateAccounts().subscribe();
        this.adminService.getInvoices().subscribe();
      }

      this.loading.set(false);
    });
  }

  onLogout(): void {
    this.auth.logout();
  }

  setTab(tab: DashboardTab): void {
    this.activeTab.set(tab);
  }

  setInventorySubTab(subTab: InventorySubTab): void {
    this.inventorySubTab.set(subTab);
  }

  // --- Super Admin Agency Actions ---
  toggleAgencyVerification(agency: any): void {
    const nextState = !agency.is_verified;
    agency.is_verified = nextState;
    this.adminService.updateAgency(agency.id, { is_verified: nextState }).subscribe();
  }

  toggleAgencyStatus(agency: any, status: string): void {
    agency.status = status;
    this.adminService.updateAgency(agency.id, { status }).subscribe();
  }

  openCreateAgencyModal(): void {
    this.createAgencyModalOpen.set(true);
  }

  submitCreateAgency(): void {
    if (!this.newAgencyData.name || !this.newAgencyData.owner_email) {
      this.showToast('Please fill all required agency and owner fields.');
      return;
    }

    this.adminService.createAgency(this.newAgencyData).subscribe({
      next: (res) => {
        this.showToast(res.message || 'New agency onboarded successfully!');
        this.createAgencyModalOpen.set(false);
        this.adminService.getAgencies().subscribe();
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Failed to create agency.');
      }
    });
  }

  openExtendTrialModal(agency: any): void {
    this.extendTrialData = {
      agencyId: agency.id,
      agencyName: agency.name,
      days: 14,
      is_permanently_free: agency.is_permanently_free || false
    };
    this.extendTrialModalOpen.set(true);
  }

  submitExtendTrial(): void {
    this.adminService.extendTrial(this.extendTrialData.agencyId, {
      days: this.extendTrialData.days,
      is_permanently_free: this.extendTrialData.is_permanently_free
    }).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Agency trial updated successfully.');
        this.extendTrialModalOpen.set(false);
        this.adminService.getAgencies().subscribe();
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Failed to update trial.');
      }
    });
  }

  // --- SaaS Plans ---
  openCreatePlanModal(): void {
    this.createPlanModalOpen.set(true);
  }

  submitCreatePlan(): void {
    if (!this.newPlanData.name || !this.newPlanData.price) return;
    this.adminService.createSubscriptionPlan(this.newPlanData).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Subscription Plan created!');
        this.createPlanModalOpen.set(false);
        this.adminService.getSubscriptionPlans().subscribe();
      }
    });
  }

  // --- Agency Owner Staff Management ---
  openCreateStaffModal(): void {
    this.createStaffModalOpen.set(true);
  }

  submitCreateStaff(): void {
    if (!this.newStaffData.name || !this.newStaffData.email) {
      this.showToast('Please enter staff name and email.');
      return;
    }

    this.adminService.createAgencyStaff(this.newStaffData).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Staff member created successfully!');
        this.createStaffModalOpen.set(false);
        this.adminService.getAgencyStaff().subscribe();
      },
      error: (err) => {
        this.showToast(err.error?.message || 'Failed to create staff.');
      }
    });
  }

  openEditPermissionsModal(staff: any): void {
    this.selectedStaff = staff;
    const modules = ['packages', 'hotel', 'flight', 'car_rental', 'corporate'];
    const existing = staff.module_access || [];

    this.staffPermissionsMatrix = modules.map(m => {
      const match = existing.find((e: any) => e.module === m);
      return {
        module: m,
        can_view: match ? !!match.can_view : true,
        can_add_edit: match ? !!match.can_add_edit : false,
        can_book: match ? !!match.can_book : false,
        can_approve_refund: match ? !!match.can_approve_refund : false,
      };
    });

    this.editPermissionsModalOpen.set(true);
  }

  submitUpdatePermissions(): void {
    if (!this.selectedStaff) return;
    this.adminService.updateStaffPermissions(this.selectedStaff.id, this.staffPermissionsMatrix).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Staff permissions matrix saved!');
        this.editPermissionsModalOpen.set(false);
        this.adminService.getAgencyStaff().subscribe();
      }
    });
  }

  toggleStaffStatus(staff: any): void {
    this.adminService.toggleStaffStatus(staff.id).subscribe({
      next: (res) => {
        staff.is_active = !staff.is_active;
        this.showToast(res.message || 'Staff status toggled.');
      }
    });
  }

  // --- Manual Inventory Submissions ---
  submitCreateHotel(): void {
    if (!this.newHotelData.name) return;
    this.adminService.createHotel(this.newHotelData).subscribe({
      next: () => {
        this.showToast('Hotel listing added successfully.');
        this.createHotelModalOpen.set(false);
        this.adminService.getHotels().subscribe();
      }
    });
  }

  submitCreateFlight(): void {
    if (!this.newFlightData.flight_number) return;
    this.adminService.createFlight(this.newFlightData).subscribe({
      next: () => {
        this.showToast('Flight schedule listed successfully.');
        this.createFlightModalOpen.set(false);
        this.adminService.getFlights().subscribe();
      }
    });
  }

  submitCreateVehicle(): void {
    if (!this.newVehicleData.name) return;
    this.adminService.createVehicle(this.newVehicleData).subscribe({
      next: () => {
        this.showToast('Vehicle fleet asset registered.');
        this.createVehicleModalOpen.set(false);
        this.adminService.getVehicles().subscribe();
      }
    });
  }

  submitCreateCorporate(): void {
    if (!this.newCorporateData.company_name) return;
    this.adminService.createCorporateAccount(this.newCorporateData).subscribe({
      next: () => {
        this.showToast('Corporate account onboarded.');
        this.createCorporateModalOpen.set(false);
        this.adminService.getCorporateAccounts().subscribe();
      }
    });
  }

  submitCreateInvoice(): void {
    if (!this.newInvoiceData.title || !this.newInvoiceData.due_date) {
      this.showToast('Please enter title and due date.');
      return;
    }
    this.adminService.createInvoice(this.newInvoiceData).subscribe({
      next: () => {
        this.showToast('Invoice generated successfully.');
        this.createInvoiceModalOpen.set(false);
        this.adminService.getInvoices().subscribe();
      }
    });
  }

  markInvoicePaid(inv: any): void {
    this.adminService.markInvoicePaid(inv.id, 'Bank Wire / IBAN').subscribe({
      next: () => {
        inv.status = 'paid';
        this.showToast(`Invoice #${inv.invoice_number} marked as PAID.`);
      }
    });
  }

  // --- Tour & User Actions ---
  toggleTourFeatured(tour: any): void {
    const nextState = !tour.is_featured;
    tour.is_featured = nextState;
    this.adminService.updateTour(tour.id, { is_featured: nextState }).subscribe();
  }

  toggleTourStatus(tour: any, status: string): void {
    tour.status = status;
    this.adminService.updateTour(tour.id, { status }).subscribe();
  }

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
      next: () => {
        this.showToast(`Coupon '${this.newCoupon.code.toUpperCase()}' created successfully!`);
        this.adminService.getCoupons().subscribe();
        this.newCoupon = {
          code: '',
          discount_type: 'percentage',
          discount_value: 10,
          min_spend: 10000,
          max_discount: 5000,
          usage_limit: 100
        };
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

  get filteredStaff(): any[] {
    const q = this.staffSearch().toLowerCase();
    const list = this.adminService.staff();
    if (!q) return list;
    return list.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.role && s.role.toLowerCase().includes(q))
    );
  }

  get filteredTours(): any[] {
    const q = this.tourSearch().toLowerCase();
    let list = this.adminService.tours();

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
