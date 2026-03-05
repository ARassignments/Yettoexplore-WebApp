import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StyleLoaderService {

  private loadedStyles = new Map<string, HTMLLinkElement>();

  load(...urls: string[]): Promise<void[]> {
    const promises = urls.map(url => this.loadStyle(url));
    return Promise.all(promises);
  }

  private loadStyle(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Already loaded — resolve immediately
      if (this.loadedStyles.has(url)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;

      // Resolve only after CSS is fully loaded
      link.onload = () => {
        this.loadedStyles.set(url, link);
        resolve();
      };

      link.onerror = () => {
        reject(`Failed to load style: ${url}`);
      };

      document.head.appendChild(link);
    });
  }

  remove(...urls: string[]): void {
    urls.forEach(url => {
      const el = this.loadedStyles.get(url);
      if (el) { el.remove(); this.loadedStyles.delete(url); }
    });
  }
}