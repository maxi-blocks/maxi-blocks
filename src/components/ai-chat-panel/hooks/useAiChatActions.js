/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { dispatch, select } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { openSidebarAccordion } from '@extensions/inspector/inspectorPath';
import getClientIdFromUniqueId from '@extensions/attributes/getClientIdFromUniqueId';
import ACTION_PROPERTY_ALIASES from '../ai/actions/actionPropertyAliases';
import { findBestIcon, extractIconQuery } from '../iconSearch';
import { getAiHandlerForBlock, getAiFlowConfig } from '../ai/registry';
import { executeCloudModalUiOps } from '../utils/aiCloudModalDriver';
import { insertMaxiCloudLibraryBlock } from '../utils/insertMaxiCloudLibraryBlock';
import { getDcGroupSidebarTarget } from '../ai/utils/dcGroup';
import { getAccordionSidebarTarget } from '../ai/blocks/accordion';
import { getColumnSidebarTarget } from '../ai/blocks/column';
import { getDividerSidebarTarget } from '../ai/blocks/divider';
import { getIconSidebarTarget } from '../ai/blocks/icon';
import { getImageSidebarTarget } from '../ai/blocks/image';
import { getNumberCounterSidebarTarget } from '../ai/blocks/number-counter';
import {
	getButtonAGroupSidebarTarget,
	getButtonBGroupSidebarTarget,
	getButtonCGroupSidebarTarget,
	getButtonIGroupSidebarTarget,
	buildButtonCGroupAttributeChanges,
	buildButtonIGroupAttributeChanges,
} from '../ai/utils/buttonGroups';
import {
	getContainerAGroupSidebarTarget,
	getContainerBGroupSidebarTarget,
	getContainerCGroupSidebarTarget,
	getContainerDGroupSidebarTarget,
	getContainerEGroupSidebarTarget,
	getContainerFGroupSidebarTarget,
	getContainerHGroupSidebarTarget,
	getContainerLGroupSidebarTarget,
	getContainerMGroupSidebarTarget,
	getContainerOGroupSidebarTarget,
	getContainerPGroupSidebarTarget,
	getContainerRGroupSidebarTarget,
	getContainerSGroupSidebarTarget,
	getContainerTGroupSidebarTarget,
	getContainerWGroupSidebarTarget,
	getContainerZGroupSidebarTarget,
	buildContainerOGroupAttributeChanges,
	buildContainerPGroupAttributeChanges,
	buildContainerRGroupAttributeChanges,
	buildContainerSGroupAttributeChanges,
	buildContainerTGroupAttributeChanges,
	buildContainerWGroupAttributeChanges,
	buildContainerZGroupAttributeChanges,
} from '../ai/utils/containerGroups';
import {
	getTextCGroupSidebarTarget,
	getTextLGroupSidebarTarget,
	getTextPGroupSidebarTarget,
	getTextListGroupSidebarTarget,
	getTextTypographySidebarTarget,
	buildTextCGroupAttributeChanges,
	buildTextLGroupAttributeChanges,
} from '../ai/utils/textGroup';
import { getAdvancedCssSidebarTarget } from '../ai/utils/advancedCssAGroup';
import { getMetaSidebarTarget } from '../ai/utils/metaAGroup';
import { collectBlocks, getBlockPrefix } from '../ai/utils/blockHelpers';
import updateBackgroundColor from '../ai/color/backgroundUpdate';
import {
	updateMargin,
	updateBorder,
	updateBorderRadius,
	updateBoxShadow,
	removeBoxShadow,
	createResponsiveSpacing,
	updateFontSize,
	updateFontWeight,
	updateTextColor,
	updateImageFit,
} from '../ai/utils/cssBuilders';
import {
	buildWidthChanges,
	buildHeightChanges,
} from '../ai/utils/responsiveHelpers';

/**
 * Provides the action parsing and execution layer for the AI chat panel.
 *
 * @param {Object}   args
 * @param {string}   args.scope                    Current AI scope.
 * @param {Object}   args.selectedBlock             Currently selected block.
 * @param {Object}   args.conversationContext       Current FSM context.
 * @param {Function} args.setConversationContext    State setter.
 * @param {Function} args.setMessages               State setter for messages.
 * @param {Function} args.handleUpdatePage          From useAiChatBlocks.
 * @param {Function} args.handleUpdateSelection     From useAiChatBlocks.
 * @param {Function} args.applyHoverAnimation       From useAiChatBlocks.
 * @param {Function} args.openSidebarForProperty    From useAiChatSidebar (hook-level).
 * @param {Function} args.buildRecoveryResponse     From useAiChatRecovery.
 * @param {Function} args.getContentAreaClientId    From useAiChatCloud.
 * @param {Function} args.updateBlockAttributes     WP dispatch.
 * @param {Function} args.handleUpdateStyleCard     From style-card handlers.
 * @param {Function} args.handleApplyTheme          From style-card handlers.
 * @param {Function} args.logAIDebug                Conditional debug logger.
 * @returns {{ parseAndExecuteAction: Function, normalizeActionProperty: Function, resolveButtonIconFromTypesense: Function }}
 */
