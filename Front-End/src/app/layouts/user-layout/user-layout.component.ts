import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ScriptLoaderService } from '../../services/script-loader.service';
import { StyleLoaderService } from '../../services/style-loader.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],  // ← Add this
  templateUrl: './user-layout.component.html',
})
export class UserLayoutComponent implements OnInit, OnDestroy {

  constructor(
    private scriptLoader: ScriptLoaderService,
    private styleLoader: StyleLoaderService
  ) {}

  ngOnInit(): void {
    this.styleLoader.load(
      'assets/user/css/bootstrap.css',
      'assets/user/css/swiper-bundle.css',
      'assets/user/css/magnific-popup.css',
      'assets/user/css/font-awesome-pro.css',
      'assets/user/css/main.css',
    );
    this.scriptLoader.load(
      'assets/user/js/vendor/jquery.js',
      'assets/user/js/bootstrap-bundle.js',
      'assets/user/js/swiper-bundle.js',
      'assets/user/js/magnific-popup.js',
      'assets/user/js/vendor/incluid-bundle.js',
      'assets/user/js/nice-select.js',
      'assets/user/js/purecounter.js',
      'assets/user/js/scripts.js',
    );
  }

  ngOnDestroy(): void {
    this.styleLoader.remove(
      'assets/user/css/bootstrap.css',
      'assets/user/css/swiper-bundle.css',
      'assets/user/css/magnific-popup.css',
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
      'assets/user/js/scripts.js',
    );
  }
}