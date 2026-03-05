import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { StyleLoaderService } from '../../services/style-loader.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,   // false if using NgModules
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],  // ← Add this
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {

  isReady = false;

  constructor(
    private scriptLoader: ScriptLoaderService,
    private styleLoader: StyleLoaderService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      // Wait for ALL CSS to load first
      await this.styleLoader.load(
        'assets/dashboard/css/bootstrap.min.css',
        'assets/dashboard/css/bootstrap-datetimepicker.min.css',
        'assets/dashboard/css/animate.css',
        'assets/dashboard/plugins/select2/css/select2.min.css',
        'assets/dashboard/plugins/daterangepicker/daterangepicker.css',
        'assets/dashboard/plugins/tabler-icons/tabler-icons.min.css',
        'assets/dashboard/plugins/fontawesome/css/fontawesome.min.css',
        'assets/dashboard/plugins/fontawesome/css/all.min.css',
        'assets/dashboard/plugins/%40simonwep/pickr/themes/nano.min.css',
        'assets/dashboard/css/style.css'
      );

      // Then load JS in order
      await this.scriptLoader.load(
        'assets/dashboard/js/jquery-3.7.1.min.js',
        'assets/dashboard/js/feather.min.js',
        'assets/dashboard/js/jquery.slimscroll.min.js',
        'assets/dashboard/js/bootstrap.bundle.min.js',
        'assets/dashboard/plugins/apexchart/apexcharts.min.js',
        'assets/dashboard/plugins/apexchart/chart-data.js',
        'assets/dashboard/plugins/chartjs/chart.min.js',
        'assets/dashboard/plugins/chartjs/chart-data.js',
        'assets/dashboard/js/moment.min.js',
        'assets/dashboard/plugins/daterangepicker/daterangepicker.js',
        'assets/dashboard/plugins/select2/js/select2.min.js',
        'assets/dashboard/plugins/%40simonwep/pickr/pickr.es5.min.js',
        'assets/dashboard/js/theme-colorpicker.js',
        'assets/dashboard/js/script.js',
        // 'assets/dashboard/js/rocket-loader.min.js',
      );

    } catch (error) {
      console.error('Asset loading failed:', error);
    } finally {
      // Always runs — whether success or error
      this.isReady = true;
      this.cdr.detectChanges();   // ← Force Angular to update the view
    }
  }

  ngOnDestroy(): void {
    this.styleLoader.remove(
      'assets/dashboard/css/bootstrap.min.css',
      'assets/dashboard/css/bootstrap-datetimepicker.min.css',
      'assets/dashboard/css/animate.css',
      'assets/dashboard/plugins/select2/css/select2.min.css',
      'assets/dashboard/plugins/daterangepicker/daterangepicker.css',
      'assets/dashboard/plugins/tabler-icons/tabler-icons.min.css',
      'assets/dashboard/plugins/fontawesome/css/fontawesome.min.css',
      'assets/dashboard/plugins/fontawesome/css/all.min.css',
      'assets/dashboard/plugins/%40simonwep/pickr/themes/nano.min.css',
      'assets/dashboard/css/style.css'
    );
    this.scriptLoader.remove(
      'assets/dashboard/js/jquery-3.7.1.min.js',
      'assets/dashboard/js/feather.min.js',
      'assets/dashboard/js/jquery.slimscroll.min.js',
      'assets/dashboard/js/bootstrap.bundle.min.js',
      'assets/dashboard/plugins/apexchart/apexcharts.min.js',
      'assets/dashboard/plugins/apexchart/chart-data.js',
      'assets/dashboard/plugins/chartjs/chart.min.js',
      'assets/dashboard/plugins/chartjs/chart-data.js',
      'assets/dashboard/js/moment.min.js',
      'assets/dashboard/plugins/daterangepicker/daterangepicker.js',
      'assets/dashboard/plugins/select2/js/select2.min.js',
      'assets/dashboard/plugins/%40simonwep/pickr/pickr.es5.min.js',
      'assets/dashboard/js/theme-colorpicker.js',
      'assets/dashboard/js/script.js',
      // 'assets/dashboard/js/rocket-loader.min.js',
    );
  }
}