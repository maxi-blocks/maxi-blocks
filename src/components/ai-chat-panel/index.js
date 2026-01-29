export { buildAttributeRegistry, getDefaultAttributeRegistry } from './ai/attributes/attributeRegistry';
export { normalizeAttributes } from './ai/attributes/normalizeAttributes';
export { buildCoverageReport } from './ai/attributes/attributeCoverage';

export { routeCommand } from './ai/commands/commandRouter';
export { parseSlashCommand } from './ai/commands/slashParser';
export { parseNaturalLanguage } from './ai/commands/nlParser';

export { buildSuggestions } from './ai/suggestions/buildSuggestions';
export { normalizeColorInput } from './ai/color/colorUtils';

export { applyPatchToAttributes } from './ai/editorBridge/applyPatch';

export { parseActionEnvelope } from './ai/actions/actions.parse';
export { validateActionEnvelopeDeep } from './ai/actions/actions.validate';
export { executeActionEnvelope } from './ai/actions/actions.execute';
export { planActionEnvelope } from './ai/actions/actions.plan';

export { default as AiChatPanel } from './AiChatPanel';
export { mountAiChatPanel, unmountAiChatPanel } from './mount';

