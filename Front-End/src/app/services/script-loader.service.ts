import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {

  private loadedScripts = new Map<string, HTMLScriptElement>();
  private pendingScripts = new Map<string, Promise<void>>();

  load(...urls: string[]): Promise<void> {
    return urls.reduce(
      (chain, url) => chain.then(() => this.loadScript(url)),
      Promise.resolve()
    );
  }

  private loadScript(url: string): Promise<void> {
    // ✅ Already loaded — skip, don't reload
    if (this.loadedScripts.has(url)) {
      return Promise.resolve();
    }

    // ✅ Currently loading — return same promise
    if (this.pendingScripts.has(url)) {
      return this.pendingScripts.get(url)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = false;
      script.onload = () => {
        this.loadedScripts.set(url, script);
        this.pendingScripts.delete(url);
        resolve();
      };
      script.onerror = () => {
        this.pendingScripts.delete(url);
        reject(`Failed to load script: ${url}`);
      };
      document.body.appendChild(script);
    });

    this.pendingScripts.set(url, promise);
    return promise;
  }

  // ✅ Only call this when switching between DIFFERENT templates
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

  isLoaded(url: string): boolean {
    return this.loadedScripts.has(url);
  }

  removeAll(): void {
    this.loadedScripts.forEach(el => el.remove());
    this.loadedScripts.clear();
    this.pendingScripts.clear();
  }
}