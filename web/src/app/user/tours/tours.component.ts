import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { Tour, Destination, TourFilterParams } from '../../core/models/tour.model';

@Component({
  selector: 'app-tours',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.css'
})
export class ToursComponent implements OnInit {
  tours: Tour[] = [];
  destinations: Destination[] = [];
  isLoading = true;

  filters: TourFilterParams = {
    search: '',
    destination_id: undefined,
    min_price: undefined,
    max_price: undefined,
    difficulty: undefined
  };

  constructor(
    private tourService: TourService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['search']) this.filters.search = params['search'];
      if (params['destination_id']) this.filters.destination_id = Number(params['destination_id']);
      this.loadTours();
    });

    this.tourService.getDestinations().subscribe(res => {
      this.destinations = res.data;
    });
  }

  loadTours(): void {
    this.isLoading = true;
    this.tourService.getTours(this.filters).subscribe(res => {
      this.tours = res.data;
      this.isLoading = false;
    });
  }

  applyFilters(): void {
    this.loadTours();
  }

  resetFilters(): void {
    this.filters = { search: '', destination_id: undefined, min_price: undefined, max_price: undefined, difficulty: undefined };
    this.loadTours();
  }
}
