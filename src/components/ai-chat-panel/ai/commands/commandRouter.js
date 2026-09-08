import { ATTRIBUTE_TYPES } from '../attributes/attributeTypes';
import { getDefaultAttributeRegistry } from '../attributes/attributeRegistry';
import { getResetValue } from '../attributes/attributeDefaults';
import { createAddOp, createIncrementOp, createMergeOp, createRemoveOp, createResetOp, createSetOp, createToggleOp, buildPatch } from './patchBuilder';
import { parseSlashCommand } from './slashParser';
import { parseNaturalLanguage } from './nlParser';
import { validateOp } from './patchValidators';
import { errorMessages } from './errorMessages';

const formatSuggestions = matches =>
	matches.map(match => ({
		type: 'attribute',
		label: match.path,
		value: match.path,
		meta: { block: match.block, kind: match.type },
	}));

const buildResponse = ({ ok, patch, error, suggestions, humanSummary }) => ({
	ok,
	patch: patch || [],
	error: error || null,
	suggestions: suggestions || [],
	humanSummary: humanSummary || '',
});

const resolveAttribute = (registry, pathInput, block) => {
	const resolved = registry.resolveAttribute(pathInput, { block });
	if (!resolved.entry) {
		return { entry: null, suggestions: formatSuggestions(resolved.matches || []) };
	}
	return { entry: resolved.entry, suggestions: [] };
};

export const routeCommand = (input, context = {}) => {
	const registry = context.registry || getDefaultAttributeRegistry();
	const block = context.blockName || context.block || '';

	const slash = parseSlashCommand(input);
	const parsed = slash || parseNaturalLanguage(input);

	if (!parsed) {
		return buildResponse({ ok: false, error: errorMessages.unknownCommand() });
	}

	const action = parsed.command || parsed.action || 'unknown';

	if (action === 'help') {
		const matches = registry.findAttribute(parsed.query || '', { block, limit: 10 });
		return buildResponse({
			ok: true,
			patch: [],
			suggestions: formatSuggestions(matches),
			humanSummary: matches.length ? 'Matching attributes.' : 'No matching attributes.',
		});
	}

	if (action === 'color') {
		const entry = registry.pickDefaultAttribute(block, { type: ATTRIBUTE_TYPES.COLOR });
		if (!entry) {
			return buildResponse({
				ok: false,
				error: errorMessages.unknownAttribute('color'),
				suggestions: formatSuggestions(registry.findAttribute('color', { block, limit: 8 })),
			});
		}
		const op = createSetOp(entry.path, parsed.query || '');
		const validation = validateOp(op, entry);
		if (!validation.ok) {
			return buildResponse({ ok: false, error: validation.error });
		}
		return buildResponse({
			ok: true,
			patch: buildPatch({ ...op, value: validation.value }),
			humanSummary: `Set ${entry.path} to ${validation.value}`,
		});
	}

	if (action === 'icon') {
		const entry = registry.pickDefaultAttribute(block, { type: ATTRIBUTE_TYPES.ICON });
		if (!entry) {
			return buildResponse({
				ok: false,
				error: errorMessages.unknownAttribute('icon'),
				suggestions: formatSuggestions(registry.findAttribute('icon', { block, limit: 8 })),
			});
		}
		const op = createSetOp(entry.path, parsed.query || '');
		const validation = validateOp(op, entry);
		if (!validation.ok) {
			return buildResponse({ ok: false, error: validation.error });
		}
		return buildResponse({
			ok: true,
			patch: buildPatch({ ...op, value: validation.value }),
			humanSummary: `Set ${entry.path} to ${validation.value}`,
		});
	}

	const pathInput = parsed.path || parsed.attributeHint;
	const { entry, suggestions } = resolveAttribute(registry, pathInput, block);
	if (!entry) {
		return buildResponse({
			ok: false,
			error: errorMessages.unknownAttribute(pathInput || ''),
			suggestions,
		});
	}

	let op = null;

	switch (action) {
		case 'set': {
			const value = parsed.value || parsed.valueHint;
			op = createSetOp(entry.path, value);
			break;
		}
		case 'toggle': {
			if (parsed.valueHint === 'enable') {
				op = createSetOp(entry.path, true);
			} else if (parsed.valueHint === 'disable') {
				op = createSetOp(entry.path, false);
			} else {
				op = createToggleOp(entry.path);
			}
			break;
		}
		case 'reset': {
			op = createResetOp(entry.path, getResetValue(entry));
			break;
		}
		case 'increment': {
			op = createIncrementOp(entry.path, parsed.amount || parsed.value || '1');
			break;
		}
		case 'merge': {
			op = createMergeOp(entry.path, parsed.value || {});
			break;
		}
		case 'add': {
			op = createAddOp(entry.path, parsed.value);
			break;
		}
		case 'remove': {
			op = createRemoveOp(entry.path, parsed.value);
			break;
		}
		default:
			return buildResponse({ ok: false, error: errorMessages.unknownCommand() });
	}

	const validation = validateOp(op, entry);
	if (!validation.ok) {
		return buildResponse({ ok: false, error: validation.error });
	}

	let patchedOp = op;
	if (validation.value !== undefined) {
		patchedOp = { ...op, value: validation.value };
	}
	if (validation.amount !== undefined) {
		patchedOp = { ...op, amount: validation.amount };
	}

	return buildResponse({
		ok: true,
		patch: buildPatch(patchedOp),
		humanSummary: `${action} ${entry.path}`,
	});
};

export default routeCommand;
