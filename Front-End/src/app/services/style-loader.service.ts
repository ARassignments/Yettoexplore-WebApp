import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StyleLoaderService {

  private loadedStyles = new Map<string, HTMLLinkElement>();

  load(...urls: string[]): void {
    urls.forEach(url => {
      if (this.loadedStyles.has(url)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
      this.loadedStyles.set(url, link);
    });
  }

  remove(...urls: string[]): void {
    urls.forEach(url => {
      const el = this.loadedStyles.get(url);
      if (el) { el.remove(); this.loadedStyles.delete(url); }
    });
  }
}