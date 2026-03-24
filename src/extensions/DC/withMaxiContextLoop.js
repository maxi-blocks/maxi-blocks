/**
 * WordPress dependencies
 */
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { dispatch, select } from '@wordpress/data';
import {
	useContext,
	useMemo,
	useEffect,
	useRef,
	useCallback,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '@extensions/styles';
import contextLoopSchema from '@extensions/styles/defaults/contextLoop';
import { orderByRelations, orderRelations } from './constants';
import LoopContext from './loopContext';
import getDCOptions from './getDCOptions';
import getCLAttributes from './getCLAttributes';
import { getAttributesWithoutPrefix } from './utils';
import {
	isInSiteEditorPreviewIframe,
	getIsSiteEditor,
} from '@extensions/fse';

/**
 * External dependencies
 */
import { isNumber, isEqual, merge, isEmpty, isPlainObject } from 'lodash';

// Map of CL attribute keys that have explicit schema defaults.
// Used to treat undefined and default-value as equivalent during stabilization,
// preventing spurious context cascade when Gutenberg fills in attribute defaults
// after block migration (e.g. cl-pagination: undefined → false).
const CL_SCHEMA_DEFAULTS = Object.fromEntries(
	Object.entries(contextLoopSchema)
		.filter(([, def]) => 'default' in def)
		.map(([k, def]) => [k, def.default])
);

/** Only these keys participate in context-loop snapshot equality (ignores merge cruft). */
const CONTEXT_LOOP_SNAPSHOT_KEYS = new Set([
	...Object.keys(contextLoopSchema),
	'cl-accumulator',
	'prevContextLoopStatus',
]);

const pickForContextLoopSnapshot = obj => {
	if (!obj || typeof obj !== 'object') return {};
	const out = {};
	for (const k of Object.keys(obj)) {
		if (CONTEXT_LOOP_SNAPSHOT_KEYS.has(k)) out[k] = obj[k];
	}
	return out;
};

/** Optional relation ids: editor alternates missing, 0, '', and numeric strings. */
const UNSETTABLE_CL_RELATION_ID_KEYS = new Set([
	'cl-id',
	'cl-author',
	'cl-acf-group',
]);

/**
 * Drop “unset” shapes that migrate/merge alternate with missing keys.
 */
const pruneUnsetLikeFromContextLoopSnap = snap => {
	if (!snap || typeof snap !== 'object') return snap;
	const out = { ...snap };
	for (const k of Object.keys(out)) {
		const v = out[k];
		if (v === '') {
			delete out[k];
			continue;
		}
		if (UNSETTABLE_CL_RELATION_ID_KEYS.has(k)) {
			if (v === null || v === undefined) {
				delete out[k];
				continue;
			}
			const n = Number(v);
			if (!Number.isFinite(n) || n === 0) {
				delete out[k];
				continue;
			}
			out[k] = n;
			continue;
		}
		if (Array.isArray(v) && v.length === 0) {
			delete out[k];
			continue;
		}
		if (isPlainObject(v) && isEmpty(v)) {
			delete out[k];
			continue;
		}
	}
	return out;
};

/**
 * Normalize CL attributes for stable comparison: keys whose value equals
 * the schema default are treated as if absent (undefined). This prevents
 * a re-render cascade when Gutenberg transitions attributes from undefined
 * to their explicit default after block migration.
 */
const normalizeCLAttrs = obj => {
	if (!obj) return obj;
	const result = {};
	for (const [k, v] of Object.entries(obj)) {
		// Treat null the same as undefined (both mean "not set")
		if (v === undefined || v === null) continue;
		// Omit values that equal the schema default
		if (k in CL_SCHEMA_DEFAULTS && isEqual(v, CL_SCHEMA_DEFAULTS[k]))
			continue;
		result[k] = v;
	}
	return result;
};

const EMPTY_NORM = {};

/**
 * After schema-default normalization, fold shapes that differ only by migration/merge
 * (e.g. cl-status missing vs false, prevContextLoopStatus absent vs false, unset
 * accumulator) so parent/merged context snapshots stay stable.
 */
const stabilizeContextLoopSnapshotForCompare = snap => {
	if (!snap || typeof snap !== 'object') return EMPTY_NORM;
	const out = { ...snap };
	if (!out['cl-status']) {
		delete out['cl-status'];
	}
	if (!out['prevContextLoopStatus']) {
		delete out['prevContextLoopStatus'];
	}
	const acc = out['cl-accumulator'];
	if (
		acc === null ||
		acc === undefined ||
		(typeof acc === 'number' && Number.isNaN(acc))
	) {
		delete out['cl-accumulator'];
	}
	return Object.keys(out).length ? out : EMPTY_NORM;
};

/**
 * Normalized + whitelisted + stabilized snapshot for Maps / prev cache.
 */
const normSnapFromContextLoopObject = raw =>
	stabilizeContextLoopSnapshotForCompare(
		pruneUnsetLikeFromContextLoopSnap(
			pickForContextLoopSnapshot(normalizeCLAttrs(raw) || {})
		)
	);

/**
 * Coerce parent accumulator for arithmetic; undefined + n is NaN and breaks
 * normalized context snapshots across renders.
 */
const safeAccumulatorBase = n =>
	isNumber(n) && !Number.isNaN(n) ? n : 0;

/**
 * Per-clientId caches so referential stability survives HOC remounts during
 * block migration (refs reset to null while clientId stays the same).
 * Intentionally no useEffect cleanup: React Strict Mode and migrator remounts
 * would clear entries and force new contextLoop / Provider value references
 * (duplicate [LoopContext.Provider updating] for the same block).
 * Stale rows are tiny; clientIds are not reused for different blocks.
 */
const stableCLGroupAttrsByClientId = new Map();
const stableContextLoopByClientId = new Map();
/**
 * Stable { contextLoop } reference per clientId so React Context does not see a new
 * value object on Strict Mode remount / instance remount when contextLoop ref is unchanged.
 */
const stableLoopProviderValueByClientId = new Map();
/** Parent contextLoop ref when norm snap matches (avoids rawContextLoop useMemo churn). */
const stablePrevLoopRefByClientId = new Map();
/** Merged raw contextLoop object when norm snap matches (same as emitted ref layer). */
const stableRawContextLoopByClientId = new Map();

export const ALLOWED_ACCUMULATOR_PARENT_CHILD_MAP = {
	'maxi-blocks/row-maxi': 'maxi-blocks/column-maxi',
	'maxi-blocks/accordion-maxi': 'maxi-blocks/pane-maxi',
	'maxi-blocks/slider-maxi': 'maxi-blocks/slide-maxi',
	'maxi-blocks/container-maxi': 'maxi-blocks/row-maxi',
	'maxi-blocks/column-maxi': 'maxi-blocks/row-maxi',
	'maxi-blocks/group-maxi': 'maxi-blocks/row-maxi',
};

export const ALLOWED_ACCUMULATOR_GRANDPARENT_GRANDCHILD_MAP = {
	'maxi-blocks/container-maxi': 'maxi-blocks/column-maxi',
	'maxi-blocks/column-maxi': 'maxi-blocks/column-maxi',
	'maxi-blocks/group-maxi': 'maxi-blocks/column-maxi',
};

export const CONTAINER_BLOCKS = [
	'maxi-blocks/container-maxi',
	'maxi-blocks/accordion-maxi',
	'maxi-blocks/group-maxi',
];

const withMaxiContextLoop = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			if (!ownProps) {
				return null;
			}
			const isPreview = isInSiteEditorPreviewIframe();

			if (isPreview) {
				// If in FSE preview mode, render the wrapped component without the LoopContext.Provider
				return <WrappedComponent {...ownProps} />;
			}
			const { attributes, clientId, name, setAttributes } = ownProps;

			// Always call useContext unconditionally (rules of hooks).
			// For isFirstOnHierarchy blocks there is no ancestor provider, so
			// this returns null/undefined and causes no extra re-renders.
			const loopContext = useContext(LoopContext);
			const rawPrevContextLoopAttributes =
				!attributes.isFirstOnHierarchy && loopContext
					? loopContext.contextLoop
					: null;

			// Reuse parent contextLoop ref when norm snap matches (same pipeline as
			// emitted). New parent object refs alone were invalidating rawContextLoop useMemo.
			let prevContextLoopAttributes;
			if (rawPrevContextLoopAttributes == null) {
				stablePrevLoopRefByClientId.delete(clientId);
				prevContextLoopAttributes = null;
			} else {
				const prevLoopSnap = normSnapFromContextLoopObject(
					rawPrevContextLoopAttributes
				);
				const cachedPrevLoop = stablePrevLoopRefByClientId.get(clientId);
				if (cachedPrevLoop && isEqual(cachedPrevLoop.snap, prevLoopSnap)) {
					prevContextLoopAttributes = cachedPrevLoop.ref;
				} else {
					stablePrevLoopRefByClientId.set(clientId, {
						snap: prevLoopSnap,
						ref: rawPrevContextLoopAttributes,
					});
					prevContextLoopAttributes = rawPrevContextLoopAttributes;
				}
			}

			// Referential stability for own CL group attrs: normalized snapshot +
			// clientId map (refs alone reset on remount during migrators).
			const freshContextLoopAttributes = getGroupAttributes(
				attributes,
				'contextLoop'
			);
			const normSnapOwn = normSnapFromContextLoopObject(
				freshContextLoopAttributes
			);
			const cachedGroup = stableCLGroupAttrsByClientId.get(clientId);
			let contextLoopAttributes;
			if (cachedGroup && isEqual(cachedGroup.snap, normSnapOwn)) {
				contextLoopAttributes = cachedGroup.groupAttrs;
			} else {
				stableCLGroupAttrsByClientId.set(clientId, {
					snap: normSnapOwn,
					groupAttrs: freshContextLoopAttributes,
				});
				contextLoopAttributes = freshContextLoopAttributes;
			}

			// Skip Provider for container blocks without Context Loop enabled (FSE only)
			// Check cheap conditions first, then only check FSE if needed
			if (
				attributes.isFirstOnHierarchy &&
				!contextLoopAttributes['cl-status'] &&
				CONTAINER_BLOCKS.includes(name) &&
				getIsSiteEditor()
			) {
				return <WrappedComponent {...ownProps} />;
			}

			const getIsAccumulator = attributes =>
				orderRelations.includes(attributes?.['cl-relation']) ||
				attributes?.['cl-relation']?.includes('custom-taxonomy') ||
				attributes?.['cl-relation'] === 'random';

			const getAccumulator = useMemo(() => {
				const isCurrentAccumulator = getIsAccumulator(
					contextLoopAttributes
				);
				const isPrevAccumulator = getIsAccumulator(
					prevContextLoopAttributes
				);

				return () => {
					const currentAccumulator =
						contextLoopAttributes?.['cl-accumulator'];
					if (
						isNumber(currentAccumulator) &&
						(isCurrentAccumulator || isPrevAccumulator)
					) {
						return currentAccumulator;
					}

					const prevContextLoopStatus =
						prevContextLoopAttributes?.['cl-status'];

					if (
						!prevContextLoopStatus ||
						attributes.isFirstOnHierarchy ||
						!isPrevAccumulator
					) {
						return null;
					}

					const { getBlock, getBlockParents } =
						select('core/block-editor');
					const parent = getBlock(
						getBlockParents(clientId)
							.filter(id => id !== clientId)
							.at(-1)
					);

					if (!parent) {
						return null;
					}

					const prevAccumulator =
						prevContextLoopAttributes?.['cl-accumulator'];

					const currentBlockIndex = parent.innerBlocks.findIndex(
						block => block.clientId === clientId
					);

					const grandparent = getBlock(
						getBlockParents(parent.clientId)
							.filter(id => id !== parent.clientId)
							.at(-1)
					);

					// Increase the accumulator only if context loop is enabled in the parent
					// And the grandchild accumulator is not enabled
					if (
						parent.attributes['cl-status'] &&
						!grandparent?.attributes['cl-grandchild-accumulator'] &&
						ALLOWED_ACCUMULATOR_PARENT_CHILD_MAP[parent.name] &&
						name ===
							ALLOWED_ACCUMULATOR_PARENT_CHILD_MAP[parent.name] &&
						currentBlockIndex !== 0
					) {
						return (
							safeAccumulatorBase(prevAccumulator) +
							currentBlockIndex
						);
					}

					const grandchildAllowed =
						grandparent &&
						ALLOWED_ACCUMULATOR_GRANDPARENT_GRANDCHILD_MAP[
							grandparent.name
						] === name;

					// Check if the current block is a valid grandchild
					if (grandchildAllowed) {
						const grandparentInnerBlocks = grandparent.innerBlocks;
						const parentIndex = grandparentInnerBlocks.findIndex(
							block => block.clientId === parent.clientId
						);

						const accumulatorOffset = grandparentInnerBlocks
							.slice(0, parentIndex)
							.reduce(
								(acc, block) => acc + block.innerBlocks.length,
								0
							);

						const currentBlockIndex = parent.innerBlocks.findIndex(
							block => block.clientId === clientId
						);

						// Check for valid grandchild
						if (
							grandparent.attributes['cl-grandchild-accumulator']
						) {
							return accumulatorOffset + currentBlockIndex;
						}
					}

					const fin = prevAccumulator;
					return isNumber(fin) && !Number.isNaN(fin) ? fin : null;
				};
			}, [
				attributes.isFirstOnHierarchy,
				clientId,
				contextLoopAttributes['cl-accumulator'],
				contextLoopAttributes['cl-relation'],
				name,
				prevContextLoopAttributes?.['cl-accumulator'],
				prevContextLoopAttributes?.['cl-status'],
				prevContextLoopAttributes?.['cl-relation'],
			]);

			const rawContextLoop = useMemo(() => {
				return {
					...merge(
						{},
						prevContextLoopAttributes,
						contextLoopAttributes
					),
					'cl-accumulator': getAccumulator(),
					prevContextLoopStatus:
						prevContextLoopAttributes?.['cl-status'],
				};
			}, [
				contextLoopAttributes,
				getAccumulator,
				prevContextLoopAttributes,
			]);

			const normMergeSnap =
				normSnapFromContextLoopObject(rawContextLoop);
			const cachedRawMerge = stableRawContextLoopByClientId.get(clientId);
			let rawForEmit = rawContextLoop;
			if (
				cachedRawMerge &&
				isEqual(cachedRawMerge.snap, normMergeSnap)
			) {
				rawForEmit = cachedRawMerge.raw;
			} else {
				stableRawContextLoopByClientId.set(clientId, {
					snap: normMergeSnap,
					raw: rawContextLoop,
				});
			}

			// Same normalized snapshot for merged contextLoop (merge + accumulator +
			// prevContextLoopStatus) so default-hydration does not swap the emitted
			// reference every migrator pass.
			const normSnapLoop = normMergeSnap;
			const cachedLoop = stableContextLoopByClientId.get(clientId);
			const didHitEmittedCache =
				!!(cachedLoop && isEqual(cachedLoop.snap, normSnapLoop));
			let contextLoop;
			if (didHitEmittedCache) {
				contextLoop = cachedLoop.contextLoop;
			} else {
				stableContextLoopByClientId.set(clientId, {
					snap: normSnapLoop,
					contextLoop: rawForEmit,
				});
				contextLoop = rawForEmit;
			}

			let loopProviderValue =
				stableLoopProviderValueByClientId.get(clientId);
			if (
				!loopProviderValue ||
				loopProviderValue.contextLoop !== contextLoop
			) {
				loopProviderValue = { contextLoop };
				stableLoopProviderValueByClientId.set(
					clientId,
					loopProviderValue
				);
			}

			const wasRelationValidated = useRef(false);
			const prevRelation = useRef(null);
			const prevRelationId = useRef(null);

			const updateRelationIds = useCallback(async () => {
				const dataRequest = getAttributesWithoutPrefix(
					getCLAttributes(contextLoopAttributes),
					'cl-'
				);

				// Add previousRelation parameter
				dataRequest.previousRelation = dataRequest.relation;

				const { newValues } =
					(await getDCOptions(
						dataRequest,
						contextLoopAttributes['cl-id'],
						null,
						true,
						{
							'cl-status': contextLoopAttributes['cl-status'],
							'cl-pagination-per-page':
								contextLoopAttributes['cl-pagination-per-page'],
						}
					)) ?? {};

				if (!isEmpty(newValues)) {
					const {
						__unstableMarkNextChangeAsNotPersistent:
							markNextChangeAsNotPersistent,
					} = dispatch('core/block-editor');

					markNextChangeAsNotPersistent();
					setAttributes(newValues);
				}

				wasRelationValidated.current = true;
			}, [contextLoopAttributes, setAttributes]);

			useEffect(() => {
				const currentRelation = contextLoopAttributes['cl-relation'];
				const currentRelationId = contextLoopAttributes['cl-id'];

				if (
					!wasRelationValidated.current &&
					orderByRelations.includes(currentRelation) &&
					(currentRelation !== prevRelation.current ||
						currentRelationId !== prevRelationId.current)
				) {
					updateRelationIds();
				}

				prevRelation.current = currentRelation;
				prevRelationId.current = currentRelationId;
			}, [
				contextLoopAttributes['cl-relation'],
				contextLoopAttributes['cl-id'],
				orderByRelations,
				updateRelationIds,
			]);

			return (
				<LoopContext.Provider value={loopProviderValue}>
					<WrappedComponent {...ownProps} />
				</LoopContext.Provider>
			);
		}),
	'withMaxiContextLoop'
);

export default withMaxiContextLoop;
