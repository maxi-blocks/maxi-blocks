/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { createTransitionObj } from '@extensions/styles';
import getClientIdFromUniqueId from '@extensions/attributes/getClientIdFromUniqueId';
import getCleanResponseIBAttributes from '@extensions/relations/getCleanResponseIBAttributes';
import getIBStyles from '@extensions/relations/getIBStyles';
import getIBStylesObj from '@extensions/relations/getIBStylesObj';
import { getSelectedIBSettings } from '@extensions/relations/utils';
import { applyRelationsOps, ensureRelationDefaults } from '../ai/utils/relationsOps';
import { buildMetaAGroupAttributeChanges, resolveMetaTargetKey } from '../ai/utils/metaAGroup';
import {
	buildContainerOGroupAttributeChanges,
	buildContainerTGroupAttributeChanges,
} from '../ai/utils/containerGroups';
import { getBlockPrefix, matchesTargetBlockName } from '../ai/utils/blockHelpers';
import { applyUpdatesToBlocks as _applyUpdatesToBlocks } from '../ai/utils/applyUpdatesToBlocks';
import { removeBoxShadow, updateBorder, updateBorderRadius } from '../ai/utils/cssBuilders';

/** @type {Set<string>} Properties that map to the shape-divider container target. */
const SHAPE_DIVIDER_PROPERTIES = new Set([
	'shape_divider',
	'shape_divider_top',
	'shape_divider_bottom',
	'shape_divider_both',
	'shape_divider_color',
	'shape_divider_color_top',
	'shape_divider_color_bottom',
]);

/**
 * Forces targetBlock to 'container' for shape-divider properties.
 *
 * @param {string} property
 * @param {string|null} targetBlock
 * @returns {string|null}
 */
const normalizeTargetBlock = (property, targetBlock) =>
	SHAPE_DIVIDER_PROPERTIES.has(property) ? 'container' : targetBlock;

/**
 * Provides block update helpers for the AI chat panel.
 *
 * @param {Object}   args
 * @param {Object}   args.selectedBlock        Currently selected Gutenberg block.
 * @param {string}   args.scope                Current AI scope ('selection'|'page'|'global').
 * @param {Object}   args.registry             WordPress data registry (for batching).
 * @param {Function} args.updateBlockAttributes WP dispatch updateBlockAttributes.
 * @returns {{ handleUpdatePage: Function, handleUpdateSelection: Function, applyHoverAnimation: Function }}
 */
