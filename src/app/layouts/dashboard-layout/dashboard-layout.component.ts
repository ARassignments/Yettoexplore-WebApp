import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { StyleLoaderService } from '../../services/style-loader.service';
import { PreloaderService } from '../../services/preloader.service';
import { DropdownInitService } from '../../services/dropdown-init.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,   // false if using NgModules
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],  // ← Add this
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {

  isReady = false;
  isNavigating = false;
  private routerSub!: Subscription;

  private styles = [
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
  ];

  private scripts = [
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
    // 'assets/dashboard/js/rocket-loader.min.js',
  ];

  private initScript = [
    'assets/dashboard/js/theme-script.js',
    'assets/dashboard/js/script.js'
  ];

  constructor(
    private scriptLoader: ScriptLoaderService,
    private styleLoader: StyleLoaderService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private ngZone: NgZone,
    private dropdownInit: DropdownInitService,   // ← Inject
    public preloader: PreloaderService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      // document.documentElement.setAttribute('data-layout-mode', 'light_mode');
      await this.styleLoader.load(...this.styles);
      await this.scriptLoader.load(...this.scripts);
      await this.scriptLoader.load(...this.initScript);
      this.dropdownInit.init(300);
    } catch (error) {
      console.error('Asset loading failed:', error);
    } finally {
      this.isReady = true;
      this.cdr.detectChanges();
    }

    this.routerSub = this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {
        this.cleanupPluginDOMs();
        this.isNavigating = true;
        this.cdr.detectChanges();
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.reloadAndReinit();
      }
    });
  }
  
  private cleanupPluginDOMs(): void {
    try {
      document.querySelectorAll('.daterangepicker').forEach(el => el.remove());
      document.querySelectorAll('.select2-container').forEach(el => el.remove());
      document.querySelectorAll('.pcr-app').forEach(el => el.remove());
      document.querySelectorAll('.tooltip').forEach(el => el.remove());
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.classList.remove('modal-open');

      const win = window as any;
      const $ = win.$ || win.jQuery;
      if (!$) return;

      $('select.select2-hidden-accessible').each(function (this: any) {
        try { $(this).select2('destroy'); } catch (e) { }
      });

      $('[data-daterangepicker]').each(function (this: any) {
        try {
          if ($(this).data('daterangepicker')) {
            $(this).data('daterangepicker').remove();
          }
        } catch (e) { }
      });

    } catch (e) {
      console.warn('Cleanup warning:', e);
    }
  }

  private reloadAndReinit(): void {
    setTimeout(async () => {
      try {
        // Step 1 — Force reload init scripts
        await this.scriptLoader.forceReload(...this.initScript);
        await this.delay(150);

        // Step 2 — Reinit other plugins
        this.ngZone.runOutsideAngular(() => this.reinitOtherPlugins());

        // Step 3 — Reinit dropdowns with retry
        this.dropdownInit.init(200);

      } catch (e) {
        console.warn('Reload failed:', e);
      } finally {
        this.isNavigating = false;
        this.cdr.detectChanges();
      }
    }, 300);
  }

  private reinitOtherPlugins(): void {
    try {
      const win = window as any;
      const $ = win.$ || win.jQuery;
      if (!$) return;

      if (win.feather) win.feather.replace();

      if ($.fn.select2) {
        $('select:not(.select2-hidden-accessible)').each(function (this: any) {
          try { $(this).select2(); } catch (e) { }
        });
      }

      if ($.fn.slimScroll) {
        try { $('#sidebar').slimScroll({ height: 'auto', size: '5px' }); }
        catch (e) { }
      }

      document.querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach((el: any) => {
          try {
            const old = win.bootstrap?.Tooltip?.getInstance(el);
            if (old) old.dispose();
            new win.bootstrap.Tooltip(el);
          } catch (e) { }
        });

      if ($.fn.daterangepicker) {
        $('[data-daterangepicker]').each(function (this: any) {
          try { $(this).daterangepicker({ opens: 'left' }); } catch (e) { }
        });
      }

    } catch (e) {
      console.warn('Plugin reinit warning:', e);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnDestroy(): void {
    document.documentElement.removeAttribute('data-layout-mode');
    this.cleanupPluginDOMs();
    if (this.routerSub) this.routerSub.unsubscribe();
    this.styleLoader.remove(...this.styles);
    this.scriptLoader.remove(...this.scripts, ...this.initScript);
  }
}