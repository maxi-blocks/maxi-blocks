/**
 * AI Chat — message routing pipeline.
 *
 * Usage in the hook:
 *   import { buildRoutingContext, routeClientSide } from '../ai/router';
 */

export { buildRoutingContext } from './intentRouter';
export { routeClientSide } from './commandRouter';
export { isSlashCommand, parseSlashCommand } from './slashCommands';
