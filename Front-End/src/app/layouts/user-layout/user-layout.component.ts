import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { StyleLoaderService } from '../../services/style-loader.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],  // ← Add this
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent implements OnInit, OnDestroy {

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
        'assets/user/css/bootstrap.css',
      'assets/user/css/swiper-bundle.css',
      'assets/user/css/magnific-popup.css',
      'assets/user/css/datepicker.css',
      'assets/user/css/font-awesome-pro.css',
      'assets/user/css/main.css',
      );

      // Then load JS in order
      await this.scriptLoader.load(
        'assets/user/js/vendor/jquery.js',
      'assets/user/js/bootstrap-bundle.js',
      'assets/user/js/swiper-bundle.js',
      'assets/user/js/magnific-popup.js',
      'assets/user/js/vendor/incluid-bundle.js',
      'assets/user/js/nice-select.js',
      'assets/user/js/purecounter.js',
      'assets/user/js/fecha.js',
      'assets/user/js/hotel-datepicker.js',
      'assets/user/js/scripts.js',
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
      'assets/user/css/bootstrap.css',
      'assets/user/css/swiper-bundle.css',
      'assets/user/css/magnific-popup.css',
      'assets/user/css/datepicker.css',
      'assets/user/css/font-awesome-pro.css',
      'assets/user/css/main.css',
    );
    this.scriptLoader.remove(
      'assets/user/js/vendor/jquery.js',
      'assets/user/js/bootstrap-bundle.js',
      'assets/user/js/swiper-bundle.js',
      'assets/user/js/magnific-popup.js',
      'assets/user/js/vendor/incluid-bundle.js',
      'assets/user/js/nice-select.js',
      'assets/user/js/purecounter.js',
      'assets/user/js/fecha.js',
      'assets/user/js/hotel-datepicker.js',
      'assets/user/js/scripts.js',
    );
  }
}