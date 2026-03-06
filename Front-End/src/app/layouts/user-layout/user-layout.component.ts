import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { StyleLoaderService } from '../../services/style-loader.service';
import { PreloaderService } from '../../services/preloader.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],  // ← Add this
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent implements OnInit, OnDestroy {

  isReady = false;
  isNavigating = false;
  private routerSub!: Subscription;

  private styles = [
    'assets/user/css/bootstrap.css',
    'assets/user/css/swiper-bundle.css',
    'assets/user/css/magnific-popup.css',
    'assets/user/css/datepicker.css',
    'assets/user/css/font-awesome-pro.css',
    'assets/user/css/main.css',
  ];

  private scripts = [
    'assets/user/js/vendor/jquery.js',
    'assets/user/js/bootstrap-bundle.js',
    'assets/user/js/swiper-bundle.js',
    'assets/user/js/magnific-popup.js',
    'assets/user/js/nice-select.js',
    'assets/user/js/purecounter.js',
    'assets/user/js/fecha.js',
    'assets/user/js/hotel-datepicker.js',
  ];

  private initScript = [
    'assets/user/js/vendor/incluid-bundle.js',
    'assets/user/js/scripts.js'
  ];

  constructor(
    private scriptLoader: ScriptLoaderService,
    private styleLoader: StyleLoaderService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public preloader: PreloaderService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      // Load CSS + JS only once
      await this.styleLoader.load(...this.styles);
      await this.scriptLoader.load(...this.scripts);
      await this.scriptLoader.load(...this.initScript);

    } catch (error) {
      console.error('Asset loading failed:', error);
    } finally {
      this.isReady = true;
      this.cdr.detectChanges();
    }

    // ✅ Listen to ALL router events for preloader
    this.routerSub = this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {
        // Route change started → show preloader
        this.isNavigating = true;
        this.cdr.detectChanges();
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Route change done → reload scripts → hide preloader
        this.reloadInitScript();
      }
    });
  }

  private reloadInitScript(): void {
    setTimeout(async () => {
      try {
        this.scriptLoader.remove(...this.initScript);
        await this.scriptLoader.load(...this.initScript);
      } catch (e) {
        console.warn('scripts.js reload failed:', e);
      } finally {
        // Hide preloader after scripts re-init
        this.isNavigating = false;
        this.cdr.detectChanges();
      }
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    this.styleLoader.remove(...this.styles);
    this.scriptLoader.remove(...this.scripts, ...this.initScript);
  }
}