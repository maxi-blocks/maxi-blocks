/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import { dispatch, select, useDispatch, useSelect, useRegistry } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { loadColumnsTemplate, getTemplates } from '@extensions/column-templates';

/**
 * Internal dependencies
 */

import { openSidebarAccordion } from '@extensions/inspector/inspectorPath';
import { handleSetAttributes } from '@extensions/maxi-block';
import getCustomFormatValue from '@extensions/text/formats/getCustomFormatValue';
import { createTransitionObj, getLastBreakpointAttribute } from '@extensions/styles';
import getClientIdFromUniqueId from '@extensions/attributes/getClientIdFromUniqueId';
import getCleanResponseIBAttributes from '@extensions/relations/getCleanResponseIBAttributes';
import getIBStyles from '@extensions/relations/getIBStyles';
import getIBStylesObj from '@extensions/relations/getIBStylesObj';
import { getSelectedIBSettings } from '@extensions/relations/utils';
import { getSkillContextForBlock, getAllSkillsContext } from '../skillContext';
import {
	findBestPattern,
	extractPatternQuery,
	extractCloudSearchQuery,
} from '../patternSearch';
import { findBestIcon, findIconCandidates, extractIconQuery, extractIconQueries, extractIconStyleIntent, stripIconStylePhrases } from '../iconSearch';
import { AI_BLOCK_PATTERNS, getAiHandlerForBlock, getAiHandlerForTarget, getAiPromptForBlockName } from '../ai/registry';
import { buildRoutingContext, routeClientSide } from '../ai/router';
import { CLOUD_ICON_PATTERN } from '../ai/patterns/cloudIcon';
import { getAccordionSidebarTarget } from '../ai/blocks/accordion';
import { getColumnSidebarTarget } from '../ai/blocks/column';
import { getDividerSidebarTarget } from '../ai/blocks/divider';
import { getIconSidebarTarget } from '../ai/blocks/icon';
import { getImageSidebarTarget } from '../ai/blocks/image';
import { getNumberCounterSidebarTarget } from '../ai/blocks/number-counter';
import ACTION_PROPERTY_ALIASES from '../ai/actions/actionPropertyAliases';
import { extractUrl } from '../ai/utils/messageExtractors';
import { buildColorUpdate } from '../ai/color/colorClarify';
import updateBackgroundColor from '../ai/color/backgroundUpdate';
import {
	isInteractionBuilderMessage,
	isTextContextForMessage,
} from '../ai/utils/contextDetection';
import { maybeOpenFlowSidebar } from '../ai/utils/openFlowSidebar';
import { getAdvancedCssSidebarTarget } from '../ai/utils/advancedCssAGroup';
import { buildMetaAGroupAttributeChanges, getMetaSidebarTarget, resolveMetaTargetKey } from '../ai/utils/metaAGroup';
import { applyRelationsOps, ensureRelationDefaults } from '../ai/utils/relationsOps';
import {
	getButtonAGroupSidebarTarget,
	getButtonBGroupSidebarTarget,
	buildButtonCGroupAttributeChanges,
	getButtonCGroupSidebarTarget,
	buildButtonIGroupAttributeChanges,
	getButtonIGroupSidebarTarget,
} from '../ai/utils/buttonGroups';
import {
	applyBackgroundLayerCommand,
	isBackgroundLayerCommand,
} from '../ai/utils/shared/backgroundLayers';
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
	buildContainerOGroupAttributeChanges,
	getContainerOGroupSidebarTarget,
	buildContainerPGroupAttributeChanges,
	getContainerPGroupSidebarTarget,
	buildContainerRGroupAttributeChanges,
	getContainerRGroupSidebarTarget,
	buildContainerSGroupAttributeChanges,
	getContainerSGroupSidebarTarget,
	buildContainerTGroupAttributeChanges,
	getContainerTGroupSidebarTarget,
	buildContainerWGroupAttributeChanges,
	getContainerWGroupSidebarTarget,
	buildContainerZGroupAttributeChanges,
	getContainerZGroupSidebarTarget,
} from '../ai/utils/containerGroups';
import {
	buildTextCGroupAttributeChanges,
	getTextCGroupSidebarTarget,
	buildTextLGroupAttributeChanges,
	getTextLGroupSidebarTarget,
	getTextPGroupSidebarTarget,
	getTextListGroupSidebarTarget,
	getTextTypographySidebarTarget,
} from '../ai/utils/textGroup';
import { getDcGroupSidebarTarget } from '../ai/utils/dcGroup';
import ADVANCED_CSS_PROMPT from '../ai/prompts/advanced-css';
import STYLE_CARD_MAXI_PROMPT from '../ai/prompts/style-card';
import META_MAXI_PROMPT from '../ai/prompts/meta';
import INTERACTION_BUILDER_PROMPT from '../ai/prompts/interaction-builder';
import SYSTEM_PROMPT from '../ai/prompts/system';
import { useStyleCardData, createStyleCardHandlers } from '../ai/style-card';
import onRequestInsertPattern from '../../../editor/library/utils/onRequestInsertPattern';
import { insertMaxiCloudLibraryBlock } from '../utils/insertMaxiCloudLibraryBlock';
import { executeCloudModalUiOps } from '../utils/aiCloudModalDriver';
import {
	parseUnitValue,
	RESPONSIVE_BREAKPOINTS,
	buildResponsiveScaledValues,
	buildResponsiveBooleanChanges,
	buildResponsiveValueChanges,
	buildResponsiveSizeChanges,
	normalizeValueWithBreakpoint,
	getActiveBreakpoint,
	getBaseBreakpoint,
	buildBreakpointChanges,
	buildSizeChanges,
	buildWidthChanges,
	buildHeightChanges,
	buildContextLoopChanges,
} from '../ai/utils/responsiveHelpers';
import {
	getBlockPrefix,
	matchesTargetBlockName,
	collectBlocks,
	findBlockByClientId,
	stripHtml,
	isIconBlock,
	isLabelBlock,
	isHeadingTextBlock,
	toTitleCase,
	getBlockLabelText,
	findLabelInBlocks,
	findLabelBlockInBlocks,
	findLabelForIconBlock,
	findLabelBlockForIconBlock,
	findGroupRootForIconBlock,
	extractSvgLabel,
	getIconLabelFromBlock,
	buildTextContentChange,
	buildIconRelatedText,
} from '../ai/utils/blockHelpers';
import {
	HEX_COLOR_REGEX,
	extractQuotedText,
	extractValueFromPatterns,
	extractNumericValue,
	extractButtonText,
	extractCaptionText,
	extractAltText,
	extractIconAltTitle,
	extractIconAltDescription,
	extractColumnSize,
	extractDividerValue,
	extractNumberCounterRangeValue,
	extractNumberCounterStartValue,
	extractNumberCounterEndValue,
	extractNumberCounterDurationValue,
	extractNumberCounterStrokeValue,
	extractNumberCounterStartOffsetValue,
	extractNumberCounterTitleFontSizeValue,
	extractNumberCounterTextColorValue,
	resolveImageRatioValue,
} from '../ai/utils/messageExtractors';
import {
	updateTextColor,
	updatePadding,
	updateMargin,
	updateBorderRadius,
	updateBoxShadow,
	removeBoxShadow,
	createResponsiveSpacing,
	updateOpacity,
	updateBorder,
	updateFontSize,
	updateFontFamily,
	updateFontWeight,
	updateLineHeight,
	updateLetterSpacing,
	updateTextTransform,
	updateTextAlign,
	updateFlexDirection,
	updateJustifyContent,
	updateAlignItems,
	updateAlignContent,
	updateGap,
	updateFlexGrow,
	updateFlexShrink,
	updateDeadCenter,
	updateItemAlign,
	updateStacking,
	updateDisplay,
	updatePosition,
	updateZIndex,
	updateTransform,
	updateClipPath,
	addScrollEffect,
	updateOverflow,
	updateBlendMode,
	updateSvgFillColor,
	updateSvgLineColor,
	updateSvgStrokeWidth,
	updateImageFit,
	updateAspectRatio,
	clampNumber,
	buildShapeDividerChanges,
	buildShapeDividerColorChanges,
} from '../ai/utils/cssBuilders';
import { applyUpdatesToBlocks as _applyUpdatesToBlocks } from '../ai/utils/applyUpdatesToBlocks';
import { buildPassthroughLlmContext } from './llm/buildPassthroughLlmContext';
import { executePassthroughLlmTurn } from './llm/executePassthroughLlmTurn';
import useAiChatHistory from './useAiChatHistory';

