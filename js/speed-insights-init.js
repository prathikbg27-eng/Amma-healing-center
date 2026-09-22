/**
 * Vercel Speed Insights Initialization
 * This file initializes Vercel Speed Insights for the static site
 */

import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights
injectSpeedInsights({
  debug: false
});
