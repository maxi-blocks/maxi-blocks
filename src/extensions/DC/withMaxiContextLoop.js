/**
 * WordPress dependencies
 */
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { select } from '@wordpress/data';
import { useContext, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../styles';
import { orderRelations } from './constants';
import LoopContext from './loopContext';

/**
 * External dependencies
 */
import { isNumber, merge } from 'lodash';

export const ALLOWED_ACCUMULATOR_PARENT_CHILD_MAP = {
	'maxi-blocks/row-maxi': 'maxi-blocks/column-maxi',
	'maxi-blocks/accordion-maxi': 'maxi-blocks/pane-maxi',
	'maxi-blocks/slider-maxi': 'maxi-blocks/slide-maxi',
};

const withMaxiContextLoop = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { attributes, clientId, name } = ownProps;

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

			return (
				<LoopContext.Provider value={memoizedValue}>
					<WrappedComponent {...ownProps} />{' '}
				</LoopContext.Provider>
			);
		}),
	'withMaxiContextLoop'
);

export default withMaxiContextLoop;
