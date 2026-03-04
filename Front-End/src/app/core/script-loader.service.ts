import { Injectable } from '@angular/core';

/**
 * ScriptLoaderService
 * ─────────────────────────────────────────────────────────────────
 * Solves the #1 issue with multi-template Angular apps:
 *   • Template JS files conflict when loaded together
 *   • Scripts must load in order (jQuery → Bootstrap → plugins → custom)
 *   • Scripts must be removed when navigating between layouts
 *   • Duplicate script tags must be avoided
 *
 * Usage:
 *   // Load scripts in order (waits for each before loading next)
 *   await this.scriptLoader.loadScriptsSequentially([
 *     'assets/dashboard/vendors/jquery/jquery.min.js',
 *     'assets/dashboard/vendors/bootstrap/bootstrap.bundle.min.js',
 *     'assets/dashboard/js/dashboard.js',
 *   ]);
 *
 *   // Remove scripts when component destroys
 *   this.scriptLoader.removeScripts([...]);
 */
@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {

  private loadedScripts: Map<string, HTMLScriptElement> = new Map();

  /**
   * Load scripts ONE BY ONE in order.
   * Each script waits for the previous to finish loading.
   * Skips already-loaded scripts.
   */
  loadScriptsSequentially(scripts: string[]): Promise<void> {
    return scripts.reduce((promise, src) => {
      return promise.then(() => this.loadScript(src));
    }, Promise.resolve());
  }

  /**
   * Load a single script. Returns a Promise that resolves when loaded.
   * If the script is already loaded, resolves immediately.
   */
  loadScript(src: string): Promise<void> {
    // Already loaded — skip
    if (this.loadedScripts.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.type = 'text/javascript';
      script.async = false; // Keep order

      script.onload = () => {
        this.loadedScripts.set(src, script);
        resolve();
      };

      script.onerror = (err) => {
        console.warn(`[ScriptLoader] Failed to load: ${src}`, err);
        resolve(); // Resolve anyway so chain continues
      };

      document.body.appendChild(script);
    });
  }

  /**
   * Remove scripts from DOM and internal registry.
   * Call this in ngOnDestroy to prevent conflicts when switching layouts.
   */
  removeScripts(scripts: string[]): void {
    scripts.forEach((src) => {
      const scriptEl = this.loadedScripts.get(src);
      if (scriptEl && document.body.contains(scriptEl)) {
        document.body.removeChild(scriptEl);
      }
      this.loadedScripts.delete(src);
    });
  }

  /**
   * Check if a script is currently loaded
   */
  isLoaded(src: string): boolean {
    return this.loadedScripts.has(src);
  }

  /**
   * Remove ALL loaded scripts (use with caution)
   */
  removeAllScripts(): void {
    this.loadedScripts.forEach((scriptEl, src) => {
      if (document.body.contains(scriptEl)) {
        document.body.removeChild(scriptEl);
      }
    });
    this.loadedScripts.clear();
  }
}