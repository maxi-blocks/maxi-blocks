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
import { merge } from 'lodash';

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
					currentAccumulator &&
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

				const { name: parentOfParentName } = getBlock(
					getBlockParents(parent.clientId)
						.filter(id => id !== parent.clientId)
						.at(-1)
				);

				const isFirstOnHierarchyColumn =
					name === 'maxi-blocks/column-maxi' &&
					parentOfParentName === 'maxi-blocks/container-maxi';

				if (!isFirstOnHierarchyColumn || currentBlockIndex === 0) {
					return prevAccumulator;
				}

				return prevAccumulator + currentBlockIndex;
			};

			const contextLoop = {
				...merge({}, prevContextLoopAttributes, contextLoopAttributes),
				'cl-accumulator': getAccumulator(),
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