const useAiChatBlocks = ({ selectedBlock, scope, registry, updateBlockAttributes }) => {
	/** Partially applies shared args so callers only pass block-specific ones. */
	const applyUpdatesToBlocks = (blocksToUpdate, property, value, targetBlock = null, specificClientId = null) =>
		_applyUpdatesToBlocks(blocksToUpdate, property, value, targetBlock, specificClientId, updateBlockAttributes, scope);

	/**
	 * Applies attribute updates across all live root blocks on the page.
	 *
	 * @param {string}      property
	 * @param {*}           value
	 * @param {string|null} [targetBlock]
	 * @param {string|null} [clientId]
	 * @returns {string}
	 */
	const handleUpdatePage = (property, value, targetBlock = null, clientId = null) => {
		let count = 0;
		const normalizedTarget = normalizeTargetBlock(property, targetBlock);
		const liveBlocks = select('core/block-editor').getBlocks();
		registry.batch(() => {
			count = applyUpdatesToBlocks(liveBlocks, property, value, normalizedTarget, clientId);
		});
		return `Updated ${count} blocks on the page.`;
	};

	/**
	 * Applies attribute updates to the currently selected block (with IB / parent fallback support).
	 *
	 * @param {string}      property
	 * @param {*}           value
	 * @param {string|null} [targetBlock]
	 * @returns {string}
	 */
	const handleUpdateSelection = (property, value, targetBlock = null, { canvasScope = false } = {}) => {
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

		const fullSelectedBlock =
			select('core/block-editor').getBlock(selectedBlock.clientId) || selectedBlock;

		if (!select('core/block-editor').getBlock(selectedBlock.clientId)) {
			console.warn('[Maxi AI] Could not find full selected block in store. Using selectedBlock state as fallback.');
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
					select('core/block-editor').getBlockAttributes(targetClientId) || {};
				const selectedSettings = getSelectedIBSettings(targetClientId, rel.sid);
				if (!selectedSettings) return rel;

				const prefix = selectedSettings?.prefix || '';
				const { cleanAttributesObject, tempAttributes } = getCleanResponseIBAttributes(
					rel.attributes || {},
					targetBlockAttributes,
					rel.uniqueID,
					selectedSettings,
					'general',
					prefix,
					rel.sid,
					triggerBlock.clientId
				);

				const mergedAttributes = { ...cleanAttributesObject, ...tempAttributes };

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
					if (numeric > 0 && numeric <= 3) return Math.round(numeric * 10000) / 100;
					return Math.round(numeric * 100) / 100;
				};

				const inferTransformTargetFromAttributes = attrs => {
					if (!attrs || typeof attrs !== 'object') return null;
					const direct = attrs['transform-target'] || attrs['transform_target'];
					if (direct && direct !== 'none') return direct;
					const keyPattern =
						/^transform-(scale|translate|rotate|origin)-(general|xxl|xl|l|m|s|xs)$/;
					for (const [key, val] of Object.entries(attrs)) {
						if (!keyPattern.test(key)) continue;
						if (!val || typeof val !== 'object') continue;
						const candidates = Object.keys(val);
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
					if (rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)) {
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
							if (currentTarget && typeof currentTarget === 'object') {
								return { ...rawValue, [transformTarget]: { normal: currentTarget } };
							}
						}
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
						return { [transformTarget]: { normal: buildTransformEntry(type, rawValue) } };
					}
					return { [transformTarget]: { normal: buildTransformEntry(type, rawValue) } };
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

					Object.entries(rawAttributes).forEach(([key, rawValue]) => {
						const normalizedKey = String(key).replace(/-/g, '_').toLowerCase();

						if (normalizedKey === 'opacity_hover' && normalizedSid === 'o') {
							delete attrs[key];
							Object.assign(attrs, buildContainerOGroupAttributeChanges('opacity', rawValue) || {});
						}

						if (normalizedKey === 'opacity' && normalizedSid === 'o') {
							delete attrs[key];
							Object.assign(attrs, buildContainerOGroupAttributeChanges('opacity', rawValue) || {});
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
							const nextValue =
								rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
									? { ...rawValue, state: 'normal' }
									: rawValue;
							Object.assign(
								attrs,
								buildContainerTGroupAttributeChanges(baseKey, nextValue, {
									attributes: {
										...(fallbackAttributes || {}),
										'transform-target': guessedTransformTarget,
									},
								}) || {}
							);
						}
					});

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
							attrs[attrKey] = normalizeTransformAttributeValue(attrValue, type, transformTarget);
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
					const safeRelation = ensureRelationDefaults(relation, { isButtonDefault });
					const targetClientId = safeRelation.uniqueID
						? getClientIdFromUniqueId(safeRelation.uniqueID)
						: null;
					const targetBlockName = targetClientId
						? select('core/block-editor')?.getBlock?.(targetClientId)?.name
						: '';
					const targetBlockAttributes = targetClientId
						? select('core/block-editor')?.getBlockAttributes?.(targetClientId) || {}
						: {};
					safeRelation.attributes = normalizeIBRelationAttributes(safeRelation.attributes, {
						sid: safeRelation.sid,
						targetBlockName,
						fallbackAttributes: targetBlockAttributes,
					});
					const shouldRecompute =
						touchedIds.has(safeRelation.id) ||
						!safeRelation.css ||
						(typeof safeRelation.css === 'object' &&
							Object.keys(safeRelation.css).length === 0);
					return shouldRecompute ? recomputeRelationCss(safeRelation) : safeRelation;
				});

				registry.batch(() => {
					updateBlockAttributes(triggerBlock.clientId, { relations: recomputed });
				});

				return __('Updated Interaction Builder relations.', 'maxi-blocks');
			}

			if (normalizedProperty === 'relations') {
				const nextRelations = Array.isArray(value) ? value : [];
				const normalized = nextRelations.map(relation =>
					ensureRelationDefaults(relation, { isButtonDefault })
				);
				registry.batch(() => {
					updateBlockAttributes(triggerBlock.clientId, { relations: normalized });
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

		// When canvasScope is true the user targeted the block wrapper (canvas) directly.
		// Force prefix '' so we write canvas-level attributes (e.g. box-shadow-* instead of
		// button-box-shadow-*). Handle each removable property explicitly at the canvas level.
		if (canvasScope) {
			const block = blocksToProcess[0];
			let canvasChanges = null;

			if (normalizedProperty === 'box_shadow' && value === 'none') {
				canvasChanges = removeBoxShadow('');
			} else if (normalizedProperty === 'border' && value === 'none') {
				canvasChanges = updateBorder(0, 'none', null, '');
			} else if (normalizedProperty === 'border_radius') {
				canvasChanges = updateBorderRadius(value, null, '');
			}

			if (canvasChanges && block) {
				registry.batch(() => {
					updateBlockAttributes(block.clientId, canvasChanges);
				});
				count = 1;
			} else {
				// Canvas scope but unrecognised property — fall through to normal update
				registry.batch(() => {
					count = applyUpdatesToBlocks(blocksToProcess, property, value, normalizedTarget);
				});
			}
		} else {
			registry.batch(() => {
				count = applyUpdatesToBlocks(blocksToProcess, property, value, normalizedTarget);
			});
		}

		const selectedBlockIsMaxi = String(
			fullSelectedBlock?.name || selectedBlock?.name || ''
		).startsWith('maxi-blocks/');
		const isDirectBlockProperty =
			normalizedProperty === 'background_color' ||
			normalizedProperty === 'text_color' ||
			normalizedProperty === 'border' ||
			normalizedProperty === 'border_radius' ||
			normalizedProperty === 'box_shadow' ||
			normalizedProperty === 'padding' ||
			normalizedProperty === 'margin';
		const skipParentFallback = selectedBlockIsMaxi && isDirectBlockProperty;

		if (!skipParentFallback && count === 0 && (parentFallbackProps.has(property) || normalizedTarget)) {
			const { getBlockParents, getBlock } = select('core/block-editor');
			const parentIds = getBlockParents(selectedBlock.clientId) || [];
			const parentBlocks = parentIds.map(parentId => getBlock(parentId)).filter(Boolean);

			let fallbackParent = null;
			if (normalizedTarget) {
				fallbackParent = parentBlocks.find(parent =>
					matchesTargetBlockName(parent.name, normalizedTarget)
				);
			}

			if (
				!fallbackParent &&
				normalizedTarget &&
				String(normalizedTarget).toLowerCase() === 'container'
			) {
				fallbackParent = parentBlocks.find(
					parent =>
						parent &&
						(parent.name.includes('column') ||
							parent.name.includes('row') ||
							parent.name.includes('group') ||
							parent.name.includes('container'))
				);
			}

			if (!fallbackParent && parentFallbackProps.has(property)) {
				fallbackParent = parentBlocks.find(
					parent =>
						parent &&
						(parent.name.includes('column') ||
							parent.name.includes('row') ||
							parent.name.includes('group') ||
							parent.name.includes('container'))
				);
			}

			if (fallbackParent) {
				registry.batch(() => {
					count = applyUpdatesToBlocks(
						[fallbackParent],
						property,
						value,
						null,
						fallbackParent.clientId
					);
				});
				usedParentFallback = count > 0;
			}
		}

		if (count === 0) return __('No matching components found in selection.', 'maxi-blocks');
		if (usedParentFallback) return __('Updated the parent layout block.', 'maxi-blocks');
		return count === 1
			? __('Updated the selected block.', 'maxi-blocks')
			: `Updated ${count} items in the selection.`;
	};

	/**
	 * Builds hover-animation attribute patch for a block.
	 *
	 * @param {Object} currentAttributes Block's current attributes (unused; kept for API symmetry).
	 * @param {Object} shadowValue       Shadow config { x, y, blur, spread, color }.
	 * @returns {Object}
	 */
	const applyHoverAnimation = (currentAttributes, shadowValue) => {
		const transitionSettings = 'box-shadow 0.3s ease, transform 0.3s ease';
		const hoverTransform = 'translateY(-5px)';
		const prefix = getBlockPrefix(selectedBlock?.name || '');
		const { x = 0, y = 10, blur = 30, spread = 0, color = 'rgba(0,0,0,0.1)' } =
			typeof shadowValue === 'object' ? shadowValue : {};

		return {
			[`${prefix}box-shadow-general`]: 'none',
			[`${prefix}box-shadow-status-general`]: false,
			[`${prefix}transition-general`]: transitionSettings,
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

	return { handleUpdatePage, handleUpdateSelection, applyHoverAnimation };
};

export default useAiChatBlocks;
