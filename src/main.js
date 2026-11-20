import { inject } from '@vercel/analytics';
import { MangaUI } from './manga.js';

// Vercel Telemetry Analytics
inject();

// Initialize Zerotsudio Manga UI Runtime Engine
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => MangaUI.init());
} else {
  MangaUI.init();
}