const useAiChatActions = ({
	scope,
	selectedBlock,
	conversationContext,
	setConversationContext,
	setMessages,
	handleUpdatePage,
	handleUpdateSelection,
	applyHoverAnimation,
	openSidebarForProperty: openSidebarForPropertyExternal,
	buildRecoveryResponse,
	getContentAreaClientId,
	updateBlockAttributes,
	handleUpdateStyleCard,
	handleApplyTheme,
	logAIDebug,
}) => {
	/**
	 * Normalises a property key and coerces its value for known special cases.
	 *
	 * @param {string} property
	 * @param {*}      value
	 * @returns {{ property: string, value: * }}
	 */
	const normalizeActionProperty = (property, value) => {
		if (!property) return { property, value };

		let nextProperty = ACTION_PROPERTY_ALIASES[property] || property;
		nextProperty = String(nextProperty).replace(/-/g, '_');
		if (nextProperty.startsWith('cl_') || nextProperty.startsWith('dc_')) {
			return { property: nextProperty, value };
		}

		const breakpointMatch = nextProperty.match(/_(general|xxl|xl|l|m|s|xs)$/);
		const breakpoint = breakpointMatch ? breakpointMatch[1] : null;
		const baseProperty = breakpoint
			? nextProperty.slice(0, -(`_${breakpoint}`.length))
			: nextProperty;

		if (baseProperty === 'anchor_link') {
			const valueString =
				typeof value === 'string'
					? value
					: value && typeof value === 'object'
						? value.url || value.href || ''
						: '';
			if (
				valueString &&
				/(https?:\/\/[^\s"']+|www\.[^\s"']+|[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s"']*)?)/i.test(
					valueString
				)
			) {
				if (typeof window !== 'undefined' && window.maxiBlocksDebug) {
					console.log('[Maxi AI Debug] Coercing anchor_link to link_settings for URL:', valueString);
				}
				const linkValue =
					value && typeof value === 'object'
						? { ...value, url: valueString }
						: { url: valueString };
				return { property: 'link_settings', value: linkValue };
			}
		}

		if (
			baseProperty === 'background_palette_color' ||
			baseProperty === 'background_color'
		) {
			let nextValue = value;
			if (typeof nextValue === 'string') {
				const trimmed = nextValue.trim();
				if (/^\d+$/.test(trimmed)) {
					nextValue = Number(trimmed);
				} else {
					const paletteMatch = trimmed.match(
						/^var\(--(?:bg|maxi-light-color|maxi-color)-(\d+)\)$/
					);
					if (paletteMatch) nextValue = Number(paletteMatch[1]);
				}
			}
			return {
				property: 'background_color',
				value: breakpoint ? { value: nextValue, breakpoint } : nextValue,
			};
		}

		if (baseProperty === 'border_radius' && breakpoint) {
			return { property: 'border_radius', value: { value, breakpoint } };
		}
		if (baseProperty === 'column_size' && breakpoint) {
			return { property: 'column_size', value: { value, breakpoint } };
		}
		if (baseProperty === 'column_fit_content' && breakpoint) {
			return { property: 'column_fit_content', value: { value, breakpoint } };
		}

		if (
			[
				'arrow_status', 'arrow_side', 'arrow_position', 'arrow_width',
				'advanced_css', 'custom_css', 'column_gap',
				'icon_background', 'icon_border', 'icon_border_radius',
				'icon_fill_color', 'icon_force_aspect_ratio', 'icon_height',
				'icon_padding', 'icon_spacing', 'icon_stroke_color',
				'icon_stroke_width', 'icon_width',
				'flex_basis', 'flex_grow', 'flex_shrink', 'flex_direction',
				'flex_wrap', 'force_aspect_ratio', 'full_width', 'height',
			].includes(baseProperty) && breakpoint
		) {
			return { property: baseProperty, value: { value, breakpoint } };
		}

		if (
			breakpoint &&
			(baseProperty.startsWith('link_color') || baseProperty.startsWith('link_palette_'))
		) {
			return { property: baseProperty, value: { value, breakpoint } };
		}

		if (baseProperty === 'display' && breakpoint) {
			return { property: 'display', value: { value, breakpoint } };
		}
		if (baseProperty === 'breakpoints' && breakpoint) {
			return { property: 'breakpoints', value: { value, breakpoint } };
		}
		if (baseProperty === 'link_target') {
			let targetValue = value;
			if (typeof targetValue === 'string') {
				const lowered = targetValue.toLowerCase();
				if (lowered.includes('blank') || lowered.includes('new')) targetValue = '_blank';
				else if (lowered.includes('self') || lowered.includes('same')) targetValue = '_self';
			}
			return { property: 'link_settings', value: { target: targetValue } };
		}
		if (baseProperty === 'link_rel') return { property: 'link_settings', value: { rel: value } };
		if (baseProperty === 'link_url') return { property: 'link_settings', value: { url: value } };

		return { property: baseProperty, value };
	};

	const normalizeIconQueryValue = value => {
		const raw = String(value || '').trim();
		if (!raw) return '';
		const normalized = raw.replace(/[-_]+/g, ' ');
		return extractIconQuery(normalized) || normalized;
	};

	/**
	 * Resolves an icon-content property value to an actual SVG from Typesense Cloud.
	 *
	 * @param {{ property: string, value: *, targetBlock: string }} args
	 * @returns {Promise<Object|null>}
	 */
	const resolveButtonIconFromTypesense = async ({ property, value, targetBlock }) => {
		if (!property) return null;
		const iconProperties = new Set([
			'button_icon_add', 'button_icon_change', 'icon_content', 'icon_content_hover',
		]);
		if (!iconProperties.has(property)) return null;
		if (targetBlock && targetBlock !== 'button') return null;

		const isButtonTarget =
			targetBlock === 'button' ||
			String(property).startsWith('button_icon') ||
			selectedBlock?.name?.includes('button');
		if (!isButtonTarget) return null;
		if (typeof value !== 'string') return null;

		const trimmed = value.trim();
		if (!trimmed) return null;
		if (/^(none|null|remove|delete|clear)$/i.test(trimmed)) return null;
		if (/<svg\b/i.test(trimmed)) return null;
		if (/\b(each|per-block|per-column|different|various|multiple|list|all-columns)\b/i.test(trimmed)) {
			return { error: 'Cannot set different icons per-block with update_page. Use MODIFY_BLOCK with ops to set individual icons.' };
		}

		const query = normalizeIconQueryValue(trimmed);
		if (!query) return null;

		const iconResult = await findBestIcon(query, { target: 'icon' });
		if (!iconResult || !iconResult.svgCode) {
			return { error: `I couldn't find an icon for "${query}" in the Cloud Library.` };
		}
		if (iconResult.isPro) {
			return { error: `Found "${iconResult.title}" but it's a Pro icon. Upgrade to MaxiBlocks Pro to use it.` };
		}
		if (property === 'icon_content_hover') {
			return {
				property: 'icon_content_hover',
				value: iconResult.svgCode,
				targetBlock: 'button',
				message: `Updated hover icon to "${iconResult.title}".`,
			};
		}
		return {
			property: 'button_icon_svg',
			value: { svgCode: iconResult.svgCode, svgType: iconResult.svgType, title: iconResult.title },
			targetBlock: 'button',
			message: `Updated icon to "${iconResult.title}".`,
		};
	};

	// ─── Internal sidebar opener (extends the hook-level one with link-toolbar handling) ──

	const getToolbarDocuments = () => {
		const docs = [];
		if (typeof document === 'undefined') return docs;
		docs.push(document);
		document.querySelectorAll('iframe').forEach(frame => {
			try { if (frame.contentDocument) docs.push(frame.contentDocument); } catch (err) { logAIDebug('Unable to access iframe document', String(err)); }
		});
		return docs;
	};

	const getToolbarWindows = () => {
		const wins = [];
		if (typeof window === 'undefined') return wins;
		wins.push(window);
		if (typeof document === 'undefined') return wins;
		document.querySelectorAll('iframe').forEach(frame => {
			try { if (frame.contentWindow) wins.push(frame.contentWindow); } catch (err) { logAIDebug('Unable to access iframe window', String(err)); }
		});
		return wins;
	};

	const tryClickToolbarButton = (selector, label) => {
		if (typeof window === 'undefined') return false;
		const docs = getToolbarDocuments();
		for (const doc of docs) {
			let button = null;
			const toolbar = doc.querySelector('.maxi-toolbar__popover');
			if (toolbar) button = toolbar.querySelector(selector);
			if (!button) button = doc.querySelector(selector);
			if (!button) continue;
			if (button.getAttribute('aria-expanded') === 'true') { logAIDebug('Toolbar button already open for', label); return true; }
			if (button.hasAttribute('disabled') || button.getAttribute('aria-disabled') === 'true') { logAIDebug('Toolbar button disabled for', label); return false; }
			button.click();
			logAIDebug('Toolbar button clicked for', label);
			return true;
		}
		logAIDebug('Toolbar popover or button not found for', label);
		return false;
	};

	const scheduleToolbarClick = (selector, label, attempts = 3, delay = 150) => {
		let tries = 0;
		const attempt = () => {
			tries += 1;
			const success = tryClickToolbarButton(selector, label);
			if (!success && tries < attempts) setTimeout(attempt, delay);
		};
		attempt();
	};

	const queueToolbarOpen = (target, clientId, options = {}) => {
		if (typeof window === 'undefined' || !target) return;
		const detail = { target, clientId, ...options };
		getToolbarWindows().forEach(win => {
			try {
				win.maxiToolbarOpenRequest = { ...detail, requestedAt: Date.now() };
				win.dispatchEvent(new win.CustomEvent('maxi-toolbar-open', { detail }));
			} catch (err) { logAIDebug('Failed to dispatch toolbar open event', String(err)); }
		});
	};

	const openLinkToolbar = () => {
		const targetClientId = selectedBlock?.clientId;
		if (!targetClientId || typeof window === 'undefined') return;
		try {
			dispatch('core/block-editor').selectBlock(targetClientId);
			logAIDebug('Re-selected block before opening link toolbar', { clientId: targetClientId, block: selectedBlock?.name });
		} catch (err) { logAIDebug('Failed to re-select block before opening link toolbar', String(err)); }
		setTimeout(() => {
			queueToolbarOpen('link', targetClientId, { force: true });
			scheduleToolbarClick('.toolbar-item__link.toolbar-item__button, .toolbar-item__link', 'link');
		}, 150);
		logAIDebug('Requested link toolbar open', { clientId: targetClientId, block: selectedBlock?.name });
	};

	const openTextLinkToolbar = () => {
		const targetClientId = selectedBlock?.clientId;
		if (!targetClientId || typeof window === 'undefined') return;
		try {
			dispatch('core/block-editor').selectBlock(targetClientId);
			logAIDebug('Re-selected block before opening text-link toolbar', { clientId: targetClientId, block: selectedBlock?.name });
		} catch (err) { logAIDebug('Failed to re-select block before opening text-link toolbar', String(err)); }
		setTimeout(() => {
			queueToolbarOpen('text-link', targetClientId, { force: true });
			scheduleToolbarClick('.toolbar-item__text-link.toolbar-item__button, .toolbar-item__text-link .toolbar-item__button', 'text-link');
		}, 150);
		logAIDebug('Requested text-link toolbar open', { clientId: targetClientId, block: selectedBlock?.name });
	};

	const openLinkSettingsTab = state => {
		if (!state || state === 'link' || typeof document === 'undefined') return;
		const labelMap = { link: 'Link', hover: 'Hover', active: 'Active', visited: 'Visited' };
		const label = labelMap[state];
		if (!label) return;
		setTimeout(() => {
			const containers = document.querySelectorAll('.maxi-typography-control__link-options');
			if (!containers.length) return;
			const targetLabel = label.toLowerCase();
			for (const container of containers) {
				for (const button of container.querySelectorAll('button, [role="tab"]')) {
					if (button.textContent?.trim().toLowerCase() === targetLabel) { button.click(); return; }
				}
			}
		}, 200);
	};

	/**
	 * Internal sidebar opener that also handles link / text-link toolbar opening.
	 * Delegates everything else to the hook-level openSidebarForProperty.
	 *
	 * @param {string} rawProperty
	 */
	const openSidebarForProperty = rawProperty => {
		if (!rawProperty) return;
		const property = String(rawProperty).replace(/-/g, '_');
		const baseProperty = property.replace(/_(general|xxl|xl|l|m|s|xs)$/, '');
		const normalizedProperty = baseProperty;
		const isTextBlock =
			selectedBlock?.name?.includes('text-maxi') ||
			selectedBlock?.name?.includes('list-item-maxi');

		if (normalizedProperty === 'text_link') {
			logAIDebug('Text link property detected for toolbar open', { property: normalizedProperty, rawProperty });
			openTextLinkToolbar();
			return;
		}
		const isLinkProperty =
			normalizedProperty === 'link_settings' ||
			normalizedProperty === 'link' ||
			normalizedProperty.startsWith('dc_link');
		if (isLinkProperty) {
			logAIDebug('Link property detected for sidebar open', { property: normalizedProperty, rawProperty });
			if (isTextBlock) openTextLinkToolbar();
			else openLinkToolbar();
			return;
		}

		// Sidebar targets specific to the inner context (relations etc. — not in hook-level version)
		const dcTarget = getDcGroupSidebarTarget(normalizedProperty, selectedBlock?.name);
		if (dcTarget) { openSidebarAccordion(dcTarget.tabIndex, dcTarget.accordion); return; }

		if (selectedBlock?.name?.includes('accordion')) {
			const t = getAccordionSidebarTarget(normalizedProperty);
			if (t) { openSidebarAccordion(t.tabIndex, t.accordion); return; }
		}
		if (selectedBlock?.name?.includes('column')) {
			const t = getColumnSidebarTarget(normalizedProperty);
			if (t) { openSidebarAccordion(t.tabIndex, t.accordion); return; }
		}
		if (selectedBlock?.name?.includes('divider')) {
			const t = getDividerSidebarTarget(normalizedProperty);
			if (t) { openSidebarAccordion(t.tabIndex, t.accordion); return; }
		}
		if (selectedBlock?.name?.includes('image')) {
			const t = getImageSidebarTarget(normalizedProperty);
			if (t) { openSidebarAccordion(t.tabIndex, t.accordion); return; }
		}
		if (selectedBlock?.name?.includes('svg-icon') || selectedBlock?.name?.includes('icon-maxi')) {
			const t = getIconSidebarTarget(normalizedProperty);
			if (t) { openSidebarAccordion(t.tabIndex, t.accordion); return; }
		}
		if (selectedBlock?.name?.includes('number-counter')) {
			const t = getNumberCounterSidebarTarget(normalizedProperty);
			if (t) { openSidebarAccordion(t.tabIndex, t.accordion); return; }
		}
		if (selectedBlock?.name?.includes('button')) {
			for (const getter of [
				getButtonAGroupSidebarTarget, getButtonBGroupSidebarTarget,
				getButtonCGroupSidebarTarget, getButtonIGroupSidebarTarget,
			]) {
				const t = getter(normalizedProperty);
				if (t) { openSidebarAccordion(t.tabIndex, t.accordion); return; }
			}
		}
		if (isTextBlock) {
			const textLTarget = getTextLGroupSidebarTarget(normalizedProperty);
			if (textLTarget) { openSidebarAccordion(textLTarget.tabIndex, textLTarget.accordion); openLinkSettingsTab(textLTarget.state); return; }
			for (const getter of [
				getTextListGroupSidebarTarget, getTextCGroupSidebarTarget,
				getTextPGroupSidebarTarget, getTextTypographySidebarTarget,
			]) {
				const t = getter(normalizedProperty);
				if (t) { openSidebarAccordion(t.tabIndex, t.accordion); return; }
			}
		}

		for (const getter of [
			getContainerAGroupSidebarTarget, getContainerBGroupSidebarTarget,
			getContainerCGroupSidebarTarget, getContainerDGroupSidebarTarget,
			getContainerEGroupSidebarTarget, getContainerFGroupSidebarTarget,
			getContainerHGroupSidebarTarget, getContainerLGroupSidebarTarget,
			getContainerMGroupSidebarTarget, getContainerWGroupSidebarTarget,
			getContainerPGroupSidebarTarget, getContainerRGroupSidebarTarget,
			getContainerSGroupSidebarTarget, getContainerTGroupSidebarTarget,
			getContainerOGroupSidebarTarget, getContainerZGroupSidebarTarget,
		]) {
			const t = getter(normalizedProperty);
			if (t) { openSidebarAccordion(t.tabIndex, t.accordion); return; }
		}

		// Relations / IB cases that the hook-level version doesn't handle
		switch (normalizedProperty) {
			case 'relations':
			case 'relations_ops':
			case 'is_first_on_hierarchy': {
				const metaProperty = normalizedProperty === 'relations_ops' ? 'relations' : normalizedProperty;
				const sidebarTarget = getMetaSidebarTarget(metaProperty);
				if (sidebarTarget) openSidebarAccordion(sidebarTarget.tabIndex, sidebarTarget.accordion);
				return;
			}
			case 'advanced_css': {
				const sidebarTarget = getAdvancedCssSidebarTarget('advanced_css', selectedBlock?.name);
				if (sidebarTarget) openSidebarAccordion(sidebarTarget.tabIndex, sidebarTarget.accordion);
				return;
			}
			default:
				// Delegate everything else to the hook-level version
				openSidebarForPropertyExternal(rawProperty);
		}
	};

	// ─── JSON extraction helper ──────────────────────────────────────────────
	const extractJsonChunks = text => {
		if (typeof text !== 'string') return [];
		const chunks = [];
		let depth = 0;
		let start = -1;
		let inString = false;
		let escapeNext = false;
		for (let i = 0; i < text.length; i += 1) {
			const ch = text[i];
			if (escapeNext) { escapeNext = false; continue; }
			if (ch === '\\') { escapeNext = true; continue; }
			if (ch === '"') { inString = !inString; continue; }
			if (inString) continue;
			if (ch === '{' || ch === '[') {
				if (depth === 0) start = i;
				depth += 1;
			} else if (ch === '}' || ch === ']') {
				depth -= 1;
				if (depth === 0 && start !== -1) { chunks.push(text.slice(start, i + 1)); start = -1; }
			}
		}
		return chunks;
	};

	// ─── Main action parser ──────────────────────────────────────────────────

	/**
	 * Parses a JSON action string or object and executes the corresponding editor operation.
	 *
	 * @param {string|Object} responseText
	 * @returns {Promise<{ executed: boolean, message: string, options?: string[] }>}
	 */
	const parseAndExecuteAction = async responseText => {
		try {
			// Handle multi-chunk responses by executing each chunk sequentially.
			if (typeof responseText === 'string') {
				const chunks = extractJsonChunks(responseText);
				if (chunks.length > 1) {
					const parsedChunks = [];
					chunks.forEach(chunk => {
						try { parsedChunks.push(JSON.parse(chunk)); } catch (parseError) { console.warn('[Maxi AI Debug] Failed to parse JSON chunk:', parseError); }
					});
					let lastResult = { executed: false };
					for (const item of parsedChunks) lastResult = await parseAndExecuteAction(item);
					return lastResult;
				}
			}

			let action;
			if (typeof responseText === 'object' && responseText !== null) {
				action = responseText;
			} else {
				try {
					action = JSON.parse(responseText.trim());
				} catch {
					const chunks = extractJsonChunks(responseText);
					if (chunks.length === 1) {
						try { action = JSON.parse(chunks[0]); } catch (parseError) { console.warn('[Maxi AI Debug] Failed to parse JSON from response:', parseError); }
					} else if (chunks.length > 1) {
						const parsedChunks = [];
						chunks.forEach(chunk => {
							try { parsedChunks.push(JSON.parse(chunk)); } catch (parseError) { console.warn('[Maxi AI Debug] Failed to parse JSON chunk:', parseError); }
						});
						if (parsedChunks.length === 1) action = parsedChunks[0];
						else if (parsedChunks.length > 1) action = parsedChunks;
					}
				}
			}

			if (action?.actions && Array.isArray(action.actions)) action = action.actions;
			if (Array.isArray(action)) {
				let lastResult = { executed: false };
				for (const item of action) lastResult = await parseAndExecuteAction(item);
				return lastResult;
			}

			if (action?.property) {
				const normalized = normalizeActionProperty(action.property, action.value);
				action.property = normalized.property;
				action.value = normalized.value;
			}

			// Plain-text fallback for known clarification patterns
			if (!action || !action.action) {
				const responseString =
					typeof responseText === 'string' ? responseText : JSON.stringify(responseText || '');
				const lowerText = responseString.toLowerCase();
				if (lowerText.includes('rounded') || lowerText.includes('corner')) {
					return { executed: false, message: 'How rounded should the corners be?', options: ['Subtle (8px)', 'Soft (24px)', 'Full (50px)'] };
				}
				if (lowerText.includes('shadow')) {
					return { executed: false, message: 'What style of shadow would you like?', options: ['Soft', 'Crisp', 'Bold', 'Glow'] };
				}
				if (lowerText.includes('spacing') || lowerText.includes('padding') || lowerText.includes('space')) {
					return { executed: false, message: 'How much vertical spacing would you like?', options: ['Compact', 'Comfortable', 'Spacious', 'Remove'] };
				}
				if (lowerText.includes('border')) {
					return { executed: false, message: 'What style of border would you like?', options: ['Subtle Border', 'Strong Border', 'Brand Border'] };
				}
				return { executed: false, message: responseString };
			}

			console.log('[Maxi AI Debug] Parsed action:', JSON.stringify(action, null, 2));

			// ── CLARIFY ──────────────────────────────────────────────────────────
			if (action.action === 'CLARIFY') {
				const optionsLabels = action.options?.map(opt => opt.label) || [];
				return { executed: false, message: action.message, options: optionsLabels };
			}

			// ── CLOUD_MODAL_UI ───────────────────────────────────────────────────
			if (action.action === 'CLOUD_MODAL_UI') {
				const modalResult = await executeCloudModalUiOps(action.ops, {
					insertCloudBlock: insertMaxiCloudLibraryBlock,
					logDebug: msg => logAIDebug(String(msg)),
				});
				if (modalResult.outcome === 'zero_hits') {
					return {
						executed: false,
						message: __('The Cloud Library showed zero results for that search, so the modal was closed. Try different filters or keywords, or browse the library manually.', 'maxi-blocks'),
						options: [
							__('Open Cloud Library to browse manually', 'maxi-blocks'),
							__('Try a shorter or broader search', 'maxi-blocks'),
						],
					};
				}
				return {
					executed: modalResult.ok,
					message: action.message || modalResult.message || (modalResult.ok ? 'Cloud Library UI updated.' : 'Cloud Library UI could not be driven.'),
				};
			}

			// ── MODIFY_BLOCK ─────────────────────────────────────────────────────
			if (action.action === 'MODIFY_BLOCK') {
				// Single block add
				if (action.payload?.op === 'add' || action.payload?.block) {
					const buildBlockTree = descriptor => {
						if (!descriptor?.name) return null;
						const children = (descriptor.innerBlocks || []).map(buildBlockTree).filter(Boolean);
						return createBlock(descriptor.name, descriptor.attributes || {}, children);
					};
					const blockDescriptor = action.payload?.block;
					let newBlock;
					if (blockDescriptor?.name) {
						newBlock = buildBlockTree(blockDescriptor);
					} else {
						const BLOCK_NAME_MAP = {
							container: 'maxi-blocks/container-maxi',
							section: 'maxi-blocks/container-maxi',
							row: 'maxi-blocks/row-maxi',
							column: 'maxi-blocks/column-maxi',
						};
						const requestedType = blockDescriptor?.type?.toLowerCase() || 'container';
						newBlock = createBlock(BLOCK_NAME_MAP[requestedType] || 'maxi-blocks/container-maxi');
					}
					if (!newBlock) return { executed: false, message: 'Could not build block structure from AI response.' };
					dispatch('core/block-editor').insertBlocks(newBlock, undefined, getContentAreaClientId());
					return { executed: true, message: action.message || 'Block added to the page.' };
				}

				// Bulk child ops
				const childOps = action.payload?.update_inner_blocks ?? action.payload?.ops ?? null;
				if (childOps) {
					const buildBlockTree = descriptor => {
						if (!descriptor?.name) return null;
						const children = (descriptor.innerBlocks || []).map(buildBlockTree).filter(Boolean);
						return createBlock(descriptor.name, descriptor.attributes || {}, children);
					};
					const editorSelect = select('core/block-editor');

					const normalizeParentClientId = op => {
						const raw = op.parent_clientId ?? op.parentClientId;
						if (raw == null || typeof raw !== 'string') return null;
						const t = raw.trim();
						if (!t) return null;
						if (t.startsWith('<') && t.endsWith('>') && /selected|current|active/i.test(t)) {
							const selectedId = editorSelect.getSelectedBlockClientId();
							if (selectedId) { logAIDebug('MODIFY_BLOCK: resolved selected-block placeholder to', JSON.stringify(selectedId)); return selectedId; }
							return null;
						}
						if (t.startsWith('<') && t.endsWith('>')) return null;
						if (/placeholder|example|your-/i.test(t)) return null;
						if (!editorSelect.getBlock(t)) {
							const resolvedClientId = getClientIdFromUniqueId(t);
							if (resolvedClientId) { logAIDebug('MODIFY_BLOCK: resolved uniqueID to clientId', JSON.stringify(t), '→', JSON.stringify(resolvedClientId)); return resolvedClientId; }
						}
						return t;
					};

					const isPlaceholderParentId = id => {
						if (!id || typeof id !== 'string') return true;
						const t = id.trim();
						if (t.startsWith('<') && t.endsWith('>') && /selected|current|active/i.test(t)) return false;
						if (t.startsWith('<') && t.endsWith('>')) return true;
						return /placeholder|example|your-/i.test(t);
					};

					let opsQueue = Array.isArray(childOps) ? [...childOps] : [];
					const firstDesc = opsQueue[0] ? opsQueue[0].add_block ?? opsQueue[0].block : null;
					const firstIsButton =
						typeof firstDesc?.name === 'string' && firstDesc.name.includes('button-maxi');
					const allParentsPlaceholder =
						opsQueue.length > 0 &&
						opsQueue.every(op => isPlaceholderParentId(normalizeParentClientId(op)));

					if (allParentsPlaceholder && firstIsButton && scope === 'page') {
						const emptyColumns = collectBlocks(
							select('core/block-editor').getBlocks(),
							b => typeof b.name === 'string' && b.name.includes('column-maxi') && (!b.innerBlocks || b.innerBlocks.length === 0)
						);
						if (emptyColumns.length > 0) {
							const templateOp = opsQueue[0];
							opsQueue = emptyColumns.map(col => ({
								...templateOp,
								op: templateOp.op || 'append_child',
								parent_clientId: col.clientId,
							}));
							logAIDebug('MODIFY_BLOCK: resolved placeholder parents to empty columns', String(emptyColumns.length));
						}
					}

					let inserted = 0;
					let removed = 0;
					let sawExistingParent = false;

					for (const op of opsQueue) {
						if (op.op === 'remove' && op.clientId) {
							const blockToRemove = editorSelect.getBlock(op.clientId);
							if (blockToRemove) { dispatch('core/block-editor').removeBlock(op.clientId); removed += 1; }
							else logAIDebug('MODIFY_BLOCK remove op: block not found', op.clientId);
							continue;
						}
						const blockDescriptor = op.add_block ?? op.block ?? null;
						if (!blockDescriptor?.name) continue;
						const newBlock = buildBlockTree(blockDescriptor);
						if (!newBlock) continue;
						const parentId = normalizeParentClientId(op);
						if (!parentId) {
							logAIDebug('MODIFY_BLOCK child op: skip, invalid parent_clientId', JSON.stringify(op.parent_clientId ?? op.parentClientId));
							continue;
						}
						const parentBlock = editorSelect.getBlock(parentId);
						if (parentBlock) sawExistingParent = true;
						if (!parentBlock) { logAIDebug('MODIFY_BLOCK child op: parent block not found', JSON.stringify(parentId)); continue; }

						if (!editorSelect.canInsertBlockType(newBlock.name, parentId)) {
							const descendantAcceptor = (() => {
								const search = blocks => {
									for (const b of blocks) {
										if (editorSelect.canInsertBlockType(newBlock.name, b.clientId)) return b;
										if (b.innerBlocks?.length) { const found = search(b.innerBlocks); if (found) return found; }
									}
									return null;
								};
								return search(parentBlock.innerBlocks || []);
							})();
							if (descendantAcceptor) {
								logAIDebug('MODIFY_BLOCK child op: parent cannot accept block type, descending to', JSON.stringify(descendantAcceptor.name), JSON.stringify(descendantAcceptor.clientId));
								dispatch('core/block-editor').insertBlocks(newBlock, descendantAcceptor.innerBlocks?.length ?? 0, descendantAcceptor.clientId, false);
								inserted += 1;
							} else {
								logAIDebug('MODIFY_BLOCK child op: cannot insert block type into parent or any descendant', JSON.stringify(newBlock.name), JSON.stringify(parentId));
							}
							continue;
						}

						const wantsTop = op.insert_at === 'start' || op.position === 'top' || String(op.insert_at || '').toLowerCase() === 'top';
						const insertIndex = wantsTop ? 0 : parentBlock.innerBlocks?.length ?? 0;
						dispatch('core/block-editor').insertBlocks(newBlock, insertIndex, parentId, false);
						inserted += 1;
					}

					if (inserted === 0 && firstIsButton && scope === 'page' && !sawExistingParent && firstDesc) {
						const emptyColumns = collectBlocks(
							select('core/block-editor').getBlocks(),
							b => typeof b.name === 'string' && b.name.includes('column-maxi') && (!b.innerBlocks || b.innerBlocks.length === 0)
						);
						for (const col of emptyColumns) {
							const nb = buildBlockTree(firstDesc);
							if (!nb) break;
							if (!editorSelect.canInsertBlockType(nb.name, col.clientId)) continue;
							dispatch('core/block-editor').insertBlocks(nb, col.innerBlocks?.length ?? 0, col.clientId, false);
							inserted += 1;
						}
						if (inserted > 0) logAIDebug('MODIFY_BLOCK: empty-column fallback applied', String(inserted));
					}

					const anyChanges = inserted > 0 || removed > 0;
					if (!anyChanges) {
						const recovery = buildRecoveryResponse('no_blocks_inserted', {
							property: null,
							value: null,
							targetBlock: action.block_type ?? null,
							originalMessage: action.message ?? null,
						});
						setConversationContext(recovery.recoveryCtx);
						return { executed: false, message: recovery.content, options: recovery.options };
					}
					return {
						executed: true,
						message: action.message || [
							inserted > 0 ? `Added ${inserted} block(s).` : '',
							removed > 0 ? `Removed ${removed} block(s).` : '',
						].filter(Boolean).join(' '),
					};
				}

				// Bulk attribute update (MODIFY_BLOCK with payload/property)
				let targetBlocks = [];
				if (scope === 'selection') {
					if (selectedBlock) {
						targetBlocks = [selectedBlock];
					} else {
						const recovery = buildRecoveryResponse('no_selection', {
							property: action.property ?? null,
							value: action.value ?? null,
							targetBlock: action.target_block ?? null,
						});
						setConversationContext(recovery.recoveryCtx);
						return { executed: false, message: recovery.content, options: recovery.options };
					}
				} else if (scope === 'page') {
					targetBlocks = collectBlocks(select('core/block-editor').getBlocks(), b => b.name.includes('button'));
					if (targetBlocks.length === 0) {
						return { executed: false, message: __('There are no Maxi buttons on this page to update.', 'maxi-blocks') };
					}
				}

				const allBulkUpdates = {};
				console.log('[Maxi AI Debug] MODIFY_BLOCK - Scope:', scope, 'Targets:', targetBlocks.length);

				const getChangesForBlock = (targetBlock, prop, val) => {
					let c = null;
					const blkPrefix = getBlockPrefix(targetBlock.name);
					const isRemoval = val === null || val === 'none' || val === 'remove' || val === 0 || val === '0' || val === 'square';

					switch (prop) {
						case 'padding': case 'padding_top': case 'padding_bottom': case 'padding_left': case 'padding_right':
						case 'position': case 'position_top': case 'position_right': case 'position_bottom': case 'position_left':
							c = buildContainerPGroupAttributeChanges(prop, val); break;
						case 'row_gap': c = buildContainerRGroupAttributeChanges(prop, val); break;
						case 'margin': c = updateMargin(val, null, blkPrefix); break;
						case 'spacing_preset': c = createResponsiveSpacing(val, blkPrefix); break;
						case 'background_color': {
							const backgroundPrefix = targetBlock?.name?.includes('number-counter') ? '' : blkPrefix;
							c = updateBackgroundColor(targetBlock.clientId, val, targetBlock.attributes, backgroundPrefix);
							break;
						}
					case 'border_color_only': {
						// Colour-only border update — touches no style/width attributes.
						// val = { color, isPalette, breakpoint, prefix }
						if (typeof val === 'object' && val !== null) {
							const bp = val.breakpoint || 'general';
							const p = val.prefix !== undefined ? val.prefix : blkPrefix;
							if (val.isPalette) {
								c = {
									[`${p}border-palette-status-${bp}`]: true,
									[`${p}border-palette-color-${bp}`]: val.color,
									[`${p}border-color-${bp}`]: '',
								};
							} else {
								c = {
									[`${p}border-palette-status-${bp}`]: false,
									[`${p}border-palette-color-${bp}`]: '',
									[`${p}border-color-${bp}`]: val.color,
								};
							}
						}
						break;
					}
					case 'border':
						if (isRemoval) c = updateBorder(0, 'none', null, blkPrefix);
						else if (typeof val === 'object') c = updateBorder(val.width, val.style, val.color, blkPrefix);
						else {
							const parts = String(val).split(' ');
							if (parts.length >= 3) c = updateBorder(parseInt(parts[0]), parts[1], parts.slice(2).join(' '), blkPrefix);
							else if (val.startsWith('#') || val.startsWith('rgb') || val.startsWith('var')) c = updateBorder(1, 'solid', val, blkPrefix);
						}
						break;
						case 'border_radius': {
							let rVal = isRemoval ? 0 : val;
							if (!isRemoval && (val === '0px' || parseInt(val) === 0)) rVal = 0;
							else if (!isRemoval && typeof val === 'string') {
								if (val.includes('subtle')) rVal = 8;
								else if (val.includes('soft')) rVal = 24;
								else if (val.includes('full')) rVal = 50;
								else rVal = parseInt(val) || 8;
							}
							c = updateBorderRadius(rVal, null, blkPrefix);
							break;
						}
						case 'shadow': case 'box_shadow': case 'box-shadow':
							if (isRemoval) c = removeBoxShadow(blkPrefix);
							else if (typeof val === 'object') c = updateBoxShadow(val.x, val.y, val.blur, val.spread, val.color, blkPrefix);
							else c = { [`${blkPrefix}box-shadow-general`]: val, [`${blkPrefix}box-shadow-status-general`]: true };
							break;
						case 'icon_background': case 'icon_background_hover': case 'icon_border': case 'icon_border_hover':
						case 'icon_border_radius': case 'icon_border_radius_hover': case 'icon_padding': case 'icon_spacing':
						case 'icon_spacing_hover': case 'icon_width': case 'icon_width_hover': case 'icon_height':
						case 'icon_height_hover': case 'icon_size': case 'icon_size_hover': case 'icon_force_aspect_ratio':
						case 'icon_force_aspect_ratio_hover': case 'icon_fill_color': case 'icon_fill_color_hover':
						case 'icon_stroke_color': case 'icon_stroke_color_hover': case 'icon_stroke_width': case 'icon_stroke_width_hover':
						case 'icon_svg_type': case 'icon_svg_type_hover': case 'icon_content': case 'icon_content_hover':
						case 'icon_position': case 'icon_position_hover': case 'icon_only': case 'icon_only_hover':
						case 'icon_inherit': case 'icon_inherit_hover': case 'icon_status_hover': case 'icon_status_hover_target':
							if (targetBlock?.name?.includes('button')) c = buildButtonIGroupAttributeChanges(prop, val);
							break;
						case 'width':
							if (targetBlock.attributes && Object.prototype.hasOwnProperty.call(targetBlock.attributes, 'width-general')) {
								c = buildContainerWGroupAttributeChanges(prop, val, { prefix: blkPrefix }) || buildWidthChanges(val, blkPrefix);
							} else {
								c = buildWidthChanges(val, blkPrefix);
							}
							if (c && targetBlock?.name?.includes('number-counter') && blkPrefix === 'number-counter-') {
								Object.keys(c).forEach(key => {
									const match = key.match(/^number-counter-width-(general|xxl|xl|l|m|s|xs)$/);
									if (!match) return;
									c[`number-counter-width-auto-${match[1]}`] = false;
								});
							}
							break;
						case 'height': c = buildHeightChanges(val, blkPrefix); break;
						case 'objectFit': case 'object_fit': c = updateImageFit(val); break;
						case 'opacity': case 'opacity_hover': case 'opacity_status_hover': case 'order':
						case 'overflow': case 'overflow_x': case 'overflow_y':
							c = buildContainerOGroupAttributeChanges(prop, val); break;
						case 'z_index': c = buildContainerZGroupAttributeChanges(prop, val); break;
						case 'transform_rotate': case 'transform_scale': case 'transform_scale_hover':
						case 'transform_translate': case 'transform_origin': case 'transform_target':
						case 'transition': case 'transition_change_all': case 'transition_canvas_selected':
						case 'transition_transform_selected':
							c = buildContainerTGroupAttributeChanges(prop, val, { attributes: targetBlock.attributes }); break;
						case 'text_color': case 'text_color_hover': case 'button_hover_text': case 'color':
							if (targetBlock?.name?.includes('button')) {
								c = buildButtonCGroupAttributeChanges(prop, val, { attributes: targetBlock.attributes });
							} else if (targetBlock?.name?.includes('text-maxi') || targetBlock?.name?.includes('list-item-maxi')) {
								c = buildTextCGroupAttributeChanges(prop, val);
							} else {
								c = updateTextColor(val, blkPrefix);
							}
							break;
						case 'link_color': case 'link_color_hover': case 'link_color_active': case 'link_color_visited':
						case 'link_palette_color': case 'link_palette_color_hover': case 'link_palette_color_active':
						case 'link_palette_color_visited': case 'link_palette_opacity': case 'link_palette_opacity_hover':
						case 'link_palette_opacity_active': case 'link_palette_opacity_visited': case 'link_palette_status':
						case 'link_palette_status_hover': case 'link_palette_status_active': case 'link_palette_status_visited':
						case 'link_palette_sc_status': case 'link_palette_sc_status_hover': case 'link_palette_sc_status_active':
						case 'link_palette_sc_status_visited':
							if (targetBlock?.name?.includes('text-maxi') || targetBlock?.name?.includes('list-item-maxi')) {
								c = buildTextLGroupAttributeChanges(prop, val);
							}
							break;
						case 'font_size': case 'fontSize': c = updateFontSize(val); break;
						case 'font_weight': case 'fontWeight': c = updateFontWeight(val); break;
						default: {
							if (
								prop &&
								(String(prop).startsWith('scroll_') ||
									String(prop).startsWith('shape_divider_') ||
									['shortcut_effect', 'shortcut_effect_type', 'show_warning_box', 'size_advanced_options'].includes(prop))
							) {
								c = buildContainerSGroupAttributeChanges(prop, val);
								if (c) break;
							}
							const payloadData = action.payload?._conversationData;
							const currentData = payloadData || ((conversationContext && conversationContext.flow === prop) ? conversationContext.data : {});
							const updateContext = { ...currentData, mode: scope };
							const blockHandler = getAiHandlerForBlock(targetBlock);
							const result = blockHandler ? blockHandler(targetBlock, prop, val, blkPrefix, updateContext) : null;

							if (result) {
								if (result.action === 'apply') {
									c = result.attributes;
								} else if (result.action) {
									console.log('[Maxi AI Conversation] Interaction Request from block:', targetBlock.clientId, result);
									return { _isConversationStep: true, ...result, flow: prop };
								} else {
									c = result;
								}
							}
							if (c) break;
						}
					}

					if (c && c._isConversationStep) return c;
					if (c && c.executed) return c;
					return c;
				};

				// Special action: apply hover animation
				if (action.payload?.special_action === 'APPLY_HOVER_ANIMATION') {
					const hoverChanges = applyHoverAnimation(selectedBlock.attributes, action.payload.shadow_value);
					if (Object.keys(hoverChanges).length > 0) updateBlockAttributes(selectedBlock.clientId, hoverChanges);
					return { executed: true, message: action.message || 'Applied hover animation.' };
				}

				// Payload object with multiple updates
				if (action.payload) {
					const p = action.payload;
					let conversationStep = null;

					for (const [prop, val] of Object.entries(p)) {
						for (const block of targetBlocks) {
							let c = null;
							if (prop === 'spacing' && typeof val === 'object') {
								if (val.padding) {
									const res = getChangesForBlock(block, 'padding', val.padding);
									if (res && res._isConversationStep) conversationStep = res;
									else if (res) Object.assign(allBulkUpdates[block.clientId] || (allBulkUpdates[block.clientId] = {}), res);
								}
								if (val.margin) {
									const res = getChangesForBlock(block, 'margin', val.margin);
									if (res && res._isConversationStep) conversationStep = res;
									else if (res) Object.assign(allBulkUpdates[block.clientId] || (allBulkUpdates[block.clientId] = {}), res);
								}
							} else {
								const res = getChangesForBlock(block, prop, val);
								if (res && res._isConversationStep) { conversationStep = res; break; }
								console.log('[Maxi AI Debug] getChangesForBlock result:', block.clientId, prop, val, '->', res);
								if (res) {
									if (!allBulkUpdates[block.clientId]) allBulkUpdates[block.clientId] = {};
									Object.assign(allBulkUpdates[block.clientId], res);
								}
							}
						}
						if (conversationStep) break;
					}

					if (conversationStep) {
						const c = conversationStep;
						console.log('[Maxi AI Conversation] Setting Context:', c);
						setConversationContext({
							flow: c.flow,
							pendingTarget: c.target,
							data: conversationContext?.data || {},
							currentOptions: c.options || [],
						});
						const displayOptions = Array.isArray(c.options) && typeof c.options[0] === 'object'
							? c.options.map(o => o.label)
							: c.options;
						return {
							executed: false,
							message: c.msg,
							options: displayOptions || (c.action === 'ask_palette' ? ['palette'] : []),
							optionsType: c.action === 'ask_palette' ? 'palette' : 'text',
						};
					}

					if (conversationContext && !conversationStep) setConversationContext(null);

					console.log('[Maxi AI Debug] Final Bulk Updates:', Object.keys(allBulkUpdates).length, 'blocks');
					if (Object.keys(allBulkUpdates).length > 0) {
						Object.entries(allBulkUpdates).forEach(([clientId, attrs]) => {
							dispatch('core/block-editor').updateBlockAttributes(clientId, attrs);
						});
						return { executed: true, message: scope === 'page' ? 'Updated all buttons on page.' : 'Updated selection.' };
					}
					return { executed: true, message: 'No changes needed.' };
				}

				// Direct property/value
				if (action.property && action.value !== undefined) {
					const c = getChangesForBlock(selectedBlock, action.property, action.value);
					if (c && c._isConversationStep) {
						setConversationContext({ flow: c.flow, pendingTarget: c.target, data: conversationContext?.data || {}, currentOptions: c.options || [] });
						const displayOptions = Array.isArray(c.options) && typeof c.options[0] === 'object' ? c.options.map(o => o.label) : c.options;
						return { executed: false, message: c.msg, options: displayOptions || (c.action === 'ask_palette' ? ['palette'] : []), optionsType: c.action === 'ask_palette' ? 'palette' : 'text' };
					}
					if (c && c.executed) return c;
					if (c) {
						dispatch('core/block-editor').updateBlockAttributes(selectedBlock.clientId, c);
						if (conversationContext) setConversationContext(null);
					}
				}

				const targetProp = action.property || (action.payload ? Object.keys(action.payload)[0] : null);
				if (action.payload?.spacing_preset) openSidebarForProperty('responsive_padding');
				else if (action.payload?.shadow) openSidebarForProperty('box_shadow');
				else if (action.payload?.border) openSidebarForProperty('border');
				else openSidebarForProperty(targetProp);

				if (action.ui_target) {
					const uiMap = {
						'spacing-panel': { panel: 'Margin / Padding', tab: 'Settings' },
						'dimension-panel': { panel: 'Dimension', tab: 'Settings' },
						'border-panel': { panel: 'Border', tab: 'Settings' },
						'shadow-panel': { panel: 'Box shadow', tab: 'Settings' },
						'shadow-panel-hover': { panel: 'Box shadow', tab: 'Settings', state: 'hover' },
					};
					const mapping = uiMap[action.ui_target];
					if (mapping) action.sidebarMapping = mapping;
				}

				if (action.sidebarMapping) {
					const { panel, tab } = action.sidebarMapping;
					setTimeout(() => {
						const tabButtons = document.querySelectorAll('.maxi-tabs-control__button');
						for (const tabBtn of tabButtons) {
							if (tabBtn.textContent.trim().toLowerCase() === tab.toLowerCase()) { tabBtn.click(); break; }
						}
						setTimeout(() => {
							const selectors = ['.maxi-accordion-control__item__button', '.maxi-accordion-control button', '[class*="accordion"] button', '.maxi-accordion-tab__item__button'];
							const labelParts = panel.split(/\s*\/\s*|\s+/).filter(p => p.length > 2);
							for (const selector of selectors) {
								for (const button of document.querySelectorAll(selector)) {
									const text = button.textContent.trim();
									if (labelParts.some(part => text.toLowerCase().includes(part.toLowerCase()))) { button.click(); return; }
								}
							}
						}, 200);
					}, 300);
				}

				if (action.payload || action.property) return { executed: true, message: action.message || 'Updated.' };
				return { executed: true, message: action.message || 'No changes needed.' };
			} // End MODIFY_BLOCK

			// ── switch_viewport ──────────────────────────────────────────────────
			if (action.action === 'switch_viewport') {
				const device = action.value || 'Mobile';
				try {
					dispatch('core/edit-post').__experimentalSetPreviewDeviceType(device);
				} catch (e) {
					try { dispatch('core/editor').setDeviceType(device); } catch (e2) { console.warn('Could not switch viewport', e2); }
				}
				return { executed: true, message: action.message || `Switched to ${device} view.` };
			}

			// ── update_page ──────────────────────────────────────────────────────
			if (action.action === 'update_page') {
				let property = action.property;
				let value = action.value;
				let targetBlock = action.target_block;
				let actionMessage = action.message;

				if (action.payload) {
					if (action.payload.shadow) { property = 'box_shadow'; value = action.payload.shadow; }
					else if (action.payload.border_radius !== undefined) { property = 'border_radius'; value = action.payload.border_radius; }
					else if (action.payload.padding !== undefined) { property = 'padding'; value = action.payload.padding; }
				}

				if (property) {
					const normalized = normalizeActionProperty(property, value);
					logAIDebug('update_page normalization', { original: { property, value }, normalized, target: targetBlock, selectedBlock: selectedBlock?.name });
					property = normalized.property;
					value = normalized.value;
				}

				if (property === 'padding' && targetBlock === 'button') property = 'button_padding';

				if (property === 'relations' || property === 'relations_ops' || property === 'is_first_on_hierarchy') {
					return { executed: false, message: __('Interaction Builder updates are only supported in Selection scope. Switch scope to Selection and try again.', 'maxi-blocks') };
				}

				const iconResolution = await resolveButtonIconFromTypesense({ property, value, targetBlock });
				if (iconResolution?.error) return { executed: false, message: iconResolution.error };
				if (iconResolution?.property) {
					property = iconResolution.property;
					value = iconResolution.value;
					targetBlock = iconResolution.targetBlock || targetBlock;
					if (iconResolution.message) actionMessage = iconResolution.message;
				}

				if (property === 'border_radius' && typeof value === 'string') {
					const lowerValue = value.toLowerCase();
					if (lowerValue.includes('subtle') || lowerValue === '8px') value = 8;
					else if (lowerValue.includes('soft') || lowerValue === '24px') value = 24;
					else if (lowerValue.includes('full') || lowerValue === '50px') value = 50;
					else if (lowerValue.includes('square') || lowerValue === '0px' || lowerValue === '0') value = 0;
					else { const parsed = parseInt(value); value = isNaN(parsed) ? 8 : parsed; }
				} else if (property === 'border_radius' && typeof value === 'number') {
					// already numeric
				} else if (property === 'border_radius') {
					value = 8;
				}

				const resultMsg = handleUpdatePage(property, value, targetBlock);
				openSidebarForProperty(property);
				return { executed: true, message: actionMessage || resultMsg };
			}

			// ── apply_responsive_spacing ─────────────────────────────────────────
			if (action.action === 'apply_responsive_spacing') {
				const resultMsg = handleUpdatePage('apply_responsive_spacing', action.preset, action.target_block);
				openSidebarAccordion(0, 'dimension-panel');
				return { executed: true, message: action.message || resultMsg };
			}

			// ── update_style_card ────────────────────────────────────────────────
			if (action.action === 'update_style_card') {
				const resultMsg = handleUpdateStyleCard(action.updates);
				return { executed: true, message: resultMsg };
			}

			// ── apply_theme ──────────────────────────────────────────────────────
			if (action.action === 'apply_theme') {
				const resultMsg = handleApplyTheme(action.theme, action.prompt);
				return { executed: true, message: resultMsg, openedStyleCard: true };
			}

			// ── update_selection ─────────────────────────────────────────────────
			if (action.action === 'update_selection') {
				let property = action.property;
				let value = action.value;
				let targetBlock = action.target_block;
				let actionMessage = action.message;

				if (action.payload) {
					if (action.payload.shadow) { property = 'box_shadow'; value = action.payload.shadow; }
					else if (action.payload.border_radius !== undefined) { property = 'border_radius'; value = action.payload.border_radius; }
					else if (action.payload.padding !== undefined) { property = 'padding'; value = action.payload.padding; }
				}

				if (property) {
					const normalized = normalizeActionProperty(property, value);
					logAIDebug('update_selection normalization', { original: { property, value }, normalized, target: targetBlock, selectedBlock: selectedBlock?.name });
					property = normalized.property;
					value = normalized.value;
				}

				if (property === 'padding' && (targetBlock === 'button' || selectedBlock?.name?.includes('button'))) {
					property = 'button_padding';
				}

				const iconResolution = await resolveButtonIconFromTypesense({ property, value, targetBlock });
				if (iconResolution?.error) return { executed: false, message: iconResolution.error };
				if (iconResolution?.property) {
					property = iconResolution.property;
					value = iconResolution.value;
					targetBlock = iconResolution.targetBlock || targetBlock;
					if (iconResolution.message) actionMessage = iconResolution.message;
				}

				if (property === 'border_radius' && typeof value === 'string') {
					if (value.includes('subtle') || value === '8px') value = 8;
					else if (value.includes('soft') || value === '24px') value = 24;
					else if (value.includes('full') || value === '50px') value = 50;
					else if (value.includes('square') || value === '0px') value = 0;
					else value = parseInt(value) || 8;
				}

				const isLinkProperty = property === 'link_settings' || String(property || '').startsWith('dc_link');
				const resultMsg = handleUpdateSelection(property, value, isLinkProperty ? null : targetBlock);
				console.log('[Maxi AI Debug] handleUpdateSelection result:', resultMsg);

				openSidebarForProperty(property);

				if (typeof resultMsg === 'string' && resultMsg.includes('Please select')) {
					const recovery = buildRecoveryResponse('no_selection', { property, value, targetBlock });
					setConversationContext(recovery.recoveryCtx);
					return { executed: false, message: recovery.content, options: recovery.options };
				}
				if (typeof resultMsg === 'string' && resultMsg.includes('No matching')) {
					const recovery = buildRecoveryResponse('no_match', { property, value, targetBlock, blockName: selectedBlock?.name ?? 'unknown' });
					setConversationContext(recovery.recoveryCtx);
					return { executed: false, message: recovery.content, options: recovery.options };
				}

				return { executed: true, message: actionMessage || resultMsg };
			}

			if (action.action === 'message') {
				return { executed: false, message: action.content, options: action.options };
			}

			// ── post_management ──────────────────────────────────────────────────
			if (action.action === 'post_management') {
				const editorDispatch = dispatch('core/editor');
				const editorSelect = select('core/editor');
				const { operation, title, slug, date } = action;
				try {
					switch (operation) {
						case 'publish':
							if (title) await editorDispatch.editPost({ title });
							await editorDispatch.editPost({ status: 'publish' });
							await editorDispatch.savePost();
							return { executed: true, message: action.message || 'Published.' };
						case 'save':
							await editorDispatch.savePost();
							return { executed: true, message: action.message || 'Saved.' };
						case 'draft':
							await editorDispatch.editPost({ status: 'draft' });
							await editorDispatch.savePost();
							return { executed: true, message: action.message || 'Moved to draft.' };
						case 'set_title':
							if (!title) return { executed: false, message: 'Please provide a title.' };
							await editorDispatch.editPost({ title });
							return { executed: true, message: action.message || `Title set to "${title}".` };
						case 'set_slug':
							if (!slug) return { executed: false, message: 'Please provide a slug.' };
							await editorDispatch.editPost({ slug });
							return { executed: true, message: action.message || `Slug set to "${slug}".` };
						case 'schedule':
							if (!date) return { executed: false, message: 'Please provide a date for scheduling.' };
							await editorDispatch.editPost({ status: 'future', date });
							await editorDispatch.savePost();
							return { executed: true, message: action.message || `Scheduled for ${date}.` };
						case 'preview': {
							const previewUrl = editorSelect.getEditedPostPreviewLink?.();
							if (previewUrl) {
								window.open(previewUrl, '_blank', 'noopener');
								return { executed: true, message: action.message || 'Preview opened.' };
							}
							return { executed: false, message: 'Could not get preview URL.' };
						}
						case 'open_page': {
							const permalink = editorSelect.getPermalink?.() || editorSelect.getCurrentPostAttribute?.('link');
							if (permalink) {
								window.open(permalink, '_blank', 'noopener');
								return { executed: true, message: action.message || 'Opened live page.' };
							}
							return { executed: false, message: 'Page is not published yet.' };
						}
						default:
							return { executed: false, message: `Unknown post operation: ${operation}` };
					}
				} catch (postErr) {
					return { executed: false, message: `Post operation failed: ${String(postErr?.message || postErr)}` };
				}
			}

			// ── sc_action (sentinel — handled by useAiChatMessages) ─────────────
			if (action.action === 'sc_action') {
				return {
					executed: false,
					_needsScAction: true,
					scOperation: action.operation,
					scName: action.name,
					message: action.message,
				};
			}

			// ── browse_cloud_sc (sentinel — handled by useAiChatMessages) ────────
			if (action.action === 'browse_cloud_sc') {
				return {
					executed: false,
					_needsBrowseCloudSc: true,
					browseCloudScParams: {
						query: action.query,
						category: action.category,
						importFirst: action.import_first ?? false,
						showLocalOnly: action.show_local_only ?? false,
					},
					message: action.message,
				};
			}

			// ── cloud_icon (sentinel — handled by useAiChatMessages) ─────────────
			if (action.action === 'cloud_icon') {
				return {
					executed: false,
					_needsCloudIconSearch: true,
					cloudIconAction: action,
					message: action.message,
				};
			}

			return { executed: true, message: action.message || 'Done.' };

		} catch (e) {
			console.error('Parse error:', e);
			return { executed: false, message: __('Error parsing AI response.', 'maxi-blocks') };
		}
	};

	return { parseAndExecuteAction, normalizeActionProperty, resolveButtonIconFromTypesense };
};

export default useAiChatActions;
