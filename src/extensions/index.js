import './store';
import './attributes';
import './custom-data';
import './dom';
import './save';
import './styles';
import './text';
import './video';
import './style-cards';
import './column-templates';
import './svg';
import './indicators';

// Initialize memory management for long editing sessions
import { startPeriodicCleanup, registerCacheCleanup } from './maxi-block/memoryUtils';
import { clearCSSVariableCache } from './style-cards/getPaletteColor';

// Register known caches for cleanup
registerCacheCleanup('cssVariableCache', clearCSSVariableCache);

// Start periodic cleanup (runs every 5 minutes when tab is hidden)
startPeriodicCleanup();

