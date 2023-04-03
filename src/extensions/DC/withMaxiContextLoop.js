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
import getCLAttributes from './getCLAttributes';
import LoopContext from './loopContext';

/**
 * External dependencies
 */
import { merge } from 'lodash';

const withMaxiContextLoop = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { attributes, clientId } = ownProps;

			let prevContextLoopAttributes = null;

			if (!attributes.isFirstOnHierarchy) {
				const context = useContext(LoopContext);

				prevContextLoopAttributes = context.contextLoop;
			}

			const contextLoopAttributes = getGroupAttributes(
				attributes,
				'contextLoop'
			);

			const getAccumulator = () => {
				const isRelationHasAccumulator = [
					contextLoopAttributes,
					prevContextLoopAttributes,
				].some(attributes =>
					['by-date', 'alphabetical'].includes(
						attributes?.['cl-relation']
					)
				);

				const currentAccumulator =
					contextLoopAttributes?.['cl-accumulator'];
				if (currentAccumulator && isRelationHasAccumulator) {
					return currentAccumulator;
				}

				const prevContextLoopStatus =
					prevContextLoopAttributes?.['cl-status'];

				if (
					!prevContextLoopStatus ||
					attributes.isFirstOnHierarchy ||
					!isRelationHasAccumulator
				) {
					return 0;
				}

				const { getBlock, getBlockParents } =
					select('core/block-editor');
				const parent = getBlock(
					getBlockParents(clientId)
						.filter(id => id !== clientId)
						.at(-1)
				);

				if (!parent) {
					return 0;
				}

				const currentBlockIndex = parent.innerBlocks.findIndex(
					block => block.clientId === clientId
				);

				return (
					prevContextLoopAttributes['cl-accumulator'] +
					currentBlockIndex +
					1
				);
			};

			const contextLoop = getCLAttributes({
				...merge({}, prevContextLoopAttributes, contextLoopAttributes),
				'cl-accumulator': getAccumulator(),
			});

			const memoizedValue = useMemo(() => {
				return {
					contextLoop,
				};
			}, Object.values(contextLoop));

			return (
				<LoopContext.Provider value={memoizedValue}>
					<WrappedComponent {...ownProps} />{' '}
				</LoopContext.Provider>
			);
		}),
	'withMaxiContextLoop'
);

export default withMaxiContextLoop;
