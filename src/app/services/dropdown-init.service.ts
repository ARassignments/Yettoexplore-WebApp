import { Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DropdownInitService {

  constructor(private ngZone: NgZone) { }

  init(delayMs: number = 0): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.tryInit(0), delayMs);
    });
  }

  // ✅ Retry 10 times until Bootstrap is ready
  private tryInit(attempt: number): void {
    const win = window as any;
    const maxAttempts = 10;

    if (!win.bootstrap?.Dropdown) {
      if (attempt < maxAttempts) {
        setTimeout(() => this.tryInit(attempt + 1), 200);
      } else {
        console.warn('Bootstrap Dropdown not available after retries');
      }
      return;
    }

    this.initAllDropdowns();
  }

  private initAllDropdowns(): void {
    const win = window as any;
    const $ = win.$ || win.jQuery;

    try {
      // Step 1 — Remove stuck classes
      document.querySelectorAll('.dropdown-menu.show')
        .forEach(el => el.classList.remove('show'));
      document.querySelectorAll('.dropdown.show, .nav-item.show')
        .forEach(el => el.classList.remove('show'));

      // Step 2 — Dispose old instances
      document.querySelectorAll('[data-bs-toggle="dropdown"]')
        .forEach((el: any) => {
          try {
            const old = win.bootstrap.Dropdown.getInstance(el);
            if (old) old.dispose();
          } catch (e) { }
        });

      // Step 3 — Fresh Bootstrap init
      document.querySelectorAll('[data-bs-toggle="dropdown"]')
        .forEach((el: any) => {
          try {
            new win.bootstrap.Dropdown(el, { autoClose: true });
          } catch (e) { }
        });

      // ✅ Step 4 — jQuery manual toggle with CSS force
      if ($) {
        $(document).off('click.dropdown.reinit');
        $(document).on(
          'click.dropdown.reinit',
          '[data-bs-toggle="dropdown"]',
          function (this: any, e: any) {
            e.preventDefault();
            e.stopPropagation();

            const $toggle = $(this);
            const $menu = $toggle.next('.dropdown-menu, [class*="dropdown-menu"]');
            const $parent = $toggle.closest('.dropdown, .nav-item');
            const isOpen = $menu.hasClass('show');

            // Close all other dropdowns first
            $('.dropdown-menu.show').each(function (this: any) {
              if (!$(this).is($menu)) {
                $(this).removeClass('show');
                $(this).closest('.dropdown, .nav-item').removeClass('show');
              }
            });

            // Toggle this dropdown
            if (isOpen) {
              $menu.removeClass('show');
              $parent.removeClass('show');
              $toggle.attr('aria-expanded', 'false');
            } else {
              $menu.addClass('show');
              $parent.addClass('show');
              $toggle.attr('aria-expanded', 'true');

              // ✅ Force CSS visibility
              $menu.css({
                'display': 'block',
                'opacity': '1',
                'visibility': 'visible',
                'pointer-events': 'auto',
                'z-index': '9999'
              });
            }
          }
        );

        // ✅ Close on outside click
        $(document).off('click.dropdown.outside');
        $(document).on('click.dropdown.outside', function (e: any) {
          if (!$(e.target).closest('.dropdown, .nav-item.dropdown').length) {
            $('.dropdown-menu.show').each(function (this: any) {
              $(this).removeClass('show');
              // Reset inline styles
              $(this).css({
                'display': '',
                'opacity': '',
                'visibility': '',
                'pointer-events': '',
                'z-index': ''
              });
            });
            $('.dropdown.show, .nav-item.show').removeClass('show');
          }
        });
      }

      console.log('✅ Dropdowns inited:',
        document.querySelectorAll('[data-bs-toggle="dropdown"]').length
      );

    } catch (e) {
      console.warn('Dropdown init error:', e);
    }
  }
}