export const useAiChat = ({ onClose } = {}) => {
		const [messages, setMessages] = useState([]);
		const [input, setInput] = useState('');
		const [isLoading, setIsLoading] = useState(false);
		const [scope, setScope] = useState('page'); // 'selection', 'page', 'global'
		const [scopeChosen, setScopeChosen] = useState(false);
		const [conversationContext, setConversationContext] = useState(null); // { flow: string, pendingTarget: string, data: object, currentOptions: array }
		const [showHistory, setShowHistory] = useState(false);
		const {
			chatHistory,
			currentChatId,
			saveCurrentChat,
			startNewChat: startNewChatHistory,
			loadChat: loadChatHistory,
			deleteHistoryItem,
		} = useAiChatHistory({ messages, setMessages, setInput, setConversationContext });

		const startNewChat = () => {
			startNewChatHistory();
			setShowHistory(false);
			setScopeChosen(false);
		};

		const loadChat = entry => {
			loadChatHistory(entry);
			setShowHistory(false);
			setScopeChosen(true);
		};

		const messagesEndRef = useRef(null);
		const isAIDebugEnabled = () =>
			typeof window !== 'undefined' && window.maxiBlocksDebug;
		const logAIDebug = (...args) => {
			if (isAIDebugEnabled()) {
				console.log('[Maxi AI Debug]', ...args);
			}
		};

	// Drag state for moveable panel
	const [position, setPosition] = useState(null); // null = use CSS default, otherwise { x, y }
	const [isDragging, setIsDragging] = useState(false);
	const dragOffset = useRef({ x: 0, y: 0 });

	const selectedBlock = useSelect(
		select => select('core/block-editor').getSelectedBlock(),
		[]
	);

	const postTypeLabel = useSelect(select => {
		const type = select('core/editor').getCurrentPostType();
		const obj = select('core').getPostType(type);
		return obj?.labels?.singular_name ||
			(type ? type.charAt(0).toUpperCase() + type.slice(1) : __('Page', 'maxi-blocks'));
	}, []);

	const selectedBlockDisplayName = selectedBlock
		? selectedBlock.name
			.replace('maxi-blocks/', '')
			.replace('-maxi', '')
			.split('-')
			.map(w => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ')
		: null;

	const allBlocks = useSelect(
		select => select('core/block-editor').getBlocks(),
		[]
	);
	
	const registry = useRegistry();

	// Style Card Data
	const {
		activeStyleCard,
		allStyleCards,
		customColors,
		saveMaxiStyleCards,
		resetSC,
		setActiveStyleCard,
	} = useStyleCardData();

	const { handleUpdateStyleCard, handleApplyTheme } = createStyleCardHandlers({
		allStyleCards,
		saveMaxiStyleCards,
		resetSC,
		setActiveStyleCard,
	});

	const { updateBlockAttributes } = useDispatch('core/block-editor');
	
	// Try to get undo from both possible stores (Post Editor or Site Editor)
	const { undo: undoPost } = useDispatch('core/editor') || {};
	const { undo: undoSite } = useDispatch('core/edit-site') || {};

	const handleUndo = () => {
		if (typeof undoPost === 'function') {
			undoPost();
		} else if (typeof undoSite === 'function') {
			undoSite();
		} else {
			console.warn('Maxi AI: Undo not available in this context.');
		}

		// Optimistically mark the last action as undone in UI
		setMessages(prev => {
			const newMessages = [...prev];
			// Find last executed assistant message
			for (let i = newMessages.length - 1; i >= 0; i--) {
				if (newMessages[i].role === 'assistant' && newMessages[i].executed && !newMessages[i].undone) {
					newMessages[i].undone = true;
					break;
				}
			}
			return newMessages;
		});
	};

	const handleScopeChange = nextScope => {
		if (nextScope === scope) return;
		setScope(nextScope);
		setScopeChosen(true);
		if (conversationContext) setConversationContext(null);
	};

	useEffect(() => {
		if (scope === 'selection' && !selectedBlock) {
			setScope('page');
		}
	}, [selectedBlock]); // eslint-disable-line react-hooks/exhaustive-deps

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Drag handlers for moveable panel
	const handleMouseDown = useCallback((e) => {
		// Only drag from the header area, not from buttons inside header
		if (e.target.closest('button')) return;
		
		setIsDragging(true);
		const panelRect = e.currentTarget.closest('.maxi-ai-chat-panel').getBoundingClientRect();
		dragOffset.current = {
			x: e.clientX - panelRect.left,
			y: e.clientY - panelRect.top
		};
		e.preventDefault();
	}, []);

	const handleMouseMove = useCallback((e) => {
		if (!isDragging) return;
		
		const newX = e.clientX - dragOffset.current.x;
		const newY = e.clientY - dragOffset.current.y;
		
		// Keep panel within viewport bounds
		const maxX = window.innerWidth - 100; // At least 100px visible
		const maxY = window.innerHeight - 50;
		
		setPosition({
			x: Math.max(0, Math.min(newX, maxX)),
			y: Math.max(0, Math.min(newY, maxY))
		});
	}, [isDragging]);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	// Attach mousemove and mouseup to document for smooth dragging
	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		}
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging, handleMouseMove, handleMouseUp]);

	// Fix validation for handleSuggestion stale closure
	const messagesRef = useRef(messages);
	useEffect(() => {
		messagesRef.current = messages;
	}, [messages]);

	useEffect(() => {
		if (scope === 'global') {
			if (conversationContext) setConversationContext(null);
			return;
		}
		if (conversationContext?.mode && conversationContext.mode !== scope) {
			setConversationContext(null);
		}
	}, [scope, conversationContext]);

	// Get Style Card palette colors for visual swatches
	// Uses CSS variables that are already set on the page (same approach as sidebar palette)
	const getPaletteColors = () => {
		return [1, 2, 3, 4, 5, 6, 7, 8].map(i => `rgba(var(--maxi-light-color-${i}), 1)`);
	};

	const applyUpdatesToBlocks = (blocksToUpdate, property, value, targetBlock = null, specificClientId = null) =>
		_applyUpdatesToBlocks(blocksToUpdate, property, value, targetBlock, specificClientId, updateBlockAttributes, scope);


	const SHAPE_DIVIDER_PROPERTIES = new Set([
		'shape_divider',
		'shape_divider_top',
		'shape_divider_bottom',
		'shape_divider_both',
		'shape_divider_color',
		'shape_divider_color_top',
		'shape_divider_color_bottom',
	]);

	const normalizeTargetBlock = (property, targetBlock) =>
		SHAPE_DIVIDER_PROPERTIES.has(property) ? 'container' : targetBlock;

	const handleUpdatePage = (property, value, targetBlock = null, clientId = null) => {
		let count = 0;
		const normalizedTarget = normalizeTargetBlock(property, targetBlock);
		// Wrap in batch to prevent multiple re-renders
		registry.batch(() => {
			count = applyUpdatesToBlocks(allBlocks, property, value, normalizedTarget, clientId);
		});
		return `Updated ${count} blocks on the page.`;
	};

	const handleUpdateSelection = (property, value, targetBlock = null) => {
		if (!selectedBlock) return __('Please select a block first.', 'maxi-blocks');
		
		let count = 0;
		let usedParentFallback = false;
		const parentFallbackProps = new Set([
			'align_items_flex',
			'justify_content',
			'flex_direction',
			'flex_wrap',
			'gap',
			'row_gap',
			'dead_center',
			'align_everything',
		]);
		// IMPORTANT: getSelectedBlock() often returns a "light" object or the recursion fails if innerBlocks aren't fully hydrated in that specific reference.
		// Instead, we should find the selected block within the full 'allBlocks' tree to ensure we have the complete structure with innerBlocks.
		
		const findBlockByClientId = (blocks, id) => {
			for (const block of blocks) {
				if (block.clientId === id) return block;
				if (block.innerBlocks && block.innerBlocks.length > 0) {
					const found = findBlockByClientId(block.innerBlocks, id);
					if (found) return found;
				}
			}
			return null;
		};


		const fullSelectedBlock = findBlockByClientId(allBlocks, selectedBlock.clientId);

		if (!fullSelectedBlock) {
			console.warn('[Maxi AI] Could not find full selected block in allBlocks tree. Using selectedBlock state as fallback.');
		}

		const normalizedProperty = String(property || '').replace(/-/g, '_');

		if (
			normalizedProperty === 'relations' ||
			normalizedProperty === 'relations_ops' ||
			normalizedProperty === 'is_first_on_hierarchy'
		) {
			const triggerBlock = fullSelectedBlock || selectedBlock;
			const isButtonDefault =
				String(triggerBlock?.name || '').toLowerCase().includes('button');

			const recomputeRelationCss = relation => {
				const rel = ensureRelationDefaults(relation, { isButtonDefault });
				if (!rel.uniqueID || !rel.sid) return rel;

				const targetClientId = getClientIdFromUniqueId(rel.uniqueID);
				if (!targetClientId) return rel;

				const targetBlockAttributes =
					select('core/block-editor').getBlockAttributes(targetClientId) ||
					{};
				const selectedSettings = getSelectedIBSettings(
					targetClientId,
					rel.sid
				);
				if (!selectedSettings) return rel;

				const prefix = selectedSettings?.prefix || '';
				const { cleanAttributesObject, tempAttributes } =
					getCleanResponseIBAttributes(
						rel.attributes || {},
						targetBlockAttributes,
						rel.uniqueID,
						selectedSettings,
						'general',
						prefix,
						rel.sid,
						triggerBlock.clientId
					);

				const mergedAttributes = {
					...cleanAttributesObject,
					...tempAttributes,
				};

				const stylesObj = getIBStylesObj({
					clientId: targetClientId,
					sid: rel.sid,
					attributes: mergedAttributes,
					blockAttributes: targetBlockAttributes,
					breakpoint: 'general',
				});

				const styles = getIBStyles({
					stylesObj,
					blockAttributes: targetBlockAttributes,
					isFirst: true,
				});

				const nextEffects = rel.effects || createTransitionObj();
				if (rel.sid === 't' && styles && typeof styles === 'object') {
					nextEffects.transitionTarget = Object.keys(styles);
				}

				return {
					...rel,
					attributes: { ...(rel.attributes || {}), ...cleanAttributesObject },
					css: styles && typeof styles === 'object' ? styles : rel.css,
					effects: nextEffects,
					target: selectedSettings?.target || rel.target || '',
				};
			};

			if (normalizedProperty === 'relations_ops') {
				const guessDefaultTransformTarget = blockName => {
					const lower = String(blockName || '').toLowerCase();
					if (
						lower.includes('container') ||
						lower.includes('row') ||
						lower.includes('column') ||
						lower.includes('group')
					) {
						return 'container';
					}
					return 'canvas';
				};

				const normalizeScalePercent = raw => {
					if (raw === null || raw === undefined) return raw;
					const numeric =
						typeof raw === 'string'
							? Number(String(raw).trim().replace('%', ''))
							: Number(raw);
					if (!Number.isFinite(numeric)) return raw;
					// Accept 0-3 as multiplier (e.g. 1.1 => 110).
					if (numeric > 0 && numeric <= 3) {
						return Math.round(numeric * 10000) / 100;
					}
					return Math.round(numeric * 100) / 100;
				};

				const inferTransformTargetFromAttributes = attrs => {
					if (!attrs || typeof attrs !== 'object') return null;
					const direct = attrs['transform-target'] || attrs['transform_target'];
					if (direct && direct !== 'none') return direct;

					const keyPattern =
						/^transform-(scale|translate|rotate|origin)-(general|xxl|xl|l|m|s|xs)$/;
					for (const [key, value] of Object.entries(attrs)) {
						if (!keyPattern.test(key)) continue;
						if (!value || typeof value !== 'object') continue;
						const candidates = Object.keys(value);
						if (candidates.length) return candidates[0];
					}

					return null;
				};

				const buildTransformEntry = (type, rawValue) => {
					const raw =
						rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
							? rawValue
							: {};

					if (type === 'scale') {
						const x = normalizeScalePercent(raw.x ?? raw.value ?? rawValue ?? 100);
						const y = normalizeScalePercent(raw.y ?? raw.value ?? rawValue ?? 100);
						return {
							x: Number.isFinite(Number(x)) ? Number(x) : 100,
							y: Number.isFinite(Number(y)) ? Number(y) : 100,
						};
					}

					if (type === 'translate') {
						const x = Number(raw.x ?? 0);
						const y = Number(raw.y ?? 0);
						const xUnit = raw['x-unit'] || raw.unit || 'px';
						const yUnit = raw['y-unit'] || raw.unit || 'px';
						return {
							x: Number.isFinite(x) ? x : 0,
							y: Number.isFinite(y) ? y : 0,
							'x-unit': xUnit,
							'y-unit': yUnit,
						};
					}

					if (type === 'rotate') {
						const entry = {};
						const x = Number(raw.x);
						const y = Number(raw.y);
						const z = Number(raw.z ?? raw.value ?? rawValue ?? 0);
						if (Number.isFinite(x)) entry.x = x;
						if (Number.isFinite(y)) entry.y = y;
						entry.z = Number.isFinite(z) ? z : 0;
						return entry;
					}

					if (type === 'origin') {
						const entry = {};
						const x = raw.x ?? raw.value ?? rawValue ?? 'middle';
						const y = raw.y ?? raw.value ?? rawValue ?? 'center';
						entry.x = x;
						entry.y = y;
						if (raw['x-unit']) entry['x-unit'] = raw['x-unit'];
						if (raw['y-unit']) entry['y-unit'] = raw['y-unit'];
						return entry;
					}

					return {};
				};

				const normalizeTransformAttributeValue = (rawValue, type, transformTarget) => {
					if (
						rawValue &&
						typeof rawValue === 'object' &&
						!Array.isArray(rawValue)
					) {
						// Already in expected shape (target -> normal/hover)
						if (Object.prototype.hasOwnProperty.call(rawValue, transformTarget)) {
							const currentTarget = rawValue[transformTarget];
							if (
								currentTarget &&
								typeof currentTarget === 'object' &&
								('normal' in currentTarget ||
									'hover' in currentTarget ||
									'hover-status' in currentTarget)
							) {
								return rawValue;
							}
							// Wrap entry into normal state
							if (currentTarget && typeof currentTarget === 'object') {
								return {
									...rawValue,
									[transformTarget]: { normal: currentTarget },
								};
							}
						}

						// If the object looks like a single-target wrapper, keep it (we'll set transform-target separately).
						const keys = Object.keys(rawValue);
						if (keys.length === 1) {
							const onlyKey = keys[0];
							const candidate = rawValue[onlyKey];
							if (
								candidate &&
								typeof candidate === 'object' &&
								('normal' in candidate ||
									'hover' in candidate ||
									'hover-status' in candidate)
							) {
								return rawValue;
							}
						}

						// Treat as entry (x/y/z etc)
						return {
							[transformTarget]: { normal: buildTransformEntry(type, rawValue) },
						};
					}

					return {
						[transformTarget]: { normal: buildTransformEntry(type, rawValue) },
					};
				};

				const normalizeIBRelationAttributes = (
					rawAttributes,
					{ sid, targetBlockName, fallbackAttributes } = {}
				) => {
					if (!rawAttributes || typeof rawAttributes !== 'object') return {};
					const attrs = { ...rawAttributes };
					const normalizedSid = String(sid || '').toLowerCase();
					const targetName = String(targetBlockName || '');

					if ('transform_target' in attrs && !('transform-target' in attrs)) {
						attrs['transform-target'] = attrs.transform_target;
						delete attrs.transform_target;
					}

					const guessedTransformTarget =
						attrs['transform-target'] ||
						fallbackAttributes?.['transform-target'] ||
						guessDefaultTransformTarget(targetName);

					// Convert shorthand keys (common when AI mixes "hover" style props into IB relations)
					Object.entries(rawAttributes).forEach(([key, rawValue]) => {
						const normalizedKey = String(key).replace(/-/g, '_').toLowerCase();

						if (normalizedKey === 'opacity_hover' && normalizedSid === 'o') {
							delete attrs[key];
							Object.assign(
								attrs,
								buildContainerOGroupAttributeChanges('opacity', rawValue) || {}
							);
						}

						if (normalizedKey === 'opacity' && normalizedSid === 'o') {
							delete attrs[key];
							Object.assign(
								attrs,
								buildContainerOGroupAttributeChanges('opacity', rawValue) || {}
							);
						}

						if (
							normalizedSid === 't' &&
							[
								'transform_scale',
								'transform_scale_hover',
								'transform_translate',
								'transform_translate_hover',
								'transform_rotate',
								'transform_rotate_hover',
								'transform_origin',
								'transform_origin_hover',
							].includes(normalizedKey)
						) {
							delete attrs[key];
							const baseKey = normalizedKey.replace('_hover', '');
							const property = baseKey;
							const nextValue =
								rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
									? { ...rawValue, state: 'normal' }
									: rawValue;
							Object.assign(
								attrs,
								buildContainerTGroupAttributeChanges(property, nextValue, {
									attributes: {
										...(fallbackAttributes || {}),
										'transform-target': guessedTransformTarget,
									},
								}) || {}
							);
						}
					});

					// Normalize transform target + value shapes for Transform relations.
					if (normalizedSid === 't') {
						let transformTarget =
							inferTransformTargetFromAttributes(attrs) ||
							fallbackAttributes?.['transform-target'] ||
							guessDefaultTransformTarget(targetName);

						if (!transformTarget || transformTarget === 'none') {
							transformTarget = guessDefaultTransformTarget(targetName);
						}

						attrs['transform-target'] = transformTarget;

						const transformKeyPattern =
							/^transform-(scale|translate|rotate|origin)-(general|xxl|xl|l|m|s|xs)$/;
						Object.entries(attrs).forEach(([attrKey, attrValue]) => {
							const match = attrKey.match(transformKeyPattern);
							if (!match) return;
							const type = match[1];
							const normalizedValue = normalizeTransformAttributeValue(
								attrValue,
								type,
								transformTarget
							);
							attrs[attrKey] = normalizedValue;
						});
					}

					return attrs;
				};

				const ops = Array.isArray(value?.ops)
					? value.ops
					: Array.isArray(value)
						? value
						: [];

				const existingRelations = Array.isArray(triggerBlock?.attributes?.relations)
					? triggerBlock.attributes.relations
					: [];
				const existingRelationsById = new Map(
					existingRelations
						.map(relation => ensureRelationDefaults(relation, { isButtonDefault }))
						.map(relation => [Number(relation.id), relation])
				);

				const normalizeOpPayload = rawOp => {
					if (!rawOp || typeof rawOp !== 'object') return rawOp;
					if (rawOp.op !== 'add' && rawOp.op !== 'update') return rawOp;

					if (rawOp.op === 'add') {
						const relation = rawOp.relation || {};
						const targetClientId = relation?.uniqueID
							? getClientIdFromUniqueId(relation.uniqueID)
							: null;
						const targetBlockName = targetClientId
							? select('core/block-editor')?.getBlock?.(targetClientId)?.name
							: '';
						const targetBlockAttributes = targetClientId
							? select('core/block-editor')?.getBlockAttributes?.(targetClientId) || {}
							: {};

						const normalizedRelation = {
							...relation,
							attributes: normalizeIBRelationAttributes(relation.attributes, {
								sid: relation.sid,
								targetBlockName,
								fallbackAttributes: targetBlockAttributes,
							}),
						};

						return { ...rawOp, relation: normalizedRelation };
					}

					if (rawOp.op === 'update') {
						const id = Number(rawOp.id);
						const existing = existingRelationsById.get(id);
						const patch = rawOp.patch || {};
						const uniqueID = patch.uniqueID || existing?.uniqueID;
						const sid = patch.sid || existing?.sid;
						const targetClientId = uniqueID ? getClientIdFromUniqueId(uniqueID) : null;
						const targetBlockName = targetClientId
							? select('core/block-editor')?.getBlock?.(targetClientId)?.name
							: '';
						const targetBlockAttributes = targetClientId
							? select('core/block-editor')?.getBlockAttributes?.(targetClientId) || {}
							: {};
						const normalizedPatch = {
							...patch,
							attributes: normalizeIBRelationAttributes(patch.attributes, {
								sid,
								targetBlockName,
								fallbackAttributes: targetBlockAttributes,
							}),
						};
						return { ...rawOp, patch: normalizedPatch };
					}

					return rawOp;
				};

				const normalizedOps = ops.map(normalizeOpPayload);
				const { relations: nextRelations, touchedIds } = applyRelationsOps(
					triggerBlock?.attributes?.relations,
					normalizedOps,
					{ isButtonDefault }
				);

				const recomputed = nextRelations.map(relation => {
					const safeRelation = ensureRelationDefaults(relation, {
						isButtonDefault,
					});
					const targetClientId = safeRelation.uniqueID
						? getClientIdFromUniqueId(safeRelation.uniqueID)
						: null;
					const targetBlockName = targetClientId
						? select('core/block-editor')?.getBlock?.(targetClientId)?.name
						: '';
					const targetBlockAttributes = targetClientId
						? select('core/block-editor')?.getBlockAttributes?.(targetClientId) || {}
						: {};
					safeRelation.attributes = normalizeIBRelationAttributes(
						safeRelation.attributes,
						{
							sid: safeRelation.sid,
							targetBlockName,
							fallbackAttributes: targetBlockAttributes,
						}
					);
					const shouldRecompute =
						touchedIds.has(safeRelation.id) ||
						!safeRelation.css ||
						(typeof safeRelation.css === 'object' &&
							Object.keys(safeRelation.css).length === 0);
					return shouldRecompute
						? recomputeRelationCss(safeRelation)
						: safeRelation;
				});

				registry.batch(() => {
					updateBlockAttributes(triggerBlock.clientId, {
						relations: recomputed,
					});
				});

				return __('Updated Interaction Builder relations.', 'maxi-blocks');
			}

			if (normalizedProperty === 'relations') {
				const nextRelations = Array.isArray(value) ? value : [];
				const normalized = nextRelations.map(relation =>
					ensureRelationDefaults(relation, { isButtonDefault })
				);
				registry.batch(() => {
					updateBlockAttributes(triggerBlock.clientId, {
						relations: normalized,
					});
				});
				return __('Updated Interaction Builder relations.', 'maxi-blocks');
			}

			if (normalizedProperty === 'is_first_on_hierarchy') {
				const metaChanges = buildMetaAGroupAttributeChanges(
					'is_first_on_hierarchy',
					value,
					{
						attributes: triggerBlock?.attributes,
						targetKey: resolveMetaTargetKey(triggerBlock?.name),
					}
				);
				if (metaChanges) {
					registry.batch(() => {
						updateBlockAttributes(triggerBlock.clientId, metaChanges);
					});
				}
				return __('Updated block settings.', 'maxi-blocks');
			}
		}

		const blocksToProcess = [fullSelectedBlock || selectedBlock];
		const normalizedTarget = normalizeTargetBlock(property, targetBlock);
		
		// Wrap in batch
		registry.batch(() => {
			count = applyUpdatesToBlocks(blocksToProcess, property, value, normalizedTarget);
		});

		if (count === 0 && (parentFallbackProps.has(property) || normalizedTarget)) {
			const { getBlockParents, getBlock } = select('core/block-editor');
			const parentIds = getBlockParents(selectedBlock.clientId) || [];
			const parentBlocks = parentIds
				.map(parentId => getBlock(parentId))
				.filter(Boolean);

			let fallbackParent = null;
			if (normalizedTarget) {
				fallbackParent = parentBlocks.find(parent =>
					matchesTargetBlockName(parent.name, normalizedTarget)
				);
			}

			if (!fallbackParent && normalizedTarget && String(normalizedTarget).toLowerCase() === 'container') {
				fallbackParent = parentBlocks.find(parent =>
					parent &&
					(parent.name.includes('column') ||
						parent.name.includes('row') ||
						parent.name.includes('group') ||
						parent.name.includes('container'))
				);
			}

			if (!fallbackParent && parentFallbackProps.has(property)) {
				fallbackParent = parentBlocks.find(parent =>
					parent &&
					(parent.name.includes('column') ||
						parent.name.includes('row') ||
						parent.name.includes('group') ||
						parent.name.includes('container'))
				);
			}

			if (fallbackParent) {
				registry.batch(() => {
					count = applyUpdatesToBlocks([fallbackParent], property, value, null, fallbackParent.clientId);
				});
				usedParentFallback = count > 0;
			}
		}


		if (count === 0) {
			return __('No matching components found in selection.', 'maxi-blocks');
		}

		if (usedParentFallback) {
			return __('Updated the parent layout block.', 'maxi-blocks');
		}

		return count === 1 
			? __('Updated the selected block.', 'maxi-blocks')
			: `Updated ${count} items in the selection.`;
	};

	// Hover Animation Helper
	const applyHoverAnimation = (currentAttributes, shadowValue) => {
		// 1. Define the Smooth Transition (Applied to Base)
		const transitionSettings = "box-shadow 0.3s ease, transform 0.3s ease";
		
		// 2. Define the "Lift" Effect (Applied to Hover)
		const hoverTransform = "translateY(-5px)";
		
		const prefix = getBlockPrefix(selectedBlock?.name || '');
		
		// Shadow Value should be object {x, y, blur, spread, color}
		const { x=0, y=10, blur=30, spread=0, color='rgba(0,0,0,0.1)' } = (typeof shadowValue === 'object') ? shadowValue : {};

		return {
			// Base State: Clean slate + Transition
			[`${prefix}box-shadow-general`]: 'none', // Or should we rely on status?
			[`${prefix}box-shadow-status-general`]: false, // Explicitly disable base shadow
			[`${prefix}transition-general`]: transitionSettings,
			
			// Hover State: The Shadow + The Lift
			[`${prefix}box-shadow-status-hover`]: true,
			[`${prefix}box-shadow-horizontal-hover`]: x,
			[`${prefix}box-shadow-vertical-hover`]: y,
			[`${prefix}box-shadow-blur-hover`]: blur,
			[`${prefix}box-shadow-spread-hover`]: spread,
			[`${prefix}box-shadow-color-hover`]: color,
			[`${prefix}box-shadow-horizontal-unit-hover`]: 'px',
			[`${prefix}box-shadow-vertical-unit-hover`]: 'px',
			[`${prefix}box-shadow-blur-unit-hover`]: 'px',
			[`${prefix}box-shadow-spread-unit-hover`]: 'px',
			
			[`${prefix}transform-hover`]: hoverTransform,
		};
	};

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
					if (paletteMatch) {
						nextValue = Number(paletteMatch[1]);
					}
				}
			}
			return {
				property: 'background_color',
				value: breakpoint ? { value: nextValue, breakpoint } : nextValue,
			};
		}

		if (baseProperty === 'border_radius' && breakpoint) {
			return {
				property: 'border_radius',
				value: { value, breakpoint },
			};
		}
		if (baseProperty === 'column_size' && breakpoint) {
			return {
				property: 'column_size',
				value: { value, breakpoint },
			};
		}
		if (baseProperty === 'column_fit_content' && breakpoint) {
			return {
				property: 'column_fit_content',
				value: { value, breakpoint },
			};
		}

		if (
			[
				'arrow_status',
				'arrow_side',
				'arrow_position',
				'arrow_width',
				'advanced_css',
				'custom_css',
				'column_gap',
				'icon_background',
				'icon_border',
				'icon_border_radius',
				'icon_fill_color',
				'icon_force_aspect_ratio',
				'icon_height',
				'icon_padding',
				'icon_spacing',
				'icon_stroke_color',
				'icon_stroke_width',
				'icon_width',
				'flex_basis',
				'flex_grow',
				'flex_shrink',
				'flex_direction',
				'flex_wrap',
				'force_aspect_ratio',
				'full_width',
				'height',
			].includes(baseProperty) &&
			breakpoint
		) {
			return {
				property: baseProperty,
				value: { value, breakpoint },
			};
		}

		if (
			breakpoint &&
			(baseProperty.startsWith('link_color') ||
				baseProperty.startsWith('link_palette_'))
		) {
			return {
				property: baseProperty,
				value: { value, breakpoint },
			};
		}

		if (baseProperty === 'display' && breakpoint) {
			return {
				property: 'display',
				value: { value, breakpoint },
			};
		}

		if (baseProperty === 'breakpoints' && breakpoint) {
			return {
				property: 'breakpoints',
				value: { value, breakpoint },
			};
		}

		if (baseProperty === 'link_target') {
			let targetValue = value;
			if (typeof targetValue === 'string') {
				const lowered = targetValue.toLowerCase();
				if (lowered.includes('blank') || lowered.includes('new')) {
					targetValue = '_blank';
				} else if (lowered.includes('self') || lowered.includes('same')) {
					targetValue = '_self';
				}
			}
			return { property: 'link_settings', value: { target: targetValue } };
		}

		if (baseProperty === 'link_rel') {
			return { property: 'link_settings', value: { rel: value } };
		}

		if (baseProperty === 'link_url') {
			return { property: 'link_settings', value: { url: value } };
		}

		return { property: baseProperty, value };
	};

	const normalizeIconQueryValue = value => {
		const raw = String(value || '').trim();
		if (!raw) return '';
		const normalized = raw.replace(/[-_]+/g, ' ');
		return extractIconQuery(normalized) || normalized;
	};

	const resolveButtonIconFromTypesense = async ({ property, value, targetBlock }) => {
		if (!property) return null;

		const iconProperties = new Set([
			'button_icon_add',
			'button_icon_change',
			'icon_content',
			'icon_content_hover',
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

		// Reject meta-description values the AI sends when it can't express per-block intent
		// e.g. "each-column", "per-block", "different-per-column", "list"
		if (/\b(each|per-block|per-column|different|various|multiple|list|all-columns)\b/i.test(trimmed)) {
			return { error: `Cannot set different icons per-block with update_page. Use MODIFY_BLOCK with ops to set individual icons.` };
		}

		const query = normalizeIconQueryValue(trimmed);
		if (!query) return null;

		const iconResult = await findBestIcon(query, { target: 'icon' });

		if (!iconResult || !iconResult.svgCode) {
			return { error: `I couldn't find an icon for "${query}" in the Cloud Library.` };
		}

		if (iconResult.isPro) {
			return {
				error: `Found "${iconResult.title}" but it's a Pro icon. Upgrade to MaxiBlocks Pro to use it.`,
			};
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
			value: {
				svgCode: iconResult.svgCode,
				svgType: iconResult.svgType,
				title: iconResult.title,
			},
			targetBlock: 'button',
			message: `Updated icon to "${iconResult.title}".`,
		};
	};

	const parseAndExecuteAction = async responseText => {
		const getToolbarDocuments = () => {
			const docs = [];
			if (typeof document === 'undefined') return docs;
			docs.push(document);
			document.querySelectorAll('iframe').forEach(frame => {
				try {
					if (frame.contentDocument) docs.push(frame.contentDocument);
				} catch (err) {
					logAIDebug('Unable to access iframe document', err);
				}
			});
			return docs;
		};

		const getToolbarWindows = () => {
			const wins = [];
			if (typeof window === 'undefined') return wins;
			wins.push(window);
			if (typeof document === 'undefined') return wins;
			document.querySelectorAll('iframe').forEach(frame => {
				try {
					if (frame.contentWindow) wins.push(frame.contentWindow);
				} catch (err) {
					logAIDebug('Unable to access iframe window', err);
				}
			});
			return wins;
		};

		const tryClickToolbarButton = (selector, label) => {
			if (typeof window === 'undefined') return false;
			const docs = getToolbarDocuments();
			for (const doc of docs) {
				let button = null;
				const toolbar = doc.querySelector('.maxi-toolbar__popover');
				if (toolbar) {
					button = toolbar.querySelector(selector);
				}
				if (!button) {
					button = doc.querySelector(selector);
				}
				if (!button) continue;
				const isExpanded = button.getAttribute('aria-expanded') === 'true';
				if (isExpanded) {
					logAIDebug('Toolbar button already open for', label);
					return true;
				}
				if (
					button.hasAttribute('disabled') ||
					button.getAttribute('aria-disabled') === 'true'
				) {
					logAIDebug('Toolbar button disabled for', label);
					return false;
				}
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
				if (!success && tries < attempts) {
					setTimeout(attempt, delay);
				}
			};
			attempt();
		};

		const queueToolbarOpen = (target, clientId, options = {}) => {
			if (typeof window === 'undefined' || !target) return;
			const detail = { target, clientId, ...options };
			const windows = getToolbarWindows();
			windows.forEach(win => {
				try {
					win.maxiToolbarOpenRequest = {
						...detail,
						requestedAt: Date.now(),
					};
					win.dispatchEvent(
						new win.CustomEvent('maxi-toolbar-open', { detail })
					);
				} catch (err) {
					logAIDebug('Failed to dispatch toolbar open event', err);
				}
			});
		};

		const openLinkToolbar = () => {
			const targetClientId = selectedBlock?.clientId;
			if (!targetClientId || typeof window === 'undefined') return;
			try {
				dispatch('core/block-editor').selectBlock(targetClientId);
				logAIDebug('Re-selected block before opening link toolbar', {
					clientId: targetClientId,
					block: selectedBlock?.name,
				});
			} catch (err) {
				logAIDebug('Failed to re-select block before opening link toolbar', err);
			}
			setTimeout(() => {
				queueToolbarOpen('link', targetClientId, { force: true });
				scheduleToolbarClick(
					'.toolbar-item__link.toolbar-item__button, .toolbar-item__link',
					'link'
				);
			}, 150);
			logAIDebug('Requested link toolbar open', {
				clientId: targetClientId,
				block: selectedBlock?.name,
			});
		};
		const openTextLinkToolbar = () => {
			const targetClientId = selectedBlock?.clientId;
			if (!targetClientId || typeof window === 'undefined') return;
			try {
				dispatch('core/block-editor').selectBlock(targetClientId);
				logAIDebug('Re-selected block before opening text-link toolbar', {
					clientId: targetClientId,
					block: selectedBlock?.name,
				});
			} catch (err) {
				logAIDebug(
					'Failed to re-select block before opening text-link toolbar',
					err
				);
			}
			setTimeout(() => {
				queueToolbarOpen('text-link', targetClientId, { force: true });
				scheduleToolbarClick(
					'.toolbar-item__text-link.toolbar-item__button, .toolbar-item__text-link .toolbar-item__button',
					'text-link'
				);
			}, 150);
			logAIDebug('Requested text-link toolbar open', {
				clientId: targetClientId,
				block: selectedBlock?.name,
			});
		};

		const openLinkSettingsTab = state => {
			if (!state || state === 'link') return;
			if (typeof document === 'undefined') return;

			const labelMap = {
				link: 'Link',
				hover: 'Hover',
				active: 'Active',
				visited: 'Visited',
			};
			const label = labelMap[state];
			if (!label) return;

			setTimeout(() => {
				const containers = document.querySelectorAll(
					'.maxi-typography-control__link-options'
				);
				if (!containers.length) return;
				const targetLabel = label.toLowerCase();
				for (const container of containers) {
					const buttons = container.querySelectorAll(
						'button, [role="tab"]'
					);
					for (const button of buttons) {
						const text = button.textContent?.trim().toLowerCase();
						if (text === targetLabel) {
							button.click();
							return;
						}
					}
				}
			}, 200);
		};

		const openSidebarForProperty = rawProperty => {
			if (!rawProperty) return;
			const property = String(rawProperty).replace(/-/g, '_');
			const baseProperty = property.replace(/_(general|xxl|xl|l|m|s|xs)$/, '');
			const normalizedProperty = baseProperty;
			const isTextBlock =
				selectedBlock?.name?.includes('text-maxi') ||
				selectedBlock?.name?.includes('list-item-maxi');
			if (normalizedProperty === 'text_link') {
				logAIDebug('Text link property detected for toolbar open', {
					property: normalizedProperty,
					rawProperty,
				});
				openTextLinkToolbar();
				return;
			}
			const isLinkProperty =
				normalizedProperty === 'link_settings' ||
				normalizedProperty === 'link' ||
				normalizedProperty.startsWith('dc_link');
			if (isLinkProperty) {
				logAIDebug('Link property detected for sidebar open', {
					property: normalizedProperty,
					rawProperty,
				});
				if (isTextBlock) {
					openTextLinkToolbar();
				} else {
					openLinkToolbar();
				}
				return;
			}
			const dcTarget = getDcGroupSidebarTarget(
				normalizedProperty,
				selectedBlock?.name
			);
			if (dcTarget) {
				openSidebarAccordion(dcTarget.tabIndex, dcTarget.accordion);
				return;
			}
			const isAccordionBlock = selectedBlock?.name?.includes('accordion');
			if (isAccordionBlock) {
				const accordionTarget = getAccordionSidebarTarget(normalizedProperty);
				if (accordionTarget) {
					openSidebarAccordion(
						accordionTarget.tabIndex,
						accordionTarget.accordion
					);
					return;
				}
			}
			const isColumnBlock = selectedBlock?.name?.includes('column');
			if (isColumnBlock) {
				const columnTarget = getColumnSidebarTarget(normalizedProperty);
				if (columnTarget) {
					openSidebarAccordion(
						columnTarget.tabIndex,
						columnTarget.accordion
					);
					return;
				}
			}
			const isDividerBlock = selectedBlock?.name?.includes('divider');
			if (isDividerBlock) {
				const dividerTarget = getDividerSidebarTarget(normalizedProperty);
				if (dividerTarget) {
					openSidebarAccordion(
						dividerTarget.tabIndex,
						dividerTarget.accordion
					);
					return;
				}
			}
			const isImageBlock = selectedBlock?.name?.includes('image');
			if (isImageBlock) {
				const imageTarget = getImageSidebarTarget(normalizedProperty);
				if (imageTarget) {
					openSidebarAccordion(
						imageTarget.tabIndex,
						imageTarget.accordion
					);
					return;
				}
			}
			const isIconBlock =
				selectedBlock?.name?.includes('svg-icon') ||
				selectedBlock?.name?.includes('icon-maxi');
			if (isIconBlock) {
				const iconTarget = getIconSidebarTarget(normalizedProperty);
				if (iconTarget) {
					openSidebarAccordion(
						iconTarget.tabIndex,
						iconTarget.accordion
					);
					return;
				}
			}
			const isNumberCounterBlock = selectedBlock?.name?.includes('number-counter');
			if (isNumberCounterBlock) {
				const counterTarget = getNumberCounterSidebarTarget(normalizedProperty);
				if (counterTarget) {
					openSidebarAccordion(
						counterTarget.tabIndex,
						counterTarget.accordion
					);
					return;
				}
			}
			const isButtonBlock = selectedBlock?.name?.includes('button');
			if (isButtonBlock) {
				const buttonTarget = getButtonAGroupSidebarTarget(normalizedProperty);
				if (buttonTarget) {
					openSidebarAccordion(buttonTarget.tabIndex, buttonTarget.accordion);
					return;
				}
				const buttonBTarget = getButtonBGroupSidebarTarget(normalizedProperty);
				if (buttonBTarget) {
					openSidebarAccordion(
						buttonBTarget.tabIndex,
						buttonBTarget.accordion
					);
					return;
				}
				const buttonCTarget = getButtonCGroupSidebarTarget(normalizedProperty);
				if (buttonCTarget) {
					openSidebarAccordion(
						buttonCTarget.tabIndex,
						buttonCTarget.accordion
					);
					return;
				}
				const buttonITarget = getButtonIGroupSidebarTarget(normalizedProperty);
				if (buttonITarget) {
					openSidebarAccordion(
						buttonITarget.tabIndex,
						buttonITarget.accordion
					);
					return;
				}
			}
			if (isTextBlock) {
				const textListTarget = getTextListGroupSidebarTarget(normalizedProperty);
				if (textListTarget) {
					openSidebarAccordion(
						textListTarget.tabIndex,
						textListTarget.accordion
					);
					return;
				}
				const textLTarget = getTextLGroupSidebarTarget(normalizedProperty);
				if (textLTarget) {
					openSidebarAccordion(textLTarget.tabIndex, textLTarget.accordion);
					openLinkSettingsTab(textLTarget.state);
					return;
				}
				const textCTarget = getTextCGroupSidebarTarget(normalizedProperty);
				if (textCTarget) {
					openSidebarAccordion(textCTarget.tabIndex, textCTarget.accordion);
					return;
				}
				const textPTarget = getTextPGroupSidebarTarget(normalizedProperty);
				if (textPTarget) {
					openSidebarAccordion(textPTarget.tabIndex, textPTarget.accordion);
					return;
				}
				const textTypographyTarget = getTextTypographySidebarTarget(
					normalizedProperty
				);
				if (textTypographyTarget) {
					openSidebarAccordion(
						textTypographyTarget.tabIndex,
						textTypographyTarget.accordion
					);
					return;
				}
			}
			const aGroupTarget = getContainerAGroupSidebarTarget(normalizedProperty);
			if (aGroupTarget) {
				openSidebarAccordion(aGroupTarget.tabIndex, aGroupTarget.accordion);
				return;
			}
			const bGroupTarget = getContainerBGroupSidebarTarget(normalizedProperty);
			if (bGroupTarget) {
				openSidebarAccordion(bGroupTarget.tabIndex, bGroupTarget.accordion);
				return;
			}
			const cGroupTarget = getContainerCGroupSidebarTarget(normalizedProperty);
			if (cGroupTarget) {
				openSidebarAccordion(cGroupTarget.tabIndex, cGroupTarget.accordion);
				return;
			}
			const dGroupTarget = getContainerDGroupSidebarTarget(normalizedProperty);
			if (dGroupTarget) {
				openSidebarAccordion(dGroupTarget.tabIndex, dGroupTarget.accordion);
				return;
			}
			const eGroupTarget = getContainerEGroupSidebarTarget(normalizedProperty);
			if (eGroupTarget) {
				openSidebarAccordion(eGroupTarget.tabIndex, eGroupTarget.accordion);
				return;
			}
			const fGroupTarget = getContainerFGroupSidebarTarget(normalizedProperty);
			if (fGroupTarget) {
				openSidebarAccordion(fGroupTarget.tabIndex, fGroupTarget.accordion);
				return;
			}
			const hGroupTarget = getContainerHGroupSidebarTarget(normalizedProperty);
			if (hGroupTarget) {
				openSidebarAccordion(hGroupTarget.tabIndex, hGroupTarget.accordion);
				return;
			}
			const lGroupTarget = getContainerLGroupSidebarTarget(normalizedProperty);
			if (lGroupTarget) {
				openSidebarAccordion(lGroupTarget.tabIndex, lGroupTarget.accordion);
				return;
			}
			const mGroupTarget = getContainerMGroupSidebarTarget(normalizedProperty);
			if (mGroupTarget) {
				openSidebarAccordion(mGroupTarget.tabIndex, mGroupTarget.accordion);
				return;
			}
			const wGroupTarget = getContainerWGroupSidebarTarget(normalizedProperty);
			if (wGroupTarget) {
				openSidebarAccordion(wGroupTarget.tabIndex, wGroupTarget.accordion);
				return;
			}
			const pGroupTarget = getContainerPGroupSidebarTarget(normalizedProperty);
			if (pGroupTarget) {
				openSidebarAccordion(pGroupTarget.tabIndex, pGroupTarget.accordion);
				return;
			}
			const rGroupTarget = getContainerRGroupSidebarTarget(normalizedProperty);
			if (rGroupTarget) {
				openSidebarAccordion(rGroupTarget.tabIndex, rGroupTarget.accordion);
				return;
			}
			const sGroupTarget = getContainerSGroupSidebarTarget(normalizedProperty);
			if (sGroupTarget) {
				openSidebarAccordion(sGroupTarget.tabIndex, sGroupTarget.accordion);
				return;
			}
			const tGroupTarget = getContainerTGroupSidebarTarget(normalizedProperty);
			if (tGroupTarget) {
				openSidebarAccordion(tGroupTarget.tabIndex, tGroupTarget.accordion);
				return;
			}
			const oGroupTarget = getContainerOGroupSidebarTarget(normalizedProperty);
			if (oGroupTarget) {
				openSidebarAccordion(oGroupTarget.tabIndex, oGroupTarget.accordion);
				return;
			}
			const zGroupTarget = getContainerZGroupSidebarTarget(normalizedProperty);
			if (zGroupTarget) {
				openSidebarAccordion(zGroupTarget.tabIndex, zGroupTarget.accordion);
				return;
			}

			switch (normalizedProperty) {
				case 'responsive_padding':
				case 'padding':
				case 'margin':
					openSidebarAccordion(0, 'margin / padding');
					return;
				case 'size':
				case 'width':
				case 'height':
				case 'min_width':
				case 'max_width':
				case 'min_height':
				case 'max_height':
				case 'full_width':
				case 'width_fit_content':
				case 'height_fit_content':
					openSidebarAccordion(0, 'height / width');
					return;
				case 'background_color':
				case 'background_palette_color':
				case 'background_palette_status':
				case 'background_palette_opacity':
				case 'background':
				case 'background_layers':
				case 'background_layers_hover':
				case 'block_background_status_hover':
					openSidebarAccordion(0, 'background / layer');
					return;
				case 'border':
				case 'border_radius':
				case 'border_hover':
					openSidebarAccordion(0, 'border');
					return;
				case 'box_shadow':
				case 'box_shadow_hover':
				case 'hover_glow':
					openSidebarAccordion(0, 'box shadow');
					return;
				case 'shape_divider':
				case 'shape_divider_top':
				case 'shape_divider_bottom':
				case 'shape_divider_both':
				case 'shape_divider_color':
				case 'shape_divider_color_top':
				case 'shape_divider_color_bottom':
					openSidebarAccordion(0, 'shape divider');
					return;
				case 'context_loop':
					openSidebarAccordion(0, 'context loop');
					return;
				case 'arrow_status':
				case 'arrow_side':
				case 'arrow_position':
				case 'arrow_width':
					openSidebarAccordion(0, 'callout arrow');
					return;
				case 'anchor_link':
				case 'unique_id':
				case 'aria_label':
				case 'relations':
				case 'relations_ops':
				case 'is_first_on_hierarchy': {
					const metaProperty =
						normalizedProperty === 'relations_ops'
							? 'relations'
							: normalizedProperty;
					const sidebarTarget = getMetaSidebarTarget(metaProperty);
					if (sidebarTarget) {
						openSidebarAccordion(
							sidebarTarget.tabIndex,
							sidebarTarget.accordion
						);
					}
					return;
				}
				case 'custom_css':
					openSidebarAccordion(1, 'custom css');
					return;
				case 'advanced_css': {
					const sidebarTarget = getAdvancedCssSidebarTarget(
						'advanced_css',
						selectedBlock?.name
					);
					if (sidebarTarget) {
						openSidebarAccordion(
							sidebarTarget.tabIndex,
							sidebarTarget.accordion
						);
					}
					return;
				}
				case 'scroll_fade':
					openSidebarAccordion(1, 'scroll effects');
					return;
				case 'transform':
				case 'transform_scale_hover':
				case 'hover_effect':
				case 'hover_lift':
					openSidebarAccordion(1, 'transform');
					return;
				case 'transition':
					openSidebarAccordion(1, 'hover transition');
					return;
				case 'display':
				case 'display_mobile':
				case 'display_tablet':
				case 'display_desktop':
				case 'show_mobile_only':
					openSidebarAccordion(1, 'show/hide block');
					return;
				case 'opacity':
				case 'opacity_hover':
				case 'opacity_status_hover':
				case 'hover_darken':
				case 'hover_lighten':
					openSidebarAccordion(1, 'opacity');
					return;
				case 'position':
				case 'position_top':
				case 'position_right':
				case 'position_bottom':
				case 'position_left':
					openSidebarAccordion(1, 'position');
					return;
				case 'overflow':
					openSidebarAccordion(1, 'overflow');
					return;
				case 'z_index':
					openSidebarAccordion(1, 'z-index');
					return;
				case 'align_items':
				case 'align_items_flex':
				case 'align_content':
				case 'justify_content':
				case 'flex_direction':
				case 'flex_wrap':
				case 'gap':
				case 'row_gap':
				case 'column_gap':
					openSidebarAccordion(1, 'flexbox');
					return;
				default:
			}
		};

		const extractJsonChunks = text => {
			if (typeof text !== 'string') return [];
			const chunks = [];
			let depth = 0;
			let start = -1;
			let inString = false;
			let escapeNext = false;

			for (let i = 0; i < text.length; i += 1) {
				const ch = text[i];

				if (escapeNext) {
					escapeNext = false;
					continue;
				}

				if (ch === '\\\\') {
					escapeNext = true;
					continue;
				}

				if (ch === '"') {
					inString = !inString;
					continue;
				}

				if (inString) continue;

				if (ch === '{' || ch === '[') {
					if (depth === 0) start = i;
					depth += 1;
				} else if (ch === '}' || ch === ']') {
					depth -= 1;
					if (depth === 0 && start !== -1) {
						chunks.push(text.slice(start, i + 1));
						start = -1;
					}
				}
			}

			return chunks;
		};

		try {
			if (typeof responseText === 'string') {
				const chunks = extractJsonChunks(responseText);
				if (chunks.length > 1) {
					const parsedChunks = [];
					chunks.forEach(chunk => {
						try {
							parsedChunks.push(JSON.parse(chunk));
						} catch (parseError) {
							console.warn(
								'[Maxi AI Debug] Failed to parse JSON chunk:',
								parseError
							);
						}
					});

					let lastResult = { executed: false };
					for (const item of parsedChunks) {
						lastResult = await parseAndExecuteAction(item);
					}
					return lastResult;
				}
			}

			let action;
			
			// If already an object (from client-side interception), use it directly
			if (typeof responseText === 'object' && responseText !== null) {
				action = responseText;
			} else {
				try {
					action = JSON.parse(responseText.trim());
				} catch {
					const chunks = extractJsonChunks(responseText);
					if (chunks.length === 1) {
						try {
							action = JSON.parse(chunks[0]);
						} catch (parseError) {
							console.warn('[Maxi AI Debug] Failed to parse JSON from response:', parseError);
						}
					} else if (chunks.length > 1) {
						const parsedChunks = [];
						chunks.forEach(chunk => {
							try {
								parsedChunks.push(JSON.parse(chunk));
							} catch (parseError) {
								console.warn('[Maxi AI Debug] Failed to parse JSON chunk:', parseError);
							}
						});
						if (parsedChunks.length === 1) action = parsedChunks[0];
						else if (parsedChunks.length > 1) action = parsedChunks;
					}
				}
			}

			if (action?.actions && Array.isArray(action.actions)) {
				action = action.actions;
			}

			if (Array.isArray(action)) {
				let lastResult = { executed: false };
				for (const item of action) {
					lastResult = await parseAndExecuteAction(item);
				}
				return lastResult;
			}

			if (action?.property) {
				const normalized = normalizeActionProperty(action.property, action.value);
				action.property = normalized.property;
				action.value = normalized.value;
			}

			// FALLBACK: If AI returned plain text for known clarification patterns, synthesize the response
			if (!action || !action.action) {
				const responseString = typeof responseText === 'string'
					? responseText
					: JSON.stringify(responseText || '');
				const lowerText = responseString.toLowerCase();
				
				// Detect rounded corners clarification
				if (lowerText.includes('rounded') || lowerText.includes('corner')) {
					console.log('[Maxi AI Debug] Fallback: Detected rounded corners clarification in plain text');
					return {
						executed: false,
						message: 'How rounded should the corners be?',
						options: ['Subtle (8px)', 'Soft (24px)', 'Full (50px)']
					};
				}
				
				// Detect shadow clarification
				if (lowerText.includes('shadow')) {
					console.log('[Maxi AI Debug] Fallback: Detected shadow clarification in plain text');
					return {
						executed: false,
						message: 'What style of shadow would you like?',
						options: ['Soft', 'Crisp', 'Bold', 'Glow']
					};
				}

				// Detect spacing/padding clarification
				if (lowerText.includes('spacing') || lowerText.includes('padding') || lowerText.includes('space')) {
					console.log('[Maxi AI Debug] Fallback: Detected spacing clarification in plain text');
					return {
						executed: false,
						message: 'How much vertical spacing would you like?',
						options: ['Compact', 'Comfortable', 'Spacious', 'Remove']
					};
				}

				// Detect border clarification
				if (lowerText.includes('border')) {
					console.log('[Maxi AI Debug] Fallback: Detected border clarification in plain text');
					return {
						executed: false,
						message: 'What style of border would you like?',
						options: ['Subtle Border', 'Strong Border', 'Brand Border']
					};
				}
				
				// No pattern matched, return as regular message
				return { executed: false, message: responseString };
			}

			// DEBUG: Log parsed action
			console.log('[Maxi AI Debug] Parsed action:', JSON.stringify(action, null, 2));

			// --- NEW ACTION TYPES ---
			
			if (action.action === 'CLARIFY') {
				// Map CLARIFY to the existing message/options structure
				console.log('[Maxi AI Debug] CLARIFY action detected');
				console.log('[Maxi AI Debug] Raw options:', action.options);
				
				const optionsLabels = action.options?.map(opt => opt.label) || [];
				console.log('[Maxi AI Debug] Extracted option labels:', optionsLabels);
				
				return { 
					executed: false, 
					message: action.message, 
					options: optionsLabels 
				};
			}

			if (action.action === 'CLOUD_MODAL_UI') {
				const modalResult = await executeCloudModalUiOps(action.ops, {
					insertCloudBlock: insertMaxiCloudLibraryBlock,
					logDebug: msg => logAIDebug(String(msg)),
				});
				return {
					executed: modalResult.ok,
					message:
						action.message ||
						modalResult.message ||
						(modalResult.ok
							? 'Cloud Library UI updated.'
							: 'Cloud Library UI could not be driven.'),
				};
			}

			if (action.action === 'MODIFY_BLOCK') {
				// Handle add/insert ops before scope resolution — no existing block needed
				if (action.payload?.op === 'add' || action.payload?.block) {
					const buildBlockTree = ( descriptor ) => {
						if ( ! descriptor?.name ) return null;
						const children = ( descriptor.innerBlocks || [] ).map( buildBlockTree ).filter( Boolean );
						return createBlock( descriptor.name, descriptor.attributes || {}, children );
					};
					const blockDescriptor = action.payload?.block;
					let newBlock;
					if ( blockDescriptor?.name ) {
						newBlock = buildBlockTree( blockDescriptor );
					} else {
						const BLOCK_NAME_MAP = { container: 'maxi-blocks/container-maxi', section: 'maxi-blocks/container-maxi', row: 'maxi-blocks/row-maxi', column: 'maxi-blocks/column-maxi' };
						const requestedType = blockDescriptor?.type?.toLowerCase() || 'container';
						newBlock = createBlock( BLOCK_NAME_MAP[ requestedType ] || 'maxi-blocks/container-maxi' );
					}
					if ( ! newBlock ) return { executed: false, message: 'Could not build block structure from AI response.' };
					dispatch( 'core/block-editor' ).insertBlocks( newBlock );
					return { executed: true, message: action.message || 'Block added to the page.' };
				}

				// Handle bulk child-insert ops — supports both payload shapes the AI produces:
				//   payload.update_inner_blocks: [{ parent_clientId, add_block }]
				//   payload.ops:                 [{ op:'append_child', parent_clientId, block }]
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
						if (t.startsWith('<') && t.endsWith('>')) return null;
						if (/placeholder|example|your-/i.test(t)) return null;
						return t;
					};
					const isPlaceholderParentId = id => {
						if (!id || typeof id !== 'string') return true;
						const t = id.trim();
						if (t.startsWith('<') && t.endsWith('>')) return true;
						return /placeholder|example|your-/i.test(t);
					};
					let opsQueue = Array.isArray(childOps) ? [...childOps] : [];
					const firstDesc = opsQueue[0]
						? opsQueue[0].add_block ?? opsQueue[0].block
						: null;
					const firstIsButton =
						typeof firstDesc?.name === 'string' &&
						firstDesc.name.includes('button-maxi');
					const allParentsPlaceholder =
						opsQueue.length > 0 &&
						opsQueue.every(op => isPlaceholderParentId(normalizeParentClientId(op)));
					if (allParentsPlaceholder && firstIsButton && scope === 'page') {
						const emptyColumns = collectBlocks(allBlocks, b =>
							typeof b.name === 'string' &&
							b.name.includes('column-maxi') &&
							(!b.innerBlocks || b.innerBlocks.length === 0)
						);
						if (emptyColumns.length > 0) {
							const templateOp = opsQueue[0];
							opsQueue = emptyColumns.map(col => ({
								...templateOp,
								op: templateOp.op || 'append_child',
								parent_clientId: col.clientId,
							}));
							logAIDebug(
								'MODIFY_BLOCK: resolved placeholder parents to empty columns',
								String(emptyColumns.length)
							);
						}
					}
					let inserted = 0;
					let sawExistingParent = false;
					for (const op of opsQueue) {
						const blockDescriptor = op.add_block ?? op.block ?? null;
						if (!blockDescriptor?.name) continue;
						const newBlock = buildBlockTree(blockDescriptor);
						if (!newBlock) continue;
						const parentId = normalizeParentClientId(op);
						if (!parentId) {
							logAIDebug(
								'MODIFY_BLOCK child op: skip, invalid parent_clientId',
								JSON.stringify(op.parent_clientId ?? op.parentClientId)
							);
							continue;
						}
						const parentBlock = editorSelect.getBlock(parentId);
						if (parentBlock) {
							sawExistingParent = true;
						}
						if (!parentBlock) {
							logAIDebug(
								'MODIFY_BLOCK child op: parent block not found',
								JSON.stringify(parentId)
							);
							continue;
						}
						if (!editorSelect.canInsertBlockType(newBlock.name, parentId)) {
							logAIDebug(
								'MODIFY_BLOCK child op: cannot insert block type into parent',
								JSON.stringify(newBlock.name),
								JSON.stringify(parentId)
							);
							continue;
						}
						const wantsTop =
							op.insert_at === 'start' ||
							op.position === 'top' ||
							String(op.insert_at || '').toLowerCase() === 'top';
						const insertIndex = wantsTop
							? 0
							: parentBlock.innerBlocks?.length ?? 0;
						dispatch('core/block-editor').insertBlocks(
							newBlock,
							insertIndex,
							parentId,
							false
						);
						inserted += 1;
					}
					if (
						inserted === 0 &&
						firstIsButton &&
						scope === 'page' &&
						!sawExistingParent &&
						firstDesc
					) {
						const emptyColumns = collectBlocks(allBlocks, b =>
							typeof b.name === 'string' &&
							b.name.includes('column-maxi') &&
							(!b.innerBlocks || b.innerBlocks.length === 0)
						);
						for (const col of emptyColumns) {
							const nb = buildBlockTree(firstDesc);
							if (!nb) break;
							if (!editorSelect.canInsertBlockType(nb.name, col.clientId)) {
								continue;
							}
							dispatch('core/block-editor').insertBlocks(
								nb,
								col.innerBlocks?.length ?? 0,
								col.clientId,
								false
							);
							inserted += 1;
						}
						if (inserted > 0) {
							logAIDebug(
								'MODIFY_BLOCK: empty-column fallback applied',
								String(inserted)
							);
						}
					}
					return {
						executed: inserted > 0,
						message:
							inserted > 0
								? action.message || `Added ${inserted} block(s).`
								: __(
										'No blocks were inserted. Parent columns may be missing, or this block type cannot be added there.',
										'maxi-blocks'
								  ),
					};
				}

				// ORCHESTRATION LAYER: Determine target blocks based on scope
				let targetBlocks = [];
				let prefix = ''; // Prefix logic might need to be per-block if they differ, but usually consistent for buttons

				if (scope === 'selection') {
					if (selectedBlock) {
						targetBlocks = [selectedBlock];
						prefix = getBlockPrefix(selectedBlock.name);
					} else {
						return {
							executed: false,
							message: __('Please select a block first.', 'maxi-blocks'),
						};
					}
				} else if (scope === 'page') {
					// Recursive search for ALL buttons on the page
					targetBlocks = collectBlocks(allBlocks, (b) => b.name.includes('button'));
					
					if (targetBlocks.length === 0) {
						return {
							executed: false,
							message: __('There are no Maxi buttons on this page to update.', 'maxi-blocks'),
						};
					}
					// Note: prefix might vary if we supported mixed block types, but for "buttons" it's usually button-
					// We'll calculate prefix inside the loop for safety.
				}

				let changes = {};
				const allBulkUpdates = {}; // clientId -> attributes

				console.log('[Maxi AI Debug] MODIFY_BLOCK - Scope:', scope, 'Targets:', targetBlocks.length);

				// Helper to collect changes for a single block (REFACTORED to take block argument)
				const getChangesForBlock = (targetBlock, prop, val) => {
					let c = null;
					const blkPrefix = getBlockPrefix(targetBlock.name);
					
					// Detect removal commands
					const isRemoval = val === null || val === 'none' || val === 'remove' || val === 0 || val === '0' || val === 'square';
					
					switch (prop) {
						case 'padding':
						case 'padding_top':
						case 'padding_bottom':
						case 'padding_left':
						case 'padding_right':
						case 'position':
						case 'position_top':
						case 'position_right':
						case 'position_bottom':
						case 'position_left':
							c = buildContainerPGroupAttributeChanges(prop, val);
							break;
						case 'row_gap':
							c = buildContainerRGroupAttributeChanges(prop, val);
							break;
						case 'margin': c = updateMargin(val, null, prefix); break;
						case 'spacing_preset': c = createResponsiveSpacing(val, prefix); break;
						case 'background_color': {
							const backgroundPrefix = targetBlock?.name?.includes('number-counter') ? '' : blkPrefix;
							c = updateBackgroundColor(targetBlock.clientId, val, targetBlock.attributes, backgroundPrefix);
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
						case 'border_radius': 
							// Normalize square/0/removal
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
						case 'shadow':
						case 'box_shadow':
						case 'box-shadow':
							if (isRemoval) c = removeBoxShadow(blkPrefix);
							else if (typeof val === 'object') c = updateBoxShadow(val.x, val.y, val.blur, val.spread, val.color, blkPrefix);
							else c = { [`${blkPrefix}box-shadow-general`]: val, [`${blkPrefix}box-shadow-status-general`]: true };
							break;
						case 'icon_background':
						case 'icon_background_hover':
						case 'icon_border':
						case 'icon_border_hover':
						case 'icon_border_radius':
						case 'icon_border_radius_hover':
						case 'icon_padding':
						case 'icon_spacing':
						case 'icon_spacing_hover':
						case 'icon_width':
						case 'icon_width_hover':
						case 'icon_height':
						case 'icon_height_hover':
						case 'icon_size':
						case 'icon_size_hover':
						case 'icon_force_aspect_ratio':
						case 'icon_force_aspect_ratio_hover':
						case 'icon_fill_color':
						case 'icon_fill_color_hover':
						case 'icon_stroke_color':
						case 'icon_stroke_color_hover':
						case 'icon_stroke_width':
						case 'icon_stroke_width_hover':
						case 'icon_svg_type':
						case 'icon_svg_type_hover':
						case 'icon_content':
						case 'icon_content_hover':
						case 'icon_position':
						case 'icon_position_hover':
						case 'icon_only':
						case 'icon_only_hover':
						case 'icon_inherit':
						case 'icon_inherit_hover':
						case 'icon_status_hover':
						case 'icon_status_hover_target':
							if (targetBlock?.name?.includes('button')) {
								c = buildButtonIGroupAttributeChanges(prop, val);
							}
							break;
						case 'width':
							if (targetBlock.attributes && Object.prototype.hasOwnProperty.call(targetBlock.attributes, 'width-general')) {
								c = buildContainerWGroupAttributeChanges(prop, val, { prefix: blkPrefix }) || buildWidthChanges(val, blkPrefix);
							} else {
								c = buildWidthChanges(val, blkPrefix);
							}
							if (
								c &&
								targetBlock?.name?.includes('number-counter') &&
								blkPrefix === 'number-counter-'
							) {
								Object.keys(c).forEach(key => {
									const match = key.match(/^number-counter-width-(general|xxl|xl|l|m|s|xs)$/);
									if (!match) return;
									c[`number-counter-width-auto-${match[1]}`] = false;
								});
							}
							break;
						case 'height': c = buildHeightChanges(val, blkPrefix); break;
						case 'objectFit':
						case 'object_fit': c = updateImageFit(val); break;
						case 'opacity':
						case 'opacity_hover':
						case 'opacity_status_hover':
						case 'order':
						case 'overflow':
						case 'overflow_x':
						case 'overflow_y':
							c = buildContainerOGroupAttributeChanges(prop, val);
							break;
						case 'z_index':
							c = buildContainerZGroupAttributeChanges(prop, val);
							break;
						case 'transform_rotate':
						case 'transform_scale':
						case 'transform_scale_hover':
						case 'transform_translate':
						case 'transform_origin':
						case 'transform_target':
						case 'transition':
						case 'transition_change_all':
						case 'transition_canvas_selected':
						case 'transition_transform_selected':
							c = buildContainerTGroupAttributeChanges(prop, val, {
								attributes: targetBlock.attributes,
							});
							break;
						// Typography properties
						case 'text_color':
						case 'text_color_hover':
						case 'button_hover_text':
						case 'color':
							if (targetBlock?.name?.includes('button')) {
								c = buildButtonCGroupAttributeChanges(prop, val, {
									attributes: targetBlock.attributes,
								});
							} else if (
								targetBlock?.name?.includes('text-maxi') ||
								targetBlock?.name?.includes('list-item-maxi')
							) {
								c = buildTextCGroupAttributeChanges(prop, val);
							} else {
								c = updateTextColor(val, blkPrefix);
							}
							break;
						case 'link_color':
						case 'link_color_hover':
						case 'link_color_active':
						case 'link_color_visited':
						case 'link_palette_color':
						case 'link_palette_color_hover':
						case 'link_palette_color_active':
						case 'link_palette_color_visited':
						case 'link_palette_opacity':
						case 'link_palette_opacity_hover':
						case 'link_palette_opacity_active':
						case 'link_palette_opacity_visited':
						case 'link_palette_status':
						case 'link_palette_status_hover':
						case 'link_palette_status_active':
						case 'link_palette_status_visited':
						case 'link_palette_sc_status':
						case 'link_palette_sc_status_hover':
						case 'link_palette_sc_status_active':
						case 'link_palette_sc_status_visited':
							if (
								targetBlock?.name?.includes('text-maxi') ||
								targetBlock?.name?.includes('list-item-maxi')
							) {
								c = buildTextLGroupAttributeChanges(prop, val);
							}
							break;
						case 'font_size':
						case 'fontSize':
							c = updateFontSize(val);
							break;
						case 'font_weight':
						case 'fontWeight':
							c = updateFontWeight(val);
							break;
						// ======= BLOCK ACTIONS (Delegated) =======
						default:
							if (
								prop &&
								(String(prop).startsWith('scroll_') ||
									String(prop).startsWith('shape_divider_') ||
									[
										'shortcut_effect',
										'shortcut_effect_type',
										'show_warning_box',
										'size_advanced_options',
									].includes(prop))
							) {
								c = buildContainerSGroupAttributeChanges(prop, val);
								if (c) break;
							}
							// Pass current conversation data if this flow matches the active conversation
							// Check payload for explicit data override (from handleSuggestion loop)
							const payloadData = action.payload?._conversationData;
							
							const currentData = payloadData || ((conversationContext && conversationContext.flow === prop) 
								? conversationContext.data 
								: {});
							
							// Add mode to context (Standardized)
							const updateContext = { ...currentData, mode: scope };

							// Call handler for THIS SPECIFIC BLOCK
							const blockHandler = getAiHandlerForBlock(targetBlock);
							const result = blockHandler
								? blockHandler(targetBlock, prop, val, blkPrefix, updateContext)
								: null;
							let handlerChanges = null;

							if (result) {
								if (result.action === 'apply') {
									handlerChanges = result.attributes;
									if (result.done) {
                                        // Mark flow as finishing, but we might have other blocks.
                                        // Wait, if one block says done, are they all done? Usually yes for same flow.
                                        // We'll set a flag to clear context later.
                                        conversationStep = { executed: true, done: true }; 
                                    }
								} else if (result.action) {
									// Interaction Request (Step in Flow)
									console.log('[Maxi AI Conversation] Interaction Request from block:', targetBlock.clientId, result);
									return { 
										_isConversationStep: true, 
										...result,
										flow: prop
									};
								} else {
                                    // Legacy/Simple return (just changes)
                                    handlerChanges = result;
                                }
							}
							
							if (handlerChanges) c = handlerChanges;
							break;
					}
					
					// If we got a conversation step trigger, pass it up instantly
					if (c && c._isConversationStep) return c;
					
					// If we got a bulk update result (executed: true), pass it up
					if (c && c.executed) return c;

					return c;
				};

				// 1. Handle Special Actions
				if (action.payload?.special_action === 'APPLY_HOVER_ANIMATION') {
					const hoverChanges = applyHoverAnimation(selectedBlock.attributes, action.payload.shadow_value);
					if (Object.keys(hoverChanges).length > 0) {
						updateBlockAttributes(selectedBlock.clientId, hoverChanges);
					}
					return { executed: true, message: action.message || 'Applied hover animation.' };
				}

				// 2. Handle Payload (Object with multiple updates)
				if (action.payload) {
					const p = action.payload;
					let hasUpdates = false;
					let conversationStep = null;

					// LOOP 1: Properties
					for (const [prop, val] of Object.entries(p)) {
						
						// LOOP 2: Target Blocks
						for (const block of targetBlocks) {
							// Special handling for spacing object
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
								
								// Check for Conversation Step
								if (res && res._isConversationStep) {
									conversationStep = res;
									break; // Stop processing blocks, return to user
								}

								console.log('[Maxi AI Debug] getChangesForBlock result:', block.clientId, prop, val, '->', res);
								if (res) {
									if (!allBulkUpdates[block.clientId]) allBulkUpdates[block.clientId] = {};
									Object.assign(allBulkUpdates[block.clientId], res);
									hasUpdates = true;
								}
							}
						}
						
						if (conversationStep) break; // Stop processing properties
					}

					// Handle Conversation Step Return
					if (conversationStep) {
						const c = conversationStep;
						console.log('[Maxi AI Conversation] Setting Context:', c);
						setConversationContext({
							flow: c.flow,
							pendingTarget: c.target,
							data: conversationContext?.data || {},
							currentOptions: c.options || []
						});
						
						let displayOptions = c.options;
						if (Array.isArray(c.options) && typeof c.options[0] === 'object') {
							displayOptions = c.options.map(o => o.label);
						}

						return {
							executed: false,
							message: c.msg,
							options: displayOptions || (c.action === 'ask_palette' ? ['palette'] : []),
							optionsType: c.action === 'ask_palette' ? 'palette' : 'text'
						};
					}

                    // Check for Completion
                    if (conversationStep && conversationStep.done) {
                         // Flow completed successfully
						setConversationContext(null); // CLEAR STATE
                    }

					// If we reached here, the flow is either finished or not active
					if (conversationContext && !conversationStep) {
                        // Inherit old behavior: if no explicit step returned, maybe we are done?
                        // But we want explicit control now.
                        // For now we keep this as fallback clearing if nothing returned.
						setConversationContext(null);
					}

					console.log('[Maxi AI Debug] Final Bulk Updates:', Object.keys(allBulkUpdates).length, 'blocks');
					
					if (Object.keys(allBulkUpdates).length > 0) {
						// Batch Update
						Object.entries(allBulkUpdates).forEach(([clientId, attrs]) => {
							dispatch('core/block-editor').updateBlockAttributes(clientId, attrs);
						});
						console.log('[Maxi AI Debug] dispatch updateBlockAttributes called for all blocks');
						return { executed: true, message: scope === 'page' ? 'Updated all buttons on page.' : 'Updated selection.' };
					} else {
						return { executed: true, message: 'No changes needed.' };
					}
				}

				// 3. Handle Direct Property/Value
				if (action.property && action.value !== undefined) {
					const c = getChangesForSelection(action.property, action.value);
					
					// Check for Conversation Step (Direct Property)
					if (c && c._isConversationStep) {
						console.log('[Maxi AI Conversation] Setting Context (Direct):', c);
						setConversationContext({
							flow: c.flow,
							pendingTarget: c.target,
							data: conversationContext?.data || {},
							currentOptions: c.options || []
						});
						
						let displayOptions = c.options;
						if (Array.isArray(c.options) && typeof c.options[0] === 'object') {
							displayOptions = c.options.map(o => o.label);
						}

						return {
							executed: false,
							message: c.msg,
							options: displayOptions || (c.action === 'ask_palette' ? ['palette'] : []),
							optionsType: c.action === 'ask_palette' ? 'palette' : 'text'
						};
					}

                    // Check for Bulk/Direct Execution
                    if (c && c.executed) {
                        return c;
                    }

					if (c) {
						dispatch('core/block-editor').updateBlockAttributes(selectedBlock.clientId, c);
						if (conversationContext) setConversationContext(null); // Cleanup
					}
				}

				// 4. Trigger Sidebar Expand based on properties (Enhanced Selection Feedback)
				const targetProp = action.property || (action.payload ? Object.keys(action.payload)[0] : null);
				if (action.payload?.spacing_preset) {
					openSidebarForProperty('responsive_padding');
				} else if (action.payload?.shadow) {
					openSidebarForProperty('box_shadow');
				} else if (action.payload?.border) {
					openSidebarForProperty('border');
				} else {
					openSidebarForProperty(targetProp);
				}

				if (action.ui_target) {
					console.log('[Maxi AI] UI Target requested:', action.ui_target);
					// Map new IDs to existing sidebar logic
					// spacing-panel, dimension-panel, border-panel, shadow-panel, style-card-colors, style-card-typography
					
					const uiMap = {
						'spacing-panel': { panel: 'Margin / Padding', tab: 'Settings' },
						'dimension-panel': { panel: 'Dimension', tab: 'Settings' },
						'border-panel': { panel: 'Border', tab: 'Settings' },
						'shadow-panel': { panel: 'Box shadow', tab: 'Settings' },
						'shadow-panel-hover': { panel: 'Box shadow', tab: 'Settings', state: 'hover' }, // Logic hint
					};
					
					const mapping = uiMap[action.ui_target];
					if (mapping) {
						// Trigger sidebar open logic (reusing existing code or refactoring)
						// We can attach this metadata to the return and handle it in the main flow
						// Or verify if we can set "state" (hover/normal) programmatically?
						action.sidebarMapping = mapping; 
					}
				}

				if (action.payload || action.property) {
					// Handle UI Target trigger
					if (action.sidebarMapping) {
						const { panel, tab } = action.sidebarMapping;
						// Reuse the sidebar opening logic from previous implementation
						setTimeout(() => {
							const tabButtons = document.querySelectorAll('.maxi-tabs-control__button');
							for (const tabBtn of tabButtons) {
								if (tabBtn.textContent.trim().toLowerCase() === tab.toLowerCase()) {
									tabBtn.click();
									break;
								}
							}
							setTimeout(() => {
								const selectors = ['.maxi-accordion-control__item__button', '.maxi-accordion-control button', '[class*="accordion"] button', '.maxi-accordion-tab__item__button'];
								const labelParts = panel.split(/\s*\/\s*|\s+/).filter(p => p.length > 2);
								for (const selector of selectors) {
									const buttons = document.querySelectorAll(selector);
									for (const button of buttons) {
										const text = button.textContent.trim();
										if (labelParts.some(part => text.toLowerCase().includes(part.toLowerCase()))) {
											button.click();
											return;
										}
									}
								}
							}, 200);
						}, 300);
					}
					
					return { executed: true, message: action.message || 'Updated.' };
				}
				
				return { executed: true, message: action.message || 'No changes needed.' };
			} // End MODIFY_BLOCK


			// --- GLOBAL ACTIONS RESTORED ---
			// Handle both "update_page" and "UPDATE_PAGE" (case insensitive)
			const actionType = action.action?.toLowerCase();
			
			if (action.action === 'switch_viewport') {
				const device = action.value || 'Mobile';
				// Use WordPress data dispatch to switch viewport
				const { dispatch } = require('@wordpress/data');
				// Try both common stores for viewport switching
				try {
					dispatch('core/edit-post').__experimentalSetPreviewDeviceType(device);
				} catch (e) {
					try {
						dispatch('core/editor').setDeviceType(device);
					} catch (e2) {
						console.warn('Could not switch viewport', e2);
					}
				}
				return { executed: true, message: action.message || `Switched to ${device} view.` };
			}

			if (action.action === 'update_page') {
				let property = action.property;
				let value = action.value;
				let targetBlock = action.target_block;
				let actionMessage = action.message;
				
				// Handle AI returning payload wrapper (legacy fix)
				if (action.payload) {
					if (action.payload.shadow) {
						property = 'box_shadow';
						value = action.payload.shadow;
					} else if (action.payload.border_radius !== undefined) {
						property = 'border_radius';
						value = action.payload.border_radius;
					} else if (action.payload.padding !== undefined) {
						property = 'padding';
						value = action.payload.padding;
					}
				}

				if (property) {
					const normalized = normalizeActionProperty(property, value);
					logAIDebug('update_selection normalization', {
						original: { property, value },
						normalized,
						target: targetBlock,
						selectedBlock: selectedBlock?.name,
					});
					property = normalized.property;
					value = normalized.value;
				}

				if (property === 'padding' && targetBlock === 'button') {
					property = 'button_padding';
				}

				if (
					property === 'relations' ||
					property === 'relations_ops' ||
					property === 'is_first_on_hierarchy'
				) {
					return {
						executed: false,
						message: __(
							'Interaction Builder updates are only supported in Selection scope. Switch scope to Selection and try again.',
							'maxi-blocks'
						),
					};
				}

				const iconResolution = await resolveButtonIconFromTypesense({
					property,
					value,
					targetBlock,
				});

				if (iconResolution?.error) {
					return { executed: false, message: iconResolution.error };
				}

				if (iconResolution?.property) {
					property = iconResolution.property;
					value = iconResolution.value;
					targetBlock = iconResolution.targetBlock || targetBlock;
					if (iconResolution.message) {
						actionMessage = iconResolution.message;
					}
				}
				
				console.log('[Maxi AI Debug] update_page action received:', property, value, 'target:', targetBlock);
				
				// Normalize border_radius values - AI sometimes sends wrong numbers
				if (property === 'border_radius') {
					// Parse numeric value or map keyword
					if (typeof value === 'string') {
						const lowerValue = value.toLowerCase();
						if (lowerValue.includes('subtle') || lowerValue === '8px') value = 8;
						else if (lowerValue.includes('soft') || lowerValue === '24px') value = 24;
						else if (lowerValue.includes('full') || lowerValue === '50px') value = 50;
						else if (lowerValue.includes('square') || lowerValue === '0px' || lowerValue === '0') value = 0;
						else {
							const parsed = parseInt(value);
							value = isNaN(parsed) ? 8 : parsed;
						}
					} else if (typeof value === 'number') {
						// value is already a number, leave as is
					} else {
						value = 8; // Default if unknown type
					}
					console.log('[Maxi AI Debug] Normalized border_radius to:', value);
				}
				
				const resultMsg = handleUpdatePage(property, value, targetBlock);
				console.log('[Maxi AI Debug] handleUpdatePage returned:', resultMsg);

				// EXPAND SIDEBAR based on property
				// This ensures "settings are showing" as requested by user
				openSidebarForProperty(property);

				return { executed: true, message: actionMessage || resultMsg };
			}

			if (action.action === 'apply_responsive_spacing') {
				const resultMsg = handleUpdatePage('apply_responsive_spacing', action.preset, action.target_block);
				
				// Ensure dimension panel is open for feedback
				openSidebarAccordion(0, 'dimension-panel');

				return { executed: true, message: action.message || resultMsg };
			}

			if (action.action === 'update_style_card') {
				const resultMsg = handleUpdateStyleCard(action.updates);
				return { executed: true, message: resultMsg };
			}

			if (action.action === 'apply_theme') {
				console.log('[Maxi AI Debug] handleApplyTheme called with:', action.prompt);
				const resultMsg = handleApplyTheme(action.theme, action.prompt);
				return { executed: true, message: resultMsg, openedStyleCard: true };
			}

			if (action.action === 'update_selection') {
				let property = action.property;
				let value = action.value;
				let targetBlock = action.target_block;
				let actionMessage = action.message;
				
				// Handle same payload wrapper if needed
				if (action.payload) {
					if (action.payload.shadow) { property = 'box_shadow'; value = action.payload.shadow; }
					else if (action.payload.border_radius !== undefined) { property = 'border_radius'; value = action.payload.border_radius; }
					else if (action.payload.padding !== undefined) { property = 'padding'; value = action.payload.padding; }
				}
				
				if (property) {
					const normalized = normalizeActionProperty(property, value);
					logAIDebug('update_page normalization', {
						original: { property, value },
						normalized,
						target: targetBlock,
						selectedBlock: selectedBlock?.name,
					});
					property = normalized.property;
					value = normalized.value;
				}

				if (
					property === 'padding' &&
					(targetBlock === 'button' ||
						selectedBlock?.name?.includes('button'))
				) {
					property = 'button_padding';
				}

				const iconResolution = await resolveButtonIconFromTypesense({
					property,
					value,
					targetBlock,
				});

				if (iconResolution?.error) {
					return { executed: false, message: iconResolution.error };
				}

				if (iconResolution?.property) {
					property = iconResolution.property;
					value = iconResolution.value;
					targetBlock = iconResolution.targetBlock || targetBlock;
					if (iconResolution.message) {
						actionMessage = iconResolution.message;
					}
				}
				
				// Normalizations
				if (property === 'border_radius' && typeof value === 'string') {
					if (value.includes('subtle') || value === '8px') value = 8;
					else if (value.includes('soft') || value === '24px') value = 24;
					else if (value.includes('full') || value === '50px') value = 50;
					else if (value.includes('square') || value === '0px') value = 0;
					else value = parseInt(value) || 8;
				}

				const isLinkProperty =
					property === 'link_settings' ||
					String(property || '').startsWith('dc_link');
				const resultMsg = handleUpdateSelection(
					property,
					value,
					isLinkProperty ? null : targetBlock
				);
				console.log('[Maxi AI Debug] handleUpdateSelection result:', resultMsg);

				// EXPAND SIDEBAR
				openSidebarForProperty(property);

				// Combine AI message with technical result if mismatch
				// If resultMsg says "No matching components", we should probably show that.
				let finalMessage = actionMessage || resultMsg;
				if (typeof resultMsg === 'string' && resultMsg.includes('No matching')) {
					finalMessage = `${actionMessage || 'No changes applied'} (${resultMsg})`;
				}

				return { executed: true, message: finalMessage };
			}

			if (action.action === 'message') {
				return { executed: false, message: action.content, options: action.options };
			}

			// ... (rest of standard legacy handling if needed, or rely on prompt to strictly use new types)
			// Given the strict prompt, we might not need the old switch(action.action) block if the AI complies.
			// But sticking to the new schema is key.

			return {
				executed: true,
				message: action.message || 'Done.',
			};

		} catch (e) {
			console.error('Parse error:', e);
			return { executed: false, message: __('Error parsing AI response.', 'maxi-blocks') };
		}

	};

	const openSidebarForProperty = rawProperty => {
		if (!rawProperty) return;

		const property = String(rawProperty).replace(/-/g, '_');
		const normalizedProperty = property.replace(
			/_(general|xxl|xl|l|m|s|xs)$/,
			''
		);
		let selectedBlockName = selectedBlock?.name;
		try {
			const storeSelectedBlock = select('core/block-editor')?.getSelectedBlock?.();
			if (storeSelectedBlock?.name) selectedBlockName = storeSelectedBlock.name;
		} catch {}

		// Flow patterns (e.g. flow_border) are internal intents; map them to real panels.
		if (normalizedProperty.startsWith('flow_')) {
			switch (normalizedProperty) {
				case 'flow_outline':
				case 'flow_border':
					openSidebarForProperty('border');
					return;
				case 'flow_shadow':
					openSidebarForProperty('box_shadow');
					return;
				case 'flow_text_align':
					openSidebarAccordion(0, 'typography');
					return;
				default:
			}
		}

		const isTextBlock =
			selectedBlockName?.includes('text-maxi') ||
			selectedBlockName?.includes('list-item-maxi');

		const dcTarget = getDcGroupSidebarTarget(
			normalizedProperty,
			selectedBlockName
		);
		if (dcTarget) {
			openSidebarAccordion(dcTarget.tabIndex, dcTarget.accordion);
			return;
		}

		const isAccordionBlock = selectedBlockName?.includes('accordion');
		if (isAccordionBlock) {
			const accordionTarget = getAccordionSidebarTarget(normalizedProperty);
			if (accordionTarget) {
				openSidebarAccordion(accordionTarget.tabIndex, accordionTarget.accordion);
				return;
			}
		}

		const isColumnBlock = selectedBlockName?.includes('column');
		if (isColumnBlock) {
			const columnTarget = getColumnSidebarTarget(normalizedProperty);
			if (columnTarget) {
				openSidebarAccordion(columnTarget.tabIndex, columnTarget.accordion);
				return;
			}
		}

		const isDividerBlock = selectedBlockName?.includes('divider');
		if (isDividerBlock) {
			const dividerTarget = getDividerSidebarTarget(normalizedProperty);
			if (dividerTarget) {
				openSidebarAccordion(dividerTarget.tabIndex, dividerTarget.accordion);
				return;
			}
		}

		const isImageBlock = selectedBlockName?.includes('image');
		if (isImageBlock) {
			const imageTarget = getImageSidebarTarget(normalizedProperty);
			if (imageTarget) {
				openSidebarAccordion(imageTarget.tabIndex, imageTarget.accordion);
				return;
			}
		}

		const isIconBlock =
			selectedBlockName?.includes('svg-icon') ||
			selectedBlockName?.includes('icon-maxi');
		if (isIconBlock) {
			const iconTarget = getIconSidebarTarget(normalizedProperty);
			if (iconTarget) {
				openSidebarAccordion(iconTarget.tabIndex, iconTarget.accordion);
				return;
			}
		}

		const isNumberCounterBlock = selectedBlockName?.includes('number-counter');
		if (isNumberCounterBlock) {
			const counterTarget = getNumberCounterSidebarTarget(normalizedProperty);
			if (counterTarget) {
				openSidebarAccordion(counterTarget.tabIndex, counterTarget.accordion);
				return;
			}
		}

		const isButtonBlock = selectedBlockName?.includes('button');
		if (isButtonBlock) {
			const buttonTarget = getButtonAGroupSidebarTarget(normalizedProperty);
			if (buttonTarget) {
				openSidebarAccordion(buttonTarget.tabIndex, buttonTarget.accordion);
				return;
			}
			const buttonBTarget = getButtonBGroupSidebarTarget(normalizedProperty);
			if (buttonBTarget) {
				openSidebarAccordion(buttonBTarget.tabIndex, buttonBTarget.accordion);
				return;
			}
			const buttonCTarget = getButtonCGroupSidebarTarget(normalizedProperty);
			if (buttonCTarget) {
				openSidebarAccordion(buttonCTarget.tabIndex, buttonCTarget.accordion);
				return;
			}
			const buttonITarget = getButtonIGroupSidebarTarget(normalizedProperty);
			if (buttonITarget) {
				openSidebarAccordion(buttonITarget.tabIndex, buttonITarget.accordion);
				return;
			}
		}

		if (isTextBlock) {
			const textListTarget = getTextListGroupSidebarTarget(normalizedProperty);
			if (textListTarget) {
				openSidebarAccordion(textListTarget.tabIndex, textListTarget.accordion);
				return;
			}

			const textLTarget = getTextLGroupSidebarTarget(normalizedProperty);
			if (textLTarget) {
				openSidebarAccordion(textLTarget.tabIndex, textLTarget.accordion);
				return;
			}

			const textCTarget = getTextCGroupSidebarTarget(normalizedProperty);
			if (textCTarget) {
				openSidebarAccordion(textCTarget.tabIndex, textCTarget.accordion);
				return;
			}

			const textPTarget = getTextPGroupSidebarTarget(normalizedProperty);
			if (textPTarget) {
				openSidebarAccordion(textPTarget.tabIndex, textPTarget.accordion);
				return;
			}

			const textTypographyTarget = getTextTypographySidebarTarget(normalizedProperty);
			if (textTypographyTarget) {
				openSidebarAccordion(
					textTypographyTarget.tabIndex,
					textTypographyTarget.accordion
				);
				return;
			}
		}

		const aGroupTarget = getContainerAGroupSidebarTarget(normalizedProperty);
		if (aGroupTarget) {
			openSidebarAccordion(aGroupTarget.tabIndex, aGroupTarget.accordion);
			return;
		}

		const bGroupTarget = getContainerBGroupSidebarTarget(normalizedProperty);
		if (bGroupTarget) {
			openSidebarAccordion(bGroupTarget.tabIndex, bGroupTarget.accordion);
			return;
		}

		const cGroupTarget = getContainerCGroupSidebarTarget(normalizedProperty);
		if (cGroupTarget) {
			openSidebarAccordion(cGroupTarget.tabIndex, cGroupTarget.accordion);
			return;
		}

		const dGroupTarget = getContainerDGroupSidebarTarget(normalizedProperty);
		if (dGroupTarget) {
			openSidebarAccordion(dGroupTarget.tabIndex, dGroupTarget.accordion);
			return;
		}

		const eGroupTarget = getContainerEGroupSidebarTarget(normalizedProperty);
		if (eGroupTarget) {
			openSidebarAccordion(eGroupTarget.tabIndex, eGroupTarget.accordion);
			return;
		}

		const fGroupTarget = getContainerFGroupSidebarTarget(normalizedProperty);
		if (fGroupTarget) {
			openSidebarAccordion(fGroupTarget.tabIndex, fGroupTarget.accordion);
			return;
		}

		const hGroupTarget = getContainerHGroupSidebarTarget(normalizedProperty);
		if (hGroupTarget) {
			openSidebarAccordion(hGroupTarget.tabIndex, hGroupTarget.accordion);
			return;
		}

		const lGroupTarget = getContainerLGroupSidebarTarget(normalizedProperty);
		if (lGroupTarget) {
			openSidebarAccordion(lGroupTarget.tabIndex, lGroupTarget.accordion);
			return;
		}

		const mGroupTarget = getContainerMGroupSidebarTarget(normalizedProperty);
		if (mGroupTarget) {
			openSidebarAccordion(mGroupTarget.tabIndex, mGroupTarget.accordion);
			return;
		}

		const wGroupTarget = getContainerWGroupSidebarTarget(normalizedProperty);
		if (wGroupTarget) {
			openSidebarAccordion(wGroupTarget.tabIndex, wGroupTarget.accordion);
			return;
		}

		const pGroupTarget = getContainerPGroupSidebarTarget(normalizedProperty);
		if (pGroupTarget) {
			openSidebarAccordion(pGroupTarget.tabIndex, pGroupTarget.accordion);
			return;
		}

		const rGroupTarget = getContainerRGroupSidebarTarget(normalizedProperty);
		if (rGroupTarget) {
			openSidebarAccordion(rGroupTarget.tabIndex, rGroupTarget.accordion);
			return;
		}

		const sGroupTarget = getContainerSGroupSidebarTarget(normalizedProperty);
		if (sGroupTarget) {
			openSidebarAccordion(sGroupTarget.tabIndex, sGroupTarget.accordion);
			return;
		}

		const tGroupTarget = getContainerTGroupSidebarTarget(normalizedProperty);
		if (tGroupTarget) {
			openSidebarAccordion(tGroupTarget.tabIndex, tGroupTarget.accordion);
			return;
		}

		const oGroupTarget = getContainerOGroupSidebarTarget(normalizedProperty);
		if (oGroupTarget) {
			openSidebarAccordion(oGroupTarget.tabIndex, oGroupTarget.accordion);
			return;
		}

		const zGroupTarget = getContainerZGroupSidebarTarget(normalizedProperty);
		if (zGroupTarget) {
			openSidebarAccordion(zGroupTarget.tabIndex, zGroupTarget.accordion);
			return;
		}

		switch (normalizedProperty) {
			case 'responsive_padding':
			case 'padding':
			case 'margin':
				openSidebarAccordion(0, 'margin / padding');
				return;
			case 'size':
			case 'width':
			case 'height':
			case 'min_width':
			case 'max_width':
			case 'min_height':
			case 'max_height':
			case 'full_width':
			case 'width_fit_content':
			case 'height_fit_content':
				openSidebarAccordion(0, 'height / width');
				return;
			case 'background_color':
			case 'background_palette_color':
			case 'background_palette_status':
			case 'background_palette_opacity':
			case 'background':
			case 'background_layers':
			case 'background_layers_hover':
			case 'block_background_status_hover':
				openSidebarAccordion(0, 'background / layer');
				return;
			case 'border':
			case 'border_radius':
			case 'border_hover':
				openSidebarAccordion(0, 'border');
				return;
			case 'box_shadow':
			case 'box_shadow_hover':
			case 'hover_glow':
				openSidebarAccordion(0, 'box shadow');
				return;
			case 'shape_divider':
			case 'shape_divider_top':
			case 'shape_divider_bottom':
			case 'shape_divider_both':
			case 'shape_divider_color':
			case 'shape_divider_color_top':
			case 'shape_divider_color_bottom':
				openSidebarAccordion(0, 'shape divider');
				return;
			case 'context_loop':
				openSidebarAccordion(0, 'context loop');
				return;
			case 'arrow_status':
			case 'arrow_side':
			case 'arrow_position':
			case 'arrow_width':
				openSidebarAccordion(0, 'callout arrow');
				return;
			case 'anchor_link':
			case 'unique_id':
			case 'aria_label': {
				const sidebarTarget = getMetaSidebarTarget(property);
				if (sidebarTarget) {
					openSidebarAccordion(sidebarTarget.tabIndex, sidebarTarget.accordion);
				}
				return;
			}
			case 'custom_css':
				openSidebarAccordion(1, 'custom css');
				return;
			case 'advanced_css': {
				const sidebarTarget = getAdvancedCssSidebarTarget(
					'advanced_css',
					selectedBlockName
				);
				if (sidebarTarget) {
					openSidebarAccordion(sidebarTarget.tabIndex, sidebarTarget.accordion);
				}
				return;
			}
			case 'scroll_fade':
				openSidebarAccordion(1, 'scroll effects');
				return;
			case 'transform':
			case 'transform_scale_hover':
			case 'hover_effect':
			case 'hover_lift':
				openSidebarAccordion(1, 'transform');
				return;
			case 'transition':
				openSidebarAccordion(1, 'hover transition');
				return;
			case 'display':
			case 'display_mobile':
			case 'display_tablet':
			case 'display_desktop':
			case 'show_mobile_only':
				openSidebarAccordion(1, 'show/hide block');
				return;
			case 'opacity':
			case 'opacity_hover':
			case 'opacity_status_hover':
			case 'hover_darken':
			case 'hover_lighten':
				openSidebarAccordion(1, 'opacity');
				return;
			case 'position':
			case 'position_top':
			case 'position_right':
			case 'position_bottom':
			case 'position_left':
				openSidebarAccordion(1, 'position');
				return;
			case 'overflow':
				openSidebarAccordion(1, 'overflow');
				return;
			case 'z_index':
				openSidebarAccordion(1, 'z-index');
				return;
			case 'align_items':
			case 'align_items_flex':
			case 'align_content':
			case 'justify_content':
			case 'flex_direction':
			case 'flex_wrap':
			case 'gap':
			case 'row_gap':
			case 'column_gap':
				openSidebarAccordion(1, 'flexbox');
				return;
			default:
		}
	};

	// ─────────────────────────────────────────────────────────────────────────

	/**
	 * Opens Cloud modal and drives the real UI (DOM): insert block, type in InstantSearch, optional filters.
	 *
	 * @param {string} rawMsg User message.
	 * @returns {Promise<void>}
	 */
	const runCloudLibraryIntent = async rawMsg => {
		const query = extractCloudSearchQuery( rawMsg );
		const minLen = 2;
		const hint = query.length >= minLen ? query : '';
		const ops = [ { op: 'ensure_open' } ];
		if ( hint ) {
			// Pages live under InstantSearch "Pages"; default tab is Patterns. Prefer Pages when the user
			// asked for a page but not explicitly for a pattern.
			const rawLower = String( rawMsg || '' ).toLowerCase();
			const usePagesTab =
				/\b(pages?)\b/.test( rawLower ) &&
				! /\b(patterns?)\b/.test( rawLower );
			// Sidebar refinement: Light / Dark (word-boundary avoids "highlight" etc.).
			const lightDarkValue = /\b(dark)\b/i.test( rawLower )
				? 'dark'
				: /\b(light)\b/i.test( rawLower )
					? 'light'
					: null;
			ops.push( { op: 'wait_ms', ms: 400 } );
			if ( usePagesTab ) {
				ops.push( { op: 'gutenberg_type', value: 'Pages' } );
				ops.push( { op: 'wait_ms', ms: 500 } );
			}
			if ( lightDarkValue ) {
				ops.push( { op: 'light_dark', value: lightDarkValue } );
				ops.push( { op: 'wait_ms', ms: 350 } );
			}
			ops.push( { op: 'set_search', text: hint } );
			// InstantSearch + Masonry need time; too short a wait clicks stale or empty hits.
			ops.push( { op: 'wait_ms', ms: 1200 } );
			ops.push( { op: 'click_first_insert' } );
		}
		const result = await executeCloudModalUiOps( ops, {
			insertCloudBlock: insertMaxiCloudLibraryBlock,
			logDebug: msg => logAIDebug( String( msg ) ),
		} );
		setMessages( prev => [
			...prev,
			{
				role: 'assistant',
				content: result.ok
					? hint
						? sprintf(
								/* translators: %s: search keywords used in Cloud Library */
								__(
									'Opened the Cloud Library, searched for "%s", and inserted the first visible result.',
									'maxi-blocks'
								),
								hint
						  )
						: __(
								'Opened the Cloud Library — use the modal search and filters, then insert a design.',
								'maxi-blocks'
						  )
					: result.message ||
					  __(
							'Could not open or control the Cloud Library. Use the Cloud toolbar button.',
							'maxi-blocks'
					  ),
				executed: result.ok,
			},
		] );
	};

	/**
	 * @param {string} [overriddenRawMessage] When set (e.g. option chip), send this text instead of input state.
	 */
	const sendMessage = async overriddenRawMessage => {
		const sourceText =
			typeof overriddenRawMessage === 'string'
				? overriddenRawMessage
				: input;
		const rawMessage = String(sourceText || '').trim();
		if (!rawMessage) return;

		setScopeChosen(true);

		// Guard: ensure the configured API key is present before sending
		const aiSettings = window.maxiSettings?.ai_settings ?? {};
		const useShared = aiSettings.ai_panel_use_shared !== false;
		const hasKey = useShared
			? !!aiSettings.has_openai_api_key
			: !!aiSettings.has_ai_panel_key;

		if (!hasKey) {
			setMessages(prev => [
				...prev,
				{ role: 'user', content: rawMessage },
				{
					role: 'assistant',
					content: __('Please configure your AI API key in the Maxi AI dashboard settings before using the chat panel.', 'maxi-blocks'),
					isError: true,
				},
			]);
			setInput('');
			return;
		}

		const userMessage = { role: 'user', content: rawMessage };
		setMessages(prev => [...prev, userMessage]);
		setInput('');

		// === FLOW STATE MACHINE BYPASS ===
		// If we are in an active flow, do NOT run standard pattern matching.
		// Instead, assume the user's input is the answer to the previous question and route it back to MODIFY_BLOCK.
		if (conversationContext && conversationContext.flow) {
			if (scope === 'global') {
				setConversationContext(null);
			} else {
				console.log('[Maxi AI Conversation] Active flow detected:', conversationContext.flow);
			
				// FSM Strict Mode: Ignore natural language during flow, require selection
				// UNLESS it's a valid option text that matches our current options?
				// The user requirement says "Pause NLU". 
				// But if they type "Soft", we should probably accept it if it matches an option.
				
				const options = conversationContext.currentOptions;
				const hasOptions = Array.isArray(options) && options.length > 0;
				const isOptionMatch = hasOptions && options.some(o =>
					(typeof o === 'string' ? o.toLowerCase() : o.label.toLowerCase()) === rawMessage.toLowerCase()
				);

				if (isOptionMatch || !hasOptions) {
					// Let handleSuggestion handle it via the standard flow re-entry
					handleSuggestion(rawMessage);
					return;
				}

				setMessages(prev => [...prev, { 
					role: 'assistant', 
					content: "Please select an option or colour to continue.", 
					executed: false 
				}]);
				setIsLoading(false);
				return;
			}
		}

		// Handle insert_block layout-picker reply (typed input path)
		if ( conversationContext?.type === 'insert_block' ) {
			const lower = rawMessage.toLowerCase();
			setConversationContext( null );
			let rootBlock;
			if ( lower.includes( 'cloud' ) || lower.includes( 'library' ) || lower.includes( 'browse' ) ) {
				await runCloudLibraryIntent( rawMessage );
				setIsLoading( false );
				return;
			} else if ( lower.includes( 'sidebar' ) ) {
				const row = createBlock( 'maxi-blocks/row-maxi' );
				rootBlock = createBlock( 'maxi-blocks/container-maxi', {}, [ row ] );
				dispatch( 'core/block-editor' ).insertBlocks( rootBlock );
				loadColumnsTemplate( '1-3', row.clientId, 'general', 2 );
			} else if ( lower.includes( 'hero' ) || lower.includes( 'full-width' ) || lower.includes( 'full width' ) ) {
				rootBlock = createBlock( 'maxi-blocks/container-maxi', { 'full-width-general': true } );
				dispatch( 'core/block-editor' ).insertBlocks( rootBlock );
			} else {
				const colMatch = lower.match( /(\d+)/ );
				const numCols = colMatch ? Math.min( parseInt( colMatch[ 1 ] ), 6 ) : 1;
				if ( numCols > 1 ) {
					const templateName = getTemplates( true, 'general', numCols ).find( t => ! t.isMoreThanEightColumns )?.name || `${ numCols } columns`;
					const row = createBlock( 'maxi-blocks/row-maxi' );
					rootBlock = createBlock( 'maxi-blocks/container-maxi', {}, [ row ] );
					dispatch( 'core/block-editor' ).insertBlocks( rootBlock );
					loadColumnsTemplate( templateName, row.clientId, 'general', numCols );
				} else {
					rootBlock = createBlock( 'maxi-blocks/container-maxi' );
					dispatch( 'core/block-editor' ).insertBlocks( rootBlock );
				}
			}
			setMessages( prev => [ ...prev, { role: 'assistant', content: `Added ${ rawMessage }.`, executed: true } ] );
			setIsLoading( false );
			return;
		}

		// Determine effective scope (use context mode if inside an active flow)
		const currentScope = scope === 'global' ? 'global' : (conversationContext?.mode || scope);

		// 0. SELECTION CHECK: If in Selection mode, enforce that a block MUST be selected
		if (currentScope === 'selection' && !selectedBlock) {
			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					content: 'Please select a block on the page first so I know what to modify.',
					executed: false,
					testId: 'maxi-ai-selection-required',
				},
			]);
			return;
		}

		setIsLoading(true);

		const queueDirectAction = directAction => {
			setIsLoading(true);
			setTimeout(async () => {
				logAIDebug('Queue direct action', directAction);
				const result = await parseAndExecuteAction(directAction);
				setMessages(prev => [
					...prev,
					{
						role: 'assistant',
						content: result.message,
						executed: result.executed,
					},
				]);
				setIsLoading(false);
			}, 50);
		};


		// ── Cloud-icon async search handler (executed by the hook, called with router params) ──
		const handleCloudIconSearch = async ({
			rawMessage: iconMsg,
			lowerMessage: lower,
			currentScope: iconScope,
			selectedBlock: iconBlock,
			iconBlocksInScope,
			buttonBlocksInScope,
			wantsMultipleIcons,
			matchTitlesToIconsIntent,
			matchTitlesIntent,
			shouldTreatAsIconTheme,
			hasIconBlocksInScope,
			cloudIconTarget,
		}) => {
			const selectedName = iconBlock?.name || '';
			const formatList = items =>
				items.length > 3
					? `${items.slice(0, 3).join(', ')} and ${items.length - 3} more`
					: items.join(', ');

			const styleIntent = extractIconStyleIntent(iconMsg);
			const styleLabel = styleIntent
				? styleIntent === 'line'
					? 'line'
					: styleIntent === 'shape'
					? 'shape'
					: 'filled'
				: '';
			const messageForQuery = styleIntent ? stripIconStylePhrases(iconMsg) : iconMsg;
			const explicitQueries = extractIconQueries(messageForQuery);
			const hasExplicitList = explicitQueries.length > 1;
			const searchQuery = extractIconQuery(messageForQuery);

			if (matchTitlesToIconsIntent) {
				if (!hasIconBlocksInScope || iconBlocksInScope.length === 0) {
					setMessages(prev => [
						...prev,
						{
							role: 'assistant',
							content:
								iconScope === 'selection'
									? 'No icon blocks found in the selection.'
									: 'No icon blocks found on this page.',
							executed: false,
						},
					]);
					setIsLoading(false);
					return;
				}

				const updates = [];
				const missingIconLabels = [];
				const missingTextTargets = [];
				const processedTextBlocks = new Set();

				iconBlocksInScope.forEach((iconBlock2, index) => {
					const iconLabel = getIconLabelFromBlock(iconBlock2);
					if (!iconLabel) {
						missingIconLabels.push(`icon ${index + 1}`);
						return;
					}

					const groupRoot = findGroupRootForIconBlock(iconBlock2);
					const groupTextBlocks = groupRoot
						? collectBlocks(groupRoot.innerBlocks || [], block =>
								isLabelBlock(block?.name)
							)
						: [];

					if (groupTextBlocks.length === 0) {
						missingTextTargets.push(iconLabel);
						return;
					}

					let bodyIndex = 0;
					groupTextBlocks.forEach(textBlock => {
						if (processedTextBlocks.has(textBlock.clientId)) return;
						const nextText = buildIconRelatedText(iconLabel, textBlock, bodyIndex);
						const changes = buildTextContentChange(textBlock, nextText);
						if (changes) {
							updates.push({ block: textBlock, changes });
							processedTextBlocks.add(textBlock.clientId);
						}
						if (!isHeadingTextBlock(textBlock)) bodyIndex += 1;
					});
				});

				if (updates.length === 0) {
					let message = 'I could not match titles to the icons.';
					if (missingIconLabels.length)
						message += ` Missing icon labels for ${formatList(missingIconLabels)}.`;
					if (missingTextTargets.length)
						message += ` Missing text blocks for: ${formatList(missingTextTargets)}.`;
					setMessages(prev => [
						...prev,
						{ role: 'assistant', content: message, executed: false },
					]);
					setIsLoading(false);
					return;
				}

				registry.batch(() => {
					updates.forEach(({ block, changes }) => {
						updateBlockAttributes(block.clientId, changes);
					});
				});

				let message =
					iconScope === 'selection'
						? `Updated ${updates.length} text blocks to match the icons.`
						: `Updated ${updates.length} text blocks on the page to match the icons.`;
				if (missingIconLabels.length)
					message += ` Missing icon labels for ${formatList(missingIconLabels)}.`;
				if (missingTextTargets.length)
					message += ` Missing text blocks for: ${formatList(missingTextTargets)}.`;
				setMessages(prev => [
					...prev,
					{ role: 'assistant', content: message, executed: true },
				]);
				setIsLoading(false);
				return;
			}

			if (matchTitlesIntent) {
				if (!hasIconBlocksInScope || iconBlocksInScope.length === 0) {
					setMessages(prev => [
						...prev,
						{
							role: 'assistant',
							content:
								iconScope === 'selection'
									? 'No icon blocks found in the selection.'
									: 'No icon blocks found on this page.',
							executed: false,
						},
					]);
					setIsLoading(false);
					return;
				}

				const labeledBlocks = [];
				const missingLabels = [];
				iconBlocksInScope.forEach((block, index) => {
					const label = findLabelForIconBlock(block);
					if (label) {
						labeledBlocks.push({ block, label });
					} else {
						missingLabels.push(`icon ${index + 1}`);
					}
				});

				if (labeledBlocks.length === 0) {
					let message =
						'I could not find any text labels below the icons. Make sure each icon has a text or heading block beneath it.';
					if (missingLabels.length)
						message += ` Missing labels for ${formatList(missingLabels)}.`;
					setMessages(prev => [
						...prev,
						{ role: 'assistant', content: message, executed: false },
					]);
					setIsLoading(false);
					return;
				}

				const results = await Promise.all(
					labeledBlocks.map(item =>
						findBestIcon(item.label, {
							target: 'svg',
							requireStrongMatch: true,
							style: styleIntent,
							requireStyleMatch: Boolean(styleIntent),
						})
					)
				);

				const updates = [];
				const missingMatches = [];
				const proOnly = [];
				const missingStyles = [];

				results.forEach((result, index) => {
					const { block, label } = labeledBlocks[index];
					if (!result || !result.svgCode || result.noStrongMatch) {
						missingMatches.push(label);
						return;
					}
					if (result.noStyleMatch) {
						missingStyles.push(label);
						return;
					}
					if (result.isPro) {
						proOnly.push(label);
						return;
					}
					updates.push({ block, result, label });
				});

				if (updates.length === 0) {
					let message =
						'I could not find matching icons for the titles below in the Cloud Library.';
					if (missingLabels.length)
						message += ` Missing labels for ${formatList(missingLabels)}.`;
					if (missingMatches.length)
						message += ` No matches for: ${formatList(missingMatches)}.`;
					if (missingStyles.length)
						message += ` No ${styleLabel} icons for: ${formatList(missingStyles)}.`;
					if (proOnly.length) message += ` Pro only: ${formatList(proOnly)}.`;
					setMessages(prev => [
						...prev,
						{ role: 'assistant', content: message, executed: false },
					]);
					setIsLoading(false);
					return;
				}

				let updatedCount = 0;
				registry.batch(() => {
					updates.forEach(({ block, result, label }) => {
						const blockHandler = getAiHandlerForBlock(block);
						if (!blockHandler) return;
						const prefix = getBlockPrefix(block.name);
						const handlerResult = blockHandler(
							block,
							'icon_svg',
							{
								svgCode: result.svgCode,
								svgType: result.svgType,
								title: result.title || label,
							},
							prefix,
							{ mode: iconScope }
						);
						let changes = null;
						if (handlerResult?.action === 'apply') {
							changes = handlerResult.attributes;
						} else if (handlerResult && !handlerResult.action) {
							changes = handlerResult;
						}
						if (changes) {
							updateBlockAttributes(block.clientId, changes);
							updatedCount += 1;
						}
					});
				});

				let message =
					iconScope === 'selection'
						? `Updated ${updatedCount} icons to match the titles below.`
						: `Updated ${updatedCount} icons on the page to match the titles below.`;
				if (missingLabels.length)
					message += ` Missing labels for ${formatList(missingLabels)}.`;
				if (missingMatches.length)
					message += ` No matches for: ${formatList(missingMatches)}.`;
				if (missingStyles.length)
					message += ` No ${styleLabel} icons for: ${formatList(missingStyles)}.`;
				if (proOnly.length) message += ` Pro only: ${formatList(proOnly)}.`;

				setMessages(prev => [
					...prev,
					{ role: 'assistant', content: message, executed: true },
				]);
				setIsLoading(false);
				return;
			}

			if (!searchQuery && !hasExplicitList) {
				setMessages(prev => [
					...prev,
					{
						role: 'assistant',
						content: 'Which icon should I search for in the Cloud Library?',
						executed: false,
					},
				]);
				setIsLoading(false);
				return;
			}

			const wantsDifferent = /\b(different|another|alternative|new|other)\b/.test(lower);
			let targetMeta = cloudIconTarget;

			if (shouldTreatAsIconTheme && hasIconBlocksInScope && !selectedName.includes('button')) {
				targetMeta = { targetBlock: 'icon', property: 'icon_svg', svgTarget: 'svg' };
			}

			const isButtonTarget = targetMeta.targetBlock === 'button';
			const isIconTarget = targetMeta.targetBlock === 'icon';
			const currentSvg = isButtonTarget
				? iconBlock?.attributes?.['icon-content']
				: iconBlock?.attributes?.content;
			const excludeSvgCodes = wantsDifferent && currentSvg ? [currentSvg] : [];

			const isMultiIconRequest = wantsMultipleIcons || hasExplicitList;
			const targetBlocks = isMultiIconRequest
				? isButtonTarget
					? buttonBlocksInScope
					: iconBlocksInScope
				: [];

			if (iconScope === 'selection' && !isMultiIconRequest) {
				const mismatch =
					(isButtonTarget && !selectedName.includes('button')) ||
					(isIconTarget && !selectedName.includes('icon'));
				if (mismatch) {
					setMessages(prev => [
						...prev,
						{
							role: 'assistant',
							content: isButtonTarget
								? 'Please select a button block to change its icon.'
								: 'Please select an Icon block to change its icon.',
							executed: false,
						},
					]);
					setIsLoading(false);
					return;
				}
			}

			if (isMultiIconRequest && targetBlocks.length === 0) {
				setMessages(prev => [
					...prev,
					{
						role: 'assistant',
						content:
							iconScope === 'selection'
								? 'No icon blocks found in the selection.'
								: 'No icon blocks found on this page.',
						executed: false,
					},
				]);
				setIsLoading(false);
				return;
			}

			console.log('[Maxi AI] Searching Cloud Library icons for:', searchQuery);

			if (hasExplicitList && isMultiIconRequest && targetBlocks.length > 1) {
				const maxQueries = Math.min(12, explicitQueries.length);
				const queryList = explicitQueries.slice(0, maxQueries);
				const results = await Promise.all(
					queryList.map(query =>
						findBestIcon(query, {
							target: targetMeta.svgTarget,
							requireStrongMatch: true,
							style: styleIntent,
							requireStyleMatch: Boolean(styleIntent),
						})
					)
				);

				const usable = [];
				const missing = [];
				const proOnly = [];
				const missingStyles = [];

				results.forEach((result, index) => {
					const query = queryList[index];
					if (!result || !result.svgCode || result.noStrongMatch) {
						missing.push(query);
						return;
					}
					if (result.noStyleMatch) {
						missingStyles.push(query);
						return;
					}
					if (result.isPro) {
						proOnly.push(query);
						return;
					}
					usable.push({ title: result.title, svgCode: result.svgCode, svgType: result.svgType });
				});

				const normalizeSvgCode = value => String(value || '').replace(/\s+/g, ' ').trim();
				const uniqueUsable = [];
				const seenSvg = new Set();
				for (const item of usable) {
					const key = normalizeSvgCode(item.svgCode);
					if (!key || seenSvg.has(key)) continue;
					seenSvg.add(key);
					uniqueUsable.push(item);
				}

				if (uniqueUsable.length < 2) {
					setMessages(prev => [
						...prev,
						{
							role: 'assistant',
							content: `I could only find one matching icon for that list. Try different keywords.`,
							executed: false,
						},
					]);
					setIsLoading(false);
					return;
				}

				let updatedCount = 0;
				registry.batch(() => {
					targetBlocks.forEach((block, index) => {
						const choice = uniqueUsable[index % uniqueUsable.length];
						const blockHandler = getAiHandlerForBlock(block);
						if (!blockHandler) return;
						const prefix = getBlockPrefix(block.name);
						const result = blockHandler(
							block,
							targetMeta.property,
							{ svgCode: choice.svgCode, svgType: choice.svgType, title: choice.title },
							prefix,
							{ mode: iconScope }
						);
						let changes = null;
						if (result?.action === 'apply') {
							changes = result.attributes;
						} else if (result && !result.action) {
							changes = result;
						}
						if (changes) {
							updateBlockAttributes(block.clientId, changes);
							updatedCount += 1;
						}
					});
				});

				let message =
					iconScope === 'selection'
						? `Updated ${updatedCount} icons using the requested list.`
						: `Updated ${updatedCount} icons on the page using the requested list.`;
				if (missing.length) message += ` Missing: ${formatList(missing)}.`;
				if (missingStyles.length)
					message += ` No ${styleLabel} icons for: ${formatList(missingStyles)}.`;
				if (proOnly.length) message += ` Pro only: ${formatList(proOnly)}.`;

				setMessages(prev => [
					...prev,
					{ role: 'assistant', content: message, executed: true },
				]);
				setIsLoading(false);
				return;
			}

			if (isMultiIconRequest && targetBlocks.length > 1) {
				const candidateLimit = Math.min(24, Math.max(12, targetBlocks.length * 3));
				const candidateResult = await findIconCandidates(searchQuery, {
					target: targetMeta.svgTarget,
					limit: candidateLimit,
					style: styleIntent,
					requireStyleMatch: Boolean(styleIntent),
				});

				if (candidateResult?.noStyleMatch) {
					setMessages(prev => [
						...prev,
						{
							role: 'assistant',
							content: `I couldn't find ${styleLabel} icons for "${searchQuery}" in the Cloud Library. Try a different keyword.`,
							executed: false,
						},
					]);
					setIsLoading(false);
					return;
				}

				if (candidateResult?.hasOnlyPro) {
					setMessages(prev => [
						...prev,
						{
							role: 'assistant',
							content: `Found icons for "${searchQuery}" but they are Pro. Upgrade to MaxiBlocks Pro to use them.`,
							executed: false,
						},
					]);
					setIsLoading(false);
					return;
				}

				if (!candidateResult?.icons || candidateResult.icons.length === 0) {
					setMessages(prev => [
						...prev,
						{
							role: 'assistant',
							content: `I couldn't find icons for "${searchQuery}" in the Cloud Library. Try a different keyword.`,
							executed: false,
						},
					]);
					setIsLoading(false);
					return;
				}

				if (candidateResult.icons.length <= 1) {
					setMessages(prev => [
						...prev,
						{
							role: 'assistant',
							content: `I only found one icon for "${searchQuery}" in the Cloud Library.`,
							executed: false,
						},
					]);
					setIsLoading(false);
					return;
				}

				let updatedCount = 0;
				registry.batch(() => {
					targetBlocks.forEach((block, index) => {
						const choice = candidateResult.icons[index % candidateResult.icons.length];
						const blockHandler = getAiHandlerForBlock(block);
						if (!blockHandler) return;
						const prefix = getBlockPrefix(block.name);
						const result = blockHandler(
							block,
							targetMeta.property,
							{ svgCode: choice.svgCode, svgType: choice.svgType, title: choice.title },
							prefix,
							{ mode: iconScope }
						);
						let changes = null;
						if (result?.action === 'apply') {
							changes = result.attributes;
						} else if (result && !result.action) {
							changes = result;
						}
						if (changes) {
							updateBlockAttributes(block.clientId, changes);
							updatedCount += 1;
						}
					});
				});

				setMessages(prev => [
					...prev,
					{
						role: 'assistant',
						content:
							iconScope === 'selection'
								? `Updated ${updatedCount} icons with "${searchQuery}" variations.`
								: `Updated ${updatedCount} icons on the page with "${searchQuery}" variations.`,
						executed: true,
					},
				]);
				setIsLoading(false);
				return;
			}

			const fallbackQuery =
				hasExplicitList && explicitQueries.length > 0 ? explicitQueries[0] : searchQuery;
			const iconResult = await findBestIcon(fallbackQuery, {
				target: targetMeta.svgTarget,
				excludeSvgCodes,
				preferDifferent: wantsDifferent && excludeSvgCodes.length > 0,
				style: styleIntent,
				requireStyleMatch: Boolean(styleIntent),
			});

			if (iconResult?.noStyleMatch) {
				setMessages(prev => [
					...prev,
					{
						role: 'assistant',
						content: `I couldn't find ${styleLabel} icons for "${fallbackQuery}" in the Cloud Library. Try a different keyword.`,
						executed: false,
					},
				]);
				setIsLoading(false);
				return;
			}

			if (wantsDifferent && (iconResult?.noAlternative || iconResult?.total === 1)) {
				setMessages(prev => [
					...prev,
					{
						role: 'assistant',
						content: `I only found one icon for "${fallbackQuery}" in the Cloud Library.`,
						executed: false,
					},
				]);
				setIsLoading(false);
				return;
			}

			if (!iconResult || !iconResult.svgCode) {
				setMessages(prev => [
					...prev,
					{
						role: 'assistant',
						content: `I couldn't find an icon for "${fallbackQuery}" in the Cloud Library. Try a different keyword.`,
						executed: false,
					},
				]);
				setIsLoading(false);
				return;
			}

			if (iconResult.isPro) {
				setMessages(prev => [
					...prev,
					{
						role: 'assistant',
						content: `Found "${iconResult.title}" but it's a Pro icon. Upgrade to MaxiBlocks Pro to use it.`,
						executed: false,
					},
				]);
				setIsLoading(false);
				return;
			}

			const directIconAction = {
				action: iconScope === 'selection' ? 'update_selection' : 'update_page',
				property: targetMeta.property,
				value: {
					svgCode: iconResult.svgCode,
					svgType: iconResult.svgType,
					title: iconResult.title,
				},
				target_block: targetMeta.targetBlock,
				message:
					iconScope === 'selection'
						? `Updated icon to "${iconResult.title}".`
						: `Updated ${isIconTarget ? 'icon blocks' : 'button icons'} to "${iconResult.title}".`,
			};

			const iconActionResult = await parseAndExecuteAction(directIconAction);
			setMessages(prev => [
				...prev,
				{ role: 'assistant', content: iconActionResult.message, executed: iconActionResult.executed },
			]);
			setIsLoading(false);
		};

		// ── Pattern / create-block async handler ─────────────────────────────────
		const handleCreateBlock = async ({ rawMessage: patternMsg, targetClientId }) => {
			try {
				const searchQuery = extractPatternQuery(patternMsg);
				console.log('[Maxi AI] Searching Cloud Library for:', searchQuery);

				const patternResult = await findBestPattern(searchQuery);

				if (!patternResult) {
					setMessages(prev => [
						...prev,
						{
							role: 'assistant',
							content: `I couldn't find a pattern for "${searchQuery}" in the Cloud Library. Try browsing the Cloud Library manually or use different keywords.`,
							executed: false,
						},
					]);
					setIsLoading(false);
					return;
				}

				if (patternResult.isPro) {
					setMessages(prev => [
						...prev,
						{
							role: 'assistant',
							content: `Found "${patternResult.title}" but it's a Pro pattern. Upgrade to MaxiBlocks Pro to use it!`,
							executed: false,
						},
					]);
					setIsLoading(false);
					return;
				}

				if (targetClientId && patternResult.gutenbergCode) {
					await onRequestInsertPattern(
						patternResult.gutenbergCode,
						false,
						true,
						targetClientId
					);
					setMessages(prev => [
						...prev,
						{
							role: 'assistant',
							content: ` Created "${patternResult.title}"! The pattern has been inserted.`,
							executed: true,
						},
					]);
				} else {
					setMessages(prev => [
						...prev,
						{
							role: 'assistant',
							content: `Found "${patternResult.title}" but please select a block first to replace with this pattern.`,
							executed: false,
						},
					]);
				}
			} catch (error) {
				console.error('[Maxi AI] Pattern insert error:', error);
				setMessages(prev => [
					...prev,
					{
						role: 'assistant',
						content: 'Sorry, there was an error creating the pattern. Please try again.',
						executed: false,
					},
				]);
			}
			setIsLoading(false);
		};

		// ── Route the message via the client-side router ──────────────────────────
		const routingCtx = buildRoutingContext(rawMessage, {
			currentScope,
			selectedBlock,
			messagesRef,
			allBlocks,
		});

		const routeResult = await routeClientSide(rawMessage, routingCtx, select);

		switch (routeResult.type) {
			case 'action':
				queueDirectAction(routeResult.payload);
				return;

			case 'clarify':
				setMessages(prev => [...prev, routeResult.message]);
				setIsLoading(false);
				return;

			case 'flow':
				if (routeResult.sidebarProperty) {
					openSidebarForProperty(routeResult.sidebarProperty);
				}
				setConversationContext(routeResult.flowContext);
				setMessages(prev => [...prev, routeResult.message]);
				setIsLoading(false);
				return;

			case 'immediate_updates':
				registry.batch(() => {
					routeResult.updates.forEach(({ clientId, attributes }) => {
						updateBlockAttributes(clientId, attributes);
					});
				});
				if (routeResult.sidebarProperty) {
					openSidebarForProperty(routeResult.sidebarProperty);
				}
				setMessages(prev => [...prev, routeResult.message]);
				setIsLoading(false);
				return;

			case 'cloud_icon': {
				const statusMsg = routeResult.params.matchTitlesToIconsIntent
					? 'Matching text to icons...'
					: 'Searching Cloud Library for icons...';
				setMessages(prev => [...prev, { role: 'assistant', content: statusMsg }]);
				setTimeout(async () => {
					try {
						await handleCloudIconSearch(routeResult.params);
					} catch (err) {
						console.error('[Maxi AI] Cloud icon error:', err);
						setMessages(prev => [
							...prev,
							{
								role: 'assistant',
								content: 'Sorry, there was an error searching the Cloud Library for icons.',
								executed: false,
							},
						]);
						setIsLoading(false);
					}
				}, 100);
				return;
			}

			case 'insert_block':
				setConversationContext( { type: 'insert_block', blockType: routeResult.params.blockType } );
				setMessages( prev => [
					...prev,
					{
						role: 'assistant',
						content: 'What layout would you like?',
						options: [
							'Single container',
							'2 equal columns',
							'3 equal columns',
							'4 equal columns',
							'Sidebar (1/3 + 2/3)',
							'Full-width hero',
							'Browse Cloud Library',
						],
					},
				] );
				setIsLoading( false );
				return;

			case 'create_block':
				setMessages(prev => [
					...prev,
					{ role: 'assistant', content: 'Searching Cloud Library...' },
				]);
				setTimeout(async () => {
					await handleCreateBlock(routeResult.params);
				}, 100);
				return;

			case 'open_cloud_library': {
				const cloudMsg =
					routeResult.params?.rawMessage ?? rawMessage;
				try {
					await runCloudLibraryIntent( cloudMsg );
				} catch ( openCloudErr ) {
					console.error(
						'[Maxi AI] Open Cloud Library error:',
						String( openCloudErr?.message || openCloudErr )
					);
					setMessages( prev => [
						...prev,
						{
							role: 'assistant',
							content: __(
								'Could not open the Cloud Library. Use the Cloud Library button in the Maxi toolbar.',
								'maxi-blocks'
							),
							executed: false,
						},
					] );
				}
				setIsLoading( false );
				return;
			}

			case 'passthrough':
			default:
				break;
		}

		// Passthrough to AI API — derive lowerMessage for prompt building below
		const lowerMessage = rawMessage.toLowerCase();

		setIsLoading(true);

		try {
			const context = buildPassthroughLlmContext({
				scope,
				selectedBlock,
				activeStyleCard,
				logDebug: logAIDebug,
			});

			// Only use the block-specific role prompt for selection scope.
			// For page scope the block prompt's restrictive role ("I only manage rows") prevents
			// general page-level operations even though the user explicitly switched scope.
			const blockPrompt = (scope === 'selection' && selectedBlock)
				? getAiPromptForBlockName(selectedBlock.name)
				: '';
			const wantsInteractionBuilder = isInteractionBuilderMessage(lowerMessage);
			const scopePrompt =
				scope === 'global'
					? STYLE_CARD_MAXI_PROMPT
					: wantsInteractionBuilder
						? INTERACTION_BUILDER_PROMPT
						: blockPrompt;
			const sharedPrompts =
				scope === 'global'
					? []
					: wantsInteractionBuilder
						? []
						: [ADVANCED_CSS_PROMPT, META_MAXI_PROMPT, INTERACTION_BUILDER_PROMPT].filter(Boolean);
			const systemPrompt = [SYSTEM_PROMPT, scopePrompt, ...sharedPrompts]
				.filter(Boolean)
				.join('\n\n');

			const { executed, message, options, optionsType } = await executePassthroughLlmTurn({
				messages,
				rawMessage,
				userMessage,
				scope,
				systemPrompt,
				context,
				selectedBlock,
				getSkillContextForBlock,
				parseAndExecuteAction,
				logDebug: logAIDebug,
			});

			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					content: message,
					options,
					optionsType,
					executed,
				},
			]);
		} catch (error) {
			console.error('AI Chat error:', error);
			const rawError = String(error?.message || '');
			let parsedError = null;
			if (rawError.trim().startsWith('{')) {
				try {
					parsedError = JSON.parse(rawError);
				} catch (parseError) {
					parsedError = null;
				}
			}

			const errorCode = parsedError?.code;
			const errorText = parsedError?.message || rawError;

			// Attempt to show a more helpful error message
			let errorMessage = __(
				'Error: I could not match that request to a supported prompt. Try rephrasing or update the prompt mapping.',
				'maxi-blocks'
			);

			if (errorCode === 'no_api_key' || /OpenAI API key/i.test(errorText)) {
				errorMessage = __('Error: Please check your OpenAI API key in Maxi AI settings.', 'maxi-blocks');
			} else if (errorCode === 'unsupported_provider') {
				errorMessage = __('Error: Unsupported AI provider configured.', 'maxi-blocks');
			} else if (errorCode === 'openai_api_error') {
				errorMessage = __('Error: The AI provider returned an error. Check your API key, model, or quota.', 'maxi-blocks');
			} else if (errorCode === 'invalid_messages' || errorCode === 'invalid_prompt') {
				errorMessage = __('Error: The AI request payload was invalid. Try rephrasing or check prompt mappings.', 'maxi-blocks');
			} else if (errorText) {
				// Don't show entire HTML responses if something crashed badly
				if (errorText.includes('<') && errorText.includes('>')) {
					errorMessage = __('Server Error: Received HTML instead of JSON. Check server logs.', 'maxi-blocks');
				} else if (errorText.length < 150) {
					errorMessage = `Error: ${errorText}`;
				}
			}

			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					content: errorMessage,
					isError: true,
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyDown = e => {
		if (e.key !== 'Enter' || e.shiftKey) return;
		// Block editor and other Gutenberg shortcuts often listen on capture; stop the event here.
		e.preventDefault();
		e.stopPropagation();
		if (typeof e.stopImmediatePropagation === 'function') {
			e.stopImmediatePropagation();
		}
		if (isLoading) return;
		if (!String(input || '').trim()) return;
		void sendMessage();
	};

	const handleSuggestion = async (suggestion) => {
		// Handle insert_block layout picker reply (button click path)
		if (conversationContext?.type === 'insert_block') {
			const lower = suggestion.toLowerCase();
			setConversationContext(null);
			setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
			setIsLoading(true);
			let rootBlock;
			if (lower.includes('cloud') || lower.includes('library') || lower.includes('browse')) {
				try {
					await runCloudLibraryIntent(suggestion);
				} catch (browseCloudErr) {
					console.error(
						'[Maxi AI] Browse Cloud from layout picker:',
						String(browseCloudErr?.message || browseCloudErr)
					);
					setMessages(prev => [
						...prev,
						{
							role: 'assistant',
							content: __(
								'Could not open the Cloud Library. Use the toolbar Cloud button.',
								'maxi-blocks'
							),
							executed: false,
						},
					]);
				}
				setIsLoading(false);
				return;
			} else if (lower.includes('sidebar')) {
				const row = createBlock('maxi-blocks/row-maxi');
				rootBlock = createBlock('maxi-blocks/container-maxi', {}, [row]);
				dispatch('core/block-editor').insertBlocks(rootBlock);
				loadColumnsTemplate('1-3', row.clientId, 'general', 2);
			} else if (lower.includes('hero') || lower.includes('full-width') || lower.includes('full width')) {
				rootBlock = createBlock('maxi-blocks/container-maxi', { 'full-width-general': true });
				dispatch('core/block-editor').insertBlocks(rootBlock);
			} else {
				const colMatch = lower.match(/(\d+)/);
				const numCols = colMatch ? Math.min(parseInt(colMatch[1]), 6) : 1;
				if (numCols > 1) {
					const templateName = getTemplates(true, 'general', numCols).find(t => !t.isMoreThanEightColumns)?.name || `${numCols} columns`;
					const row = createBlock('maxi-blocks/row-maxi');
					rootBlock = createBlock('maxi-blocks/container-maxi', {}, [row]);
					dispatch('core/block-editor').insertBlocks(rootBlock);
					loadColumnsTemplate(templateName, row.clientId, 'general', numCols);
				} else {
					rootBlock = createBlock('maxi-blocks/container-maxi');
					dispatch('core/block-editor').insertBlocks(rootBlock);
				}
			}
			setMessages(prev => [...prev, { role: 'assistant', content: `Added ${suggestion}.`, executed: true }]);
			setIsLoading(false);
			return;
		}

		// 1. Handle Active Conversation Flow
		if (conversationContext) {
			console.log('[Maxi AI Conversation] Handling input:', suggestion);
			console.log('[Maxi AI Conversation] Current Context:', JSON.stringify(conversationContext, null, 2));
			
			let value = suggestion;

			// Map "Color X" to numeric X
			if (typeof suggestion === 'string' && suggestion.startsWith('Color ')) {
				const num = parseInt(suggestion.replace('Color ', ''));
				if (!isNaN(num)) value = num;
				console.log('[Maxi AI Conversation] Mapped Color to:', value);
			}
			// Map Option Labels to Values (if stored in context)
			else if (conversationContext.currentOptions && conversationContext.currentOptions.length > 0) {
				console.log('[Maxi AI Conversation] Looking for option match. Options:', JSON.stringify(conversationContext.currentOptions));
				const match = conversationContext.currentOptions.find(o => {
					if (typeof o === 'object' && o.label) {
						return o.label === suggestion;
					}
					return o === suggestion;
				});
				console.log('[Maxi AI Conversation] Match found:', match);
				if (match && typeof match === 'object' && match.value !== undefined) {
					value = match.value;
					console.log('[Maxi AI Conversation] Mapped to value:', value);
				}
			}

			// Capture data for the pending target
			const updatedData = { 
				...conversationContext.data,
				[conversationContext.pendingTarget]: value
			};

			console.log('[Maxi AI Conversation] Updated Data:', updatedData);

			// Add User Message
			setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
			setIsLoading(true);

			// Update context state
			setConversationContext(prev => ({ ...prev, data: updatedData }));

            // ORCHESTRATION: Iterate over ALL tracked blocks
            const targetIds = conversationContext.blockIds || [];
            if (targetIds.length === 0 && selectedBlock) targetIds.push(selectedBlock.clientId); // Fallback

            // We need to determine the response. Since all blocks usually follow the same flow path,
            // we process the first valid block to determine the NEXT STEP (Ask Question or Done).
            // Then we apply any updates to ALL blocks.
            
            // Find full block objects - Get FRESH blocks from store to avoid stale closure
            const freshBlocks = select('core/block-editor').getBlocks();
            const fullBlocks = collectBlocks(freshBlocks, b => targetIds.includes(b.clientId));
            if (fullBlocks.length === 0 && selectedBlock && targetIds.includes(selectedBlock.clientId)) fullBlocks.push(selectedBlock);

            if (fullBlocks.length === 0) {
                 setMessages(prev => [...prev, { role: 'assistant', content: "Lost track of blocks.", executed: false }]);
                 setIsLoading(false);
                 return;
            }

            let nextStepResponse = null;
            let finalMsg = "Done.";
			let isUnchanged = true;

            // Batch update via registry if needed, or just sequential dispatch
            // We'll process Logic on the first block to get the 'Action'
            const primaryBlock = fullBlocks[0];
            const prefix = getBlockPrefix(primaryBlock.name);
			const flowHandler = getAiHandlerForBlock(primaryBlock);
            const logicResult = flowHandler
				? flowHandler(primaryBlock, conversationContext.flow, null, prefix, updatedData)
				: null;

            if (logicResult) {
                if (logicResult.action === 'ask_options' || logicResult.action === 'ask_palette') {
                    // It's another question - update UI and Context, no block changes yet (usually)
                    nextStepResponse = logicResult;
                } 
                else if (logicResult.action === 'apply') {
                    // APPLIES TO ALL BLOCKS
                    // We need to generate the specific attributes for EACH block (prefixes might differ!)
                    
                    fullBlocks.forEach(blk => {
                        const p = getBlockPrefix(blk.name);
						const blockHandler = getAiHandlerForBlock(blk);
                        // Re-run handler for specific block to get correct attributes
                        const res = blockHandler
							? blockHandler(blk, conversationContext.flow, null, p, updatedData)
							: null;
                        
                        if (res && res.action === 'apply' && res.attributes) {
                            dispatch('core/block-editor').updateBlockAttributes(blk.clientId, res.attributes);
							isUnchanged = false;
                        }
                    });

                    if (logicResult.done) {
                        nextStepResponse = { done: true };
						// Prefer explicit handler message, otherwise fall back to pattern copy
						if (logicResult.message) {
							finalMsg = logicResult.message;
						} else {
							const pattern = AI_BLOCK_PATTERNS.find(p => p.property === conversationContext.flow);
							if (pattern && pattern.pageMsg) finalMsg = pattern.pageMsg; // Or selectionMsg depending on mode
						}
                    }
                }
            }

			const sidebarMode = conversationContext.mode;
			const sidebarFlowProperty = conversationContext.flow;
			const sidebarClientId = primaryBlock?.clientId || null;

            setTimeout(() => {
				maybeOpenFlowSidebar({
					flow: sidebarFlowProperty,
					mode: sidebarMode,
					clientId: sidebarClientId,
					selectBlock: clientId =>
						dispatch('core/block-editor').selectBlock(clientId),
					openSidebarForProperty,
				});
                if (nextStepResponse) {
                    if (nextStepResponse.done) {
                         setConversationContext(null); // Clear Context
                         setMessages(prev => [...prev, { role: 'assistant', content: finalMsg, executed: true }]);
                    } else {
                        // Ask next question
                        setConversationContext(prev => ({
                            ...prev,
                            pendingTarget: nextStepResponse.target,
                            currentOptions: nextStepResponse.options || []
                        }));
                         
                        setMessages(prev => [...prev, { 
                            role: 'assistant', 
                            content: nextStepResponse.msg, 
                            options: nextStepResponse.options ? nextStepResponse.options.map(o => o.label || o) : (nextStepResponse.action === 'ask_palette' ? ['palette'] : []),
                            optionsType: nextStepResponse.action === 'ask_palette' ? 'palette' : 'text',
                            colorTarget: nextStepResponse.target,
                            executed: false 
                        }]);
                    }
                } else {
                     // No result?
                     setMessages(prev => [...prev, { role: 'assistant', content: "Flow state error.", executed: false }]);
                }
                setIsLoading(false);
            }, 500);

			return; // Stop standard processing
		}

		// 2. Standard Logic
		let directAction = null;
		
		// Get target context from the last clarification message (if any)
		const lastClarificationMsg = [...messages].reverse().find(m => m.role === 'assistant' && m.options);
		const targetContext = lastClarificationMsg?.targetContext;
		const lastClarifyContent =
			typeof lastClarificationMsg?.content === 'string'
				? lastClarificationMsg.content.toLowerCase()
				: '';
		const ratioOptionMatch =
			typeof suggestion === 'string'
				? suggestion.trim().match(/^(\d+)\s*[:/]\s*(\d+)$/)
				: null;
		const isImageRatioContext =
			lastClarifyContent.includes('image') ||
			lastClarifyContent.includes('images') ||
			selectedBlock?.name?.includes('image') ||
			targetContext === 'image';
		const spacingBase = lastClarificationMsg?.spacingBase;
		const spacingSide = lastClarificationMsg?.spacingSide;
		const spacingPresetValue = {
			Compact: 60,
			Comfortable: 100,
			Spacious: 140,
		};
		const lastShadowPrompt = lastClarifyContent.includes('shadow');
		const lastShapeDividerMsg = [...messages].reverse().find(m => m.shapeDividerLocation || m.shapeDividerTarget);
		const shapeDividerLocations = ['Top', 'Bottom', 'Both'];
		const shapeDividerStyles = ['Wave', 'Curve', 'Slant', 'Triangle'];
		const spacingPresets = {
			Compact: { desktop: '60px', tablet: '40px', mobile: '20px' },
			Comfortable: { desktop: '100px', tablet: '60px', mobile: '40px' },
			Spacious: { desktop: '140px', tablet: '80px', mobile: '60px' },
		};

		const linkOptionLabels = ['Open in new tab', 'Make it nofollow', 'Both'];
		const lastOptions = Array.isArray(lastClarificationMsg?.options)
			? lastClarificationMsg.options
			: [];
		const isColumnTopBottomClarify =
			(suggestion === 'Top' || suggestion === 'Bottom') &&
			lastClarifyContent &&
			!lastShapeDividerMsg?.shapeDividerLocation &&
			(lastClarifyContent.includes('empty column') ||
				lastClarifyContent.includes('each empty column') ||
				(lastClarifyContent.includes('button') &&
					lastClarifyContent.includes('column')));
		if (isColumnTopBottomClarify) {
			const freshBlocks = select('core/block-editor').getBlocks();
			const emptyColumns = collectBlocks(
				freshBlocks,
				b =>
					typeof b.name === 'string' &&
					b.name.includes('column-maxi') &&
					(!b.innerBlocks || b.innerBlocks.length === 0)
			);
			if (emptyColumns.length > 0) {
				directAction = {
					action: 'MODIFY_BLOCK',
					payload: {
						ops: emptyColumns.map(col => ({
							op: 'append_child',
							parent_clientId: col.clientId,
							block: {
								name: 'maxi-blocks/button-maxi',
								attributes: {},
								innerBlocks: [],
							},
						})),
					},
					message: __(
						'Added a button to each empty column.',
						'maxi-blocks'
					),
				};
			}
		}
		const isLinkOptionContext =
			linkOptionLabels.includes(suggestion) &&
			(lastClarifyContent.includes('link') ||
				lastOptions.some(option => linkOptionLabels.includes(option)));
		if (isLinkOptionContext) {
			const recentMessages = messagesRef.current || [];
			let lastUrl = null;
			for (let i = recentMessages.length - 1; i >= 0; i -= 1) {
				const msg = recentMessages[i];
				if (msg?.role !== 'user' || typeof msg.content !== 'string') continue;
				lastUrl = extractUrl(msg.content);
				if (lastUrl) break;
			}
			if (!lastUrl) {
				lastUrl = selectedBlock?.attributes?.linkSettings?.url || null;
			}

			const opensInNewTab = suggestion === 'Open in new tab' || suggestion === 'Both';
			const noFollow = suggestion === 'Make it nofollow' || suggestion === 'Both';
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			directAction = {
				action: actionType,
				property: 'link_settings',
				value: {
					...(lastUrl ? { url: lastUrl } : {}),
					opensInNewTab,
					noFollow,
				},
				...(actionType === 'update_page' ? { target_block: 'container' } : {}),
				message: lastUrl
					? 'Updated the link options.'
					: 'Updated link options. Add a URL to activate the link.',
			};
		}

		if (lastShapeDividerMsg?.shapeDividerLocation && shapeDividerLocations.includes(suggestion)) {
			const location = suggestion.toLowerCase();
			setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: 'Which shape style should the divider use?',
				options: shapeDividerStyles,
				shapeDividerTarget: location,
				executed: false
			}]);
			return;
		}

		if (lastShapeDividerMsg?.shapeDividerTarget && shapeDividerStyles.includes(suggestion)) {
			const target = lastShapeDividerMsg.shapeDividerTarget;
			const property = target === 'top'
				? 'shape_divider_top'
				: target === 'bottom'
					? 'shape_divider_bottom'
					: 'shape_divider_both';
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			const shape = suggestion.toLowerCase();
			const message = target === 'both'
				? `Added ${shape} shape dividers to the top and bottom.`
				: `Added ${shape} shape divider to the ${target}.`;

			directAction = {
				action: actionType,
				property,
				value: shape,
				target_block: 'container',
				message
			};
		}

		if (ratioOptionMatch && (lastClarifyContent.includes('ratio') || lastClarifyContent.includes('aspect')) && isImageRatioContext) {
			const ratioValue = resolveImageRatioValue(ratioOptionMatch[1], ratioOptionMatch[2]);
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			const targetBlock =
				isImageRatioContext ? 'image' : targetContext;

			directAction = {
				action: actionType,
				property: 'image_ratio',
				value: ratioValue,
				target_block: targetBlock || 'image',
				message: `Aspect ratio set to ${ratioOptionMatch[1]}:${ratioOptionMatch[2]}.`,
			};
		}
		else if (lastShadowPrompt && ['Soft', 'Crisp', 'Bold', 'Glow'].includes(suggestion)) {
			const styleMap = {
				Soft: { x: 0, y: 10, blur: 30, spread: 0 },
				Crisp: { x: 0, y: 2, blur: 4, spread: 0 },
				Bold: { x: 0, y: 20, blur: 25, spread: -5 },
				Glow: { x: 0, y: 0, blur: 15, spread: 2 },
			};
			const isVideoTarget = selectedBlock?.name?.includes('video');
			const property = isVideoTarget ? 'video_box_shadow' : 'box_shadow';
			const value = isVideoTarget
				? { ...styleMap[suggestion], color: 8 }
				: styleMap[suggestion];
			const targetBlock = isVideoTarget ? 'video' : targetContext;
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';

			directAction = {
				action: actionType,
				property,
				value,
				target_block: targetBlock,
				message: targetBlock ? `Applied ${suggestion} shadow to all ${targetBlock}s.` : `Applied ${suggestion} shadow.`,
			};
		}
		else if (suggestion === 'Remove' && (lastClarifyContent.includes('spacing') || lastClarifyContent.includes('padding') || lastClarifyContent.includes('margin'))) {
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			const base = lastClarifyContent.includes('margin') ? 'margin' : 'padding';
			let property = base;
			if (base === 'padding' && targetContext === 'video') {
				property = 'video_padding';
			}
			directAction = {
				action: actionType,
				property,
				value: 0,
				...(targetContext ? { target_block: targetContext } : {}),
				message: `Removed ${base}.`,
			};
		}

		// 1. ROUNDED CORNERS
		else if (suggestion.includes('Subtle (8px)')) directAction = { action: 'update_page', property: 'border_radius', value: 8, target_block: targetContext, message: 'Applied Subtle rounded corners (8px).' };
		else if (suggestion.includes('Soft (24px)')) directAction = { action: 'update_page', property: 'border_radius', value: 24, target_block: targetContext, message: 'Applied Soft rounded corners (24px).' };
		else if (suggestion.includes('Full (50px)')) directAction = { action: 'update_page', property: 'border_radius', value: 50, target_block: targetContext, message: 'Applied Full rounded corners (50px).' };
		
		// 2. RESPONSIVE SPACING
		// Uses dedicated createResponsiveSpacing function for consistent breakpoint handling
		// Action type 'apply_responsive_spacing' signals special handling in parseAndExecuteAction
		else if (spacingSide && spacingBase && ['Compact', 'Comfortable', 'Spacious', 'Remove'].includes(suggestion)) {
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			let property = `${spacingBase}_${spacingSide}`;
			if (spacingBase === 'padding' && targetContext === 'video') {
				property = `video_padding_${spacingSide}`;
			}
			const value = suggestion === 'Remove' ? 0 : spacingPresetValue[suggestion];
			directAction = {
				action: actionType,
				property,
				value,
				...(targetContext ? { target_block: targetContext } : {}),
				message: suggestion === 'Remove'
					? `Removed ${spacingSide} ${spacingBase}.`
					: `Applied ${suggestion} ${spacingSide} ${spacingBase}.`,
			};
		}
		else if (spacingBase && suggestion === 'Remove') {
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			let property = spacingBase;
			if (spacingBase === 'padding' && targetContext === 'video') {
				property = 'video_padding';
			}
			directAction = {
				action: actionType,
				property,
				value: 0,
				...(targetContext ? { target_block: targetContext } : {}),
				message: `Removed ${spacingBase}.`,
			};
		}
		else if (targetContext === 'video' && ['Compact', 'Comfortable', 'Spacious'].includes(suggestion)) {
			const presetValue = {
				Compact: 60,
				Comfortable: 100,
				Spacious: 140,
			}[suggestion];
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';
			const message = scope === 'selection'
				? `Applied ${suggestion} top/bottom padding to the selected video.`
				: `Applied ${suggestion} top/bottom padding to all videos.`;

			directAction = {
				action: actionType,
				property: 'video_padding_vertical',
				value: presetValue,
				target_block: 'video',
				message,
			};
		}
		else if (['Compact', 'Comfortable', 'Spacious'].includes(suggestion)) {
			const preset = suggestion.toLowerCase();
			if (scope === 'selection') {
				directAction = {
					action: 'update_selection',
					property: 'responsive_padding',
					value: spacingPresets[suggestion],
					target_block: targetContext || 'container',
					message: `Applied ${suggestion} spacing across selected breakpoints.`,
				};
			} else {
				directAction = {
					action: 'apply_responsive_spacing',
					preset,
					target_block: targetContext || 'container',
					message: `Applied ${suggestion} spacing across all breakpoints.`,
				};
			}
		}

		// 3. SHADOW & GLOW - Handled by two-step flow (color selection ' style selection)
		// Old direct handlers removed - see section 9 for the new context-aware handler
		else if (suggestion === 'Brand Glow') directAction = { action: 'update_page', property: 'box_shadow', value: { x:0, y:10, blur:25, spread:-5, color: 'var(--highlight)' }, target_block: targetContext, message: 'Applied Brand Glow (using theme variable).' };

		// 4. THEME BORDERS - now respects targetContext
		else if (suggestion === 'Subtle Border') directAction = { action: 'update_page', property: 'border', value: { width: 1, style: 'solid', color: 'var(--p)' }, target_block: targetContext, message: targetContext ? `Applied Subtle Border to all ${targetContext}s.` : 'Applied Subtle Border.' };
		else if (suggestion === 'Strong Border') directAction = { action: 'update_page', property: 'border', value: { width: 3, style: 'solid', color: 'var(--h1)' }, target_block: targetContext, message: targetContext ? `Applied Strong Border to all ${targetContext}s.` : 'Applied Strong Border.' };
		else if (suggestion === 'Brand Border') directAction = { action: 'update_page', property: 'border', value: { width: 2, style: 'solid', color: 'var(--highlight)' }, target_block: targetContext, message: targetContext ? `Applied Brand Border to all ${targetContext}s.` : 'Applied Brand Border.' };

		// 5. GHOST BUTTON
		else if (suggestion === 'Ghost Button') directAction = { action: 'update_page', property: 'border', value: { width: 2, style: 'solid', color: 'var(--highlight)' }, message: 'Applied Ghost Button style.' }; // Note: Background transp handling requires complex logic or separate action. Keeping simple for now relative to border.

		// 6. MOBILE REVIEW
		else if (suggestion === 'Yes, show me' || suggestion === 'Display Mobile') directAction = { action: 'switch_viewport', value: 'Mobile', message: 'Switched to mobile view.' };


		// 7. PALETTE & CUSTOM COLOR SELECTION
		else if (/^Color .+$/.test(suggestion)) {
			// Extract ID part (can be number or string for custom)
			const idPart = suggestion.replace('Color ', '');
			
			let colorValue = null;
			let isPalette = false;

			// Check if standard palette 1-8
			const paletteNum = parseInt(idPart);
			// Check if it's strictly a number 1-8. If idPart is "custom-1", parseInt might be NaN or partial match.
			// Better check: is it a valid integer AND in range?
			if (!isNaN(paletteNum) && String(paletteNum) === idPart && paletteNum >= 1 && paletteNum <= 8) {
				colorValue = paletteNum;
				isPalette = true;
			} else {
				// Try to find in custom colors
				const customColor = customColors.find(c => String(c.id) === idPart);
				if (customColor) {
					colorValue = customColor.value; // Use the HEX/String value
				} else {
					console.warn('Maxi AI: Unknown color ID:', idPart);
					colorValue = 4; // Fallback to highlight
					isPalette = true;
				}
			}

			const prevMsg = messagesRef.current?.findLast(m => m.colorTarget);
			
			if (prevMsg?.colorTarget === 'border' || prevMsg?.colorTarget === 'button-border') {
				// Don't apply immediately - ask for border style preset
				setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
				setMessages(prev => [...prev, {
					role: 'assistant',
					content: 'Which border style?',
					options: ['Solid Thin', 'Solid Medium', 'Solid Fat', 'Dashed', 'Dotted'],
					borderColorChoice: colorValue,
					targetContext: prevMsg?.colorTarget === 'button-border' ? 'button' : prevMsg.targetContext,
					executed: false
				}]);
				return;
			} else if (prevMsg?.colorTarget === 'box-shadow') {
				// Don't apply immediately - ask for shadow style preset
				setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
				setMessages(prev => [...prev, {
					role: 'assistant',
					content: 'Which shadow style?',
					options: ['Soft', 'Crisp', 'Bold', 'Glow'],
					shadowColorChoice: colorValue,
					targetContext: prevMsg.targetContext,
					executed: false
				}]);
				return;
			} else {
				const target = prevMsg?.colorTarget;
				const colorUpdate = buildColorUpdate(target, colorValue, { selectedBlock });
				const actionType = scope === 'selection' ? 'update_selection' : 'update_page';

				directAction = { 
					action: actionType, 
					property: colorUpdate.property, 
					value: colorUpdate.value, 
					target_block: colorUpdate.targetBlock,
					message: `Applied ${isPalette ? 'Colour ' + colorValue : 'Custom Colour'} to ${colorUpdate.msgText}.` 
				};
			}
		}

		// ALIGNMENT OPTIONS
		else if (['Align Text', 'Align Items'].includes(suggestion)) {
			const prevMsg = messagesRef.current?.findLast(m => m.alignmentType);
			const alignVal = prevMsg?.alignmentType || 'center';
			
			if (suggestion === 'Align Text') {
				directAction = { action: 'update_page', property: 'text_align', value: alignVal, message: `Aligned all text ${alignVal}.` };
			} else {
				directAction = { action: 'update_page', property: 'align_items', value: alignVal, message: `Aligned all items ${alignVal}.` };
			}
		}
		else if (['Align Left', 'Align Center', 'Align Right'].includes(suggestion)) {
			const alignVal = suggestion.replace('Align ', '').toLowerCase();
			directAction = { action: 'update_page', property: 'align_everything', value: alignVal, message: `Aligned everything ${alignVal}.` };
		}

		// GAP SIZE PRESETS (from layout intent clarification)
		else if (suggestion === 'Small (10px)') {
			const prevMsg = messagesRef.current?.findLast(m => m.gapTarget);
			directAction = prevMsg?.gapTarget === 'selection'
				? { action: 'update_selection', property: 'gap', value: 10, message: 'Applied small gap (10px).' }
				: { action: 'update_page', property: 'gap', value: 10, target_block: 'container', message: 'Applied small gap (10px) to containers.' };
		}
		else if (suggestion === 'Medium (20px)') {
			const prevMsg = messagesRef.current?.findLast(m => m.gapTarget);
			directAction = prevMsg?.gapTarget === 'selection'
				? { action: 'update_selection', property: 'gap', value: 20, message: 'Applied medium gap (20px).' }
				: { action: 'update_page', property: 'gap', value: 20, target_block: 'container', message: 'Applied medium gap (20px) to containers.' };
		}
		else if (suggestion === 'Large (40px)') {
			const prevMsg = messagesRef.current?.findLast(m => m.gapTarget);
			directAction = prevMsg?.gapTarget === 'selection'
				? { action: 'update_selection', property: 'gap', value: 40, message: 'Applied large gap (40px).' }
				: { action: 'update_page', property: 'gap', value: 40, target_block: 'container', message: 'Applied large gap (40px) to containers.' };
		}

		// 8. BORDER STYLE PRESETS (Legacy handler for non-FSM flows)
		else if (['Solid Normal', 'Solid Fat', 'Dashed Normal', 'Dashed Fat', 'Dotted Normal', 'Dotted Fat', 'Solid Thin', 'Solid Medium', 'Dashed', 'Dotted'].includes(suggestion)) {
			// GUARD: If no active context and last message was "Done.", ignore this click
			// to prevent legacy handler from overriding FSM-applied styles with defaults
			const lastAssistantMsg = messagesRef.current?.findLast(m => m.role === 'assistant');
			if (lastAssistantMsg?.content === 'Done.' || lastAssistantMsg?.executed === true) {
				// Flow is complete, this is a stale option click - prompt user to start fresh
				setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
				setMessages(prev => [...prev, { 
					role: 'assistant', 
					content: 'The previous flow is complete. Say "outline buttons" to start a new border style flow!',
					executed: false 
				}]);
				return;
			}
			
			const prevMsg = messagesRef.current?.findLast(m => m.borderColorChoice !== undefined);
			const borderColor = prevMsg?.borderColorChoice || 1;
			const targetBlock = prevMsg?.targetContext;
			
			const styleMap = {
				'Solid Normal': { width: 1, style: 'solid' },
				'Solid Fat': { width: 4, style: 'solid' },
				'Dashed Normal': { width: 1, style: 'dashed' },
				'Dashed Fat': { width: 2, style: 'dashed' },
				'Dotted Normal': { width: 1, style: 'dotted' },
				'Dotted Fat': { width: 2, style: 'dotted' },
				// New simplified options
				'Solid Thin': { width: 1, style: 'solid' },
				'Solid Medium': { width: 2, style: 'solid' },
				'Dashed': { width: 2, style: 'dashed' },
				'Dotted': { width: 2, style: 'dotted' }
			};
			
			const style = styleMap[suggestion];
			
			// Context Recovery & Action Determination
			let finalTarget = targetBlock;
			let finalAction = scope === 'selection' ? 'update_selection' : 'update_page';

			// FAILSAFE: If context is lost (stale closure) for the Button Flow options, default to Page Button update
			// This prevents "Please select a block first" error when user is in Page tab but scope/context is stale
			if (!finalTarget && ['Solid Thin', 'Solid Medium', 'Solid Fat', 'Dashed', 'Dotted'].includes(suggestion)) {
				finalTarget = 'button';
				finalAction = 'update_page';
			}

			// Force update_page if target is button (Button Flow)
			if (finalTarget === 'button') finalAction = 'update_page';

			directAction = {
				action: finalAction,
				property: 'border',
				value: { ...style, color: borderColor },
				target_block: finalTarget,
				message: finalTarget ? `Applied ${suggestion} border to all ${finalTarget}s.` : `Applied ${suggestion} border.`
			};
		}

		// 9. SHADOW STYLE PRESETS - Only trigger if we have a shadow color choice in context
		else if (['Soft', 'Crisp', 'Bold', 'Glow'].includes(suggestion)) {
			const prevMsg = messagesRef.current?.findLast(m => m.shadowColorChoice !== undefined);
			// Only handle as shadow preset if we have shadow context
			if (prevMsg?.shadowColorChoice !== undefined) {
				const shadowColor = prevMsg.shadowColorChoice;
				const targetBlock = prevMsg?.targetContext;

			const styleMap = {
				Soft: { x: 0, y: 10, blur: 30, spread: 0 },
				Crisp: { x: 0, y: 2, blur: 4, spread: 0 },
				Bold: { x: 0, y: 20, blur: 25, spread: -5 },
				Glow: { x: 0, y: 0, blur: 15, spread: 2 },
			};

			const style = styleMap[suggestion];
			const actionType = scope === 'selection' ? 'update_selection' : 'update_page';

			directAction = {
				action: actionType,
				property: 'box_shadow',
				value: { ...style, color: shadowColor },
				target_block: targetBlock,
				message: targetBlock ? `Applied ${suggestion} shadow to all ${targetBlock}s.` : `Applied ${suggestion} shadow.`
			};
			} // Close inner if (prevMsg?.shadowColorChoice)
		} // Close else if (['Soft', 'Crisp', 'Bold', 'Glow'])

		// 10. ICON LINE WIDTH PRESETS
		else if (['Thin', 'Medium', 'Thick'].includes(suggestion)) {
			const prevMsg = messages.findLast(m => m.lineWidthTarget !== undefined);
			// Only handle as line width preset if we have line width context
			if (prevMsg?.lineWidthTarget === 'icon') {
				const widthMap = {
					'Thin': 1,
					'Medium': 1.9,
					'Thick': 4
				};
				const strokeWidth = widthMap[suggestion];
				directAction = {
					action: 'update_page',
					property: 'svg_stroke_width',
					value: strokeWidth,
					target_block: 'svg-icon',
					message: `Applied ${suggestion} line width to all icons.`
				};
			}
		}

		if (directAction && scope === 'selection') {
			// Convert Page actions to Selection actions if we are in Selection tab
			if (directAction.action === 'update_page' || directAction.action === 'apply_responsive_spacing') {
				directAction.action = 'update_selection';
				directAction.message = directAction.message.replace('all', 'selected').replace('page', 'selection');
			}
		}

		if (directAction) {
			// Add User Message immediately
			setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
			setInput(''); // Clear input if any
            
			// Execute Action with fake loading for UX
            setIsLoading(true);
            
			// Use small delay to allow UI to update
			setTimeout(async () => {
			    try {
					console.log('[Maxi AI Intercept] Executing direct action:', directAction);
					const result = await parseAndExecuteAction(directAction);
					
					// Determine options for success message
					let nextOptions = undefined;
					if (directAction.property === 'responsive_padding') nextOptions = ['Yes, show me', 'No, thanks'];
					
					// Add AI Message
					setMessages(prev => [...prev, { 
						role: 'assistant', 
						content: result.message, 
						options: nextOptions || result.options,
						optionsType: result.optionsType,
						executed: true 
					}]);
				} catch (e) {
					console.error('Direct action failed:', e);
					setMessages(prev => [...prev, { role: 'assistant', content: 'Error executing action.', isError: true }]);
				} finally {
					setIsLoading(false);
				}
            }, 600); 
			return;
		}

		// Fallback: submit chip text through the same pipeline as typing + Enter
		if (typeof suggestion === 'string' && suggestion.trim()) {
			void sendMessage(suggestion.trim());
		}
	};


	return {
		messages,
		input,
		setInput,
		isLoading,
		scope,
		sendMessage,
		handleKeyDown,
		handleSuggestion,
		handleUndo,
		handleScopeChange,
		showHistory,
		setShowHistory,
		chatHistory,
		loadChat,
		deleteHistoryItem,
		startNewChat,
		currentChatId,
		position,
		isDragging,
		handleMouseDown,
		selectedBlock,
		postTypeLabel,
		selectedBlockDisplayName,
		scopeChosen,
		setScopeChosen,
		getPaletteColors,
		customColors,
		messagesEndRef,
	};
};

export default useAiChat;
