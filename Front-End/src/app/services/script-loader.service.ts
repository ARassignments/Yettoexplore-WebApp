import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScriptLoaderService {

  private loadedScripts = new Map<string, HTMLScriptElement>();

  load(...urls: string[]): Promise<void> {
    return urls.reduce(
      (chain, url) => chain.then(() => this.loadScript(url)),
      Promise.resolve()
    );
  }

  private loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedScripts.has(url)) { resolve(); return; }
      const script = document.createElement('script');
      script.src = url;
      script.async = false;
      script.onload = () => { this.loadedScripts.set(url, script); resolve(); };
      script.onerror = () => reject(`Failed: ${url}`);
      document.body.appendChild(script);
    });
  }

  remove(...urls: string[]): void {
    urls.forEach(url => {
      const el = this.loadedScripts.get(url);
      if (el) { el.remove(); this.loadedScripts.delete(url); }
    });
  }
}