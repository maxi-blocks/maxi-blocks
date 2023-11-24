/**
 * WordPress dependencies
 */
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { dispatch, select } from '@wordpress/data';
import { useContext, useMemo, useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../styles';
import { orderByRelations, orderRelations } from './constants';
import LoopContext from './loopContext';
import getDCOptions from './getDCOptions';
import getCLAttributes from './getCLAttributes';
import { getAttributesWithoutPrefix } from './utils';

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
			const { attributes, clientId, name, setAttributes } = ownProps;

			let prevContextLoopAttributes = null;

			if (!attributes.isFirstOnHierarchy) {
				const context = useContext(LoopContext);

				if (context) prevContextLoopAttributes = context.contextLoop;
			}

			const contextLoopAttributes = getGroupAttributes(
				attributes,
				'contextLoop'
			);

			const getAccumulator = () => {
				const getIsAccumulator = attributes =>
					orderRelations.includes(attributes?.['cl-relation']);

				const isCurrentAccumulator = getIsAccumulator(
					contextLoopAttributes
				);
				const isPrevAccumulator = getIsAccumulator(
					prevContextLoopAttributes
				);

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

				// Increase the accumulator only if context loop is enabled in the parent
				if (
					parent.attributes['cl-status'] &&
					ALLOWED_ACCUMULATOR_PARENT_CHILD_MAP[parent.name] &&
					name ===
						ALLOWED_ACCUMULATOR_PARENT_CHILD_MAP[parent.name] &&
					currentBlockIndex !== 0
				) {
					return prevAccumulator + currentBlockIndex;
				}

				const grandparent = getBlock(
					getBlockParents(parent.clientId)
						.filter(id => id !== parent.clientId)
						.at(-1)
				);

				if (!grandparent) {
					return prevAccumulator;
				}

				const grandchildAllowed =
					ALLOWED_ACCUMULATOR_GRANDPARENT_GRANDCHILD_MAP[
						grandparent.name
					] === name;

				// Check if the current block is a valid grandchild
				if (grandchildAllowed) {
					const grandparentInnerBlocks = grandparent.innerBlocks;
					const parentIndex = grandparentInnerBlocks.findIndex(
						block => block.clientId === parent.clientId
					);
					const currentBlockIndex = parent.innerBlocks.findIndex(
						block => block.clientId === clientId
					);

					// Calculate the accumulator based on the position of the grandparent and parent
					const accumulatorOffset = grandparentInnerBlocks
						.slice(0, parentIndex)
						.reduce(
							(acc, block) => acc + block.innerBlocks.length,
							0
						);

					return (
						prevAccumulator + accumulatorOffset + currentBlockIndex
					);
				}

				return prevAccumulator;
			};

			const contextLoop = {
				...merge({}, prevContextLoopAttributes, contextLoopAttributes),
				'cl-accumulator': getAccumulator(),
				prevContextLoopStatus: prevContextLoopAttributes?.['cl-status'],
			};

			const memoizedValue = useMemo(() => {
				return {
					contextLoop,
				};
			}, [contextLoop]);

			const wasRelationValidated = useRef(false);
			// Check if category or tag by which the post is filtered exists
			useEffect(() => {
				if (
					wasRelationValidated.current ||
					!orderByRelations.includes(
						contextLoopAttributes['cl-relation']
					)
				)
					return () => null;

				let isCancelled = false;

				const updateRelationIds = async () => {
					const dataRequest = getAttributesWithoutPrefix(
						getCLAttributes(contextLoopAttributes),
						'cl-'
					);

					const { newValues } =
						(await getDCOptions(
							dataRequest,
							contextLoopAttributes['cl-id'],
							null,
							true
						)) ?? {};

					if (!isEmpty(newValues) && !isCancelled) {
						const {
							__unstableMarkNextChangeAsNotPersistent:
								markNextChangeAsNotPersistent,
						} = dispatch('core/block-editor');

						markNextChangeAsNotPersistent();
						setAttributes(newValues);
					}

					wasRelationValidated.current = true;
				};

				updateRelationIds();

				return () => {
					isCancelled = true;
				};
			}, [setAttributes, contextLoopAttributes]);

			return (
				<LoopContext.Provider value={memoizedValue}>
					<WrappedComponent {...ownProps} />{' '}
				</LoopContext.Provider>
			);
		}),
	'withMaxiContextLoop'
);

export default withMaxiContextLoop;
