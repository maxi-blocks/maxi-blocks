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
import { orderByRelations, orderRelations } from './constants';
import LoopContext from './loopContext';
import getDCOptions from './getDCOptions';
import getCLAttributes from './getCLAttributes';
import { getAttributesWithoutPrefix } from './utils';
import { isInSiteEditorPreviewIframe } from '@extensions/fse';

/**
 * External dependencies
 */
import { isNumber, merge, isEmpty } from 'lodash';

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

			let prevContextLoopAttributes = null;

			if (!attributes.isFirstOnHierarchy) {
				const context = useContext(LoopContext);

				if (context) prevContextLoopAttributes = context.contextLoop;
			}

			const contextLoopAttributes = useMemo(
				() => getGroupAttributes(attributes, 'contextLoop'),
				[attributes]
			);

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
						return prevAccumulator + currentBlockIndex;
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

					return prevAccumulator;
				};
			}, [
				attributes.isFirstOnHierarchy,
				clientId,
				contextLoopAttributes['cl-accumulator'],
				contextLoopAttributes['cl-relation'],
				name,
				prevContextLoopAttributes?.['cl-accumulator'],
				prevContextLoopAttributes?.['cl-status'],
			]);

			const contextLoop = useMemo(() => {
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

			const memoizedValue = useMemo(() => {
				return {
					contextLoop,
				};
			}, [contextLoop]);

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
				<LoopContext.Provider value={memoizedValue}>
					<WrappedComponent {...ownProps} />
				</LoopContext.Provider>
			);
		}),
	'withMaxiContextLoop'
);

export default withMaxiContextLoop;
