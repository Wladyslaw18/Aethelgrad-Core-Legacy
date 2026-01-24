import { init as initBroadcasts } from "../services/broadcasts.js";
import { init as initCleaner } from "../services/cleaner.js";
import { init as initCompass } from "../features/compass/compass.js";
import { init as initTerms } from "../features/terms/termsUi.js";
import { startNaturalRegen } from "../services/naturalRegen.js";

export function init() {
    // WORKAROUND: Bedrock Module Loading Race Condition
    // PROBLEM: Modules sometimes fail to initialize silently on world load
    // WHY NEEDED: API 2.4.0 doesn't guarantee module load order or success
    // DO NOT REMOVE: Without try-catch, entire addon may fail silently
    // API VERSION: 2.4.0 Stable - inconsistent behavior across game versions
    try { initBroadcasts(); } catch (e) { console.warn("[bootstrap/services] initBroadcasts failed:", e); }
    try { initCleaner(); } catch (e) { console.warn("[bootstrap/services] initCleaner failed:", e); }
    try { initCompass(); } catch (e) { console.warn("[bootstrap/services] initCompass failed:", e); }
    try { initTerms(); } catch (e) { console.warn("[bootstrap/services] initTerms failed:", e); }
    try { startNaturalRegen(); } catch (e) { console.warn("[bootstrap/services] startNaturalRegen failed:", e); }
    console.warn("[bootstrap/services] bootstrapped.");
}