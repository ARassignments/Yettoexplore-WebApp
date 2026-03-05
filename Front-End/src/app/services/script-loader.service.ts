import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {

  private loadedScripts = new Map<string, HTMLScriptElement>();
  private pendingScripts = new Map<string, Promise<void>>();

  // Loads scripts SEQUENTIALLY (order guaranteed)
  load(...urls: string[]): Promise<void> {
    return urls.reduce(
      (chain, url) => chain.then(() => this.loadScript(url)),
      Promise.resolve()
    );
  }

  private loadScript(url: string): Promise<void> {

    // Already fully loaded — skip
    if (this.loadedScripts.has(url)) {
      return Promise.resolve();
    }

    // Currently loading — return same promise (avoid duplicate tags)
    if (this.pendingScripts.has(url)) {
      return this.pendingScripts.get(url)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = false;        // ← FALSE keeps order guaranteed
      script.defer = false;        // ← FALSE ensures immediate execution

      script.onload = () => {
        this.loadedScripts.set(url, script);
        this.pendingScripts.delete(url);  // ← Clean up pending
        resolve();
      };

      script.onerror = () => {
        this.pendingScripts.delete(url);  // ← Clean up on error too
        reject(`Failed to load script: ${url}`);
      };

      document.body.appendChild(script);
    });

    // Track as pending while loading
    this.pendingScripts.set(url, promise);
    return promise;
  }

  // Reload a script even if already loaded (force refresh)
  reload(...urls: string[]): Promise<void> {
    this.remove(...urls);
    return this.load(...urls);
  }

  remove(...urls: string[]): void {
    urls.forEach(url => {
      const el = this.loadedScripts.get(url);
      if (el) {
        el.remove();
        this.loadedScripts.delete(url);
      }
      this.pendingScripts.delete(url);
    });
  }

  // Check if a script is already loaded
  isLoaded(url: string): boolean {
    return this.loadedScripts.has(url);
  }

  // Remove all loaded scripts at once
  removeAll(): void {
    this.loadedScripts.forEach(el => el.remove());
    this.loadedScripts.clear();
    this.pendingScripts.clear();
  }
}