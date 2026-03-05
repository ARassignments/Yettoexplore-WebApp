import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { StyleLoaderService } from '../../services/style-loader.service';
import { Router, NavigationEnd } from '@angular/router';
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
    private router: Router
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

    // ✅ Re-init template JS on every route change (fixes broken sliders etc.)
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.reloadInitScript();
    });
  }

  private async reloadInitScript(): Promise<void> {
    // Wait for Angular to finish rendering new route DOM
    setTimeout(async () => {
      try {
        // ✅ Remove old scripts.js from DOM + cache
        this.scriptLoader.remove(...this.initScript);

        // ✅ Re-inject scripts.js fresh — re-runs all DOM inits
        await this.scriptLoader.load(...this.initScript);

      } catch (e) {
        console.warn('scripts.js reload failed:', e);
      }
    }, 0); // Delay lets Angular finish rendering DOM first
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
    this.styleLoader.remove(...this.styles);
    this.scriptLoader.remove(...this.scripts, ...this.initScript);
  }
}