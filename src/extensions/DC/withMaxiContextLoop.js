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

/**
 * External dependencies
 */
import { merge, isEmpty } from 'lodash';

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

				if (
					[
						'maxi-blocks/accordion-maxi',
						'maxi-blocks/slider-maxi',
					].includes(parent.name) &&
					[
						'maxi-blocks/pane-maxi',
						'maxi-blocks/slide-maxi',
					].includes(name)
				) {
					const isParentAccumulator = getIsAccumulator(
						parent.attributes
					);
					// Increase the accumulator only if context loop is enabled in the parent
					if (isParentAccumulator && currentBlockIndex !== 0) {
						return prevAccumulator + currentBlockIndex;
					}

					return prevAccumulator;
				}

				const { name: parentOfParentName } =
					getBlock(
						getBlockParents(parent.clientId)
							.filter(id => id !== parent.clientId)
							.at(-1)
					) ?? {};

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

			const wasRelationValidated = useRef(false);
			// Check if category or tag by which the post is filtered exists
			useEffect(() => {
				if (
					wasRelationValidated.current ||
					!orderByRelations.includes(
						memoizedValue.contextLoop['cl-relation']
					)
				)
					return () => null;

				let isCancelled = false;

				const updateRelationIds = async () => {
					const dataRequest = Object.fromEntries(
						Object.entries(
							getCLAttributes(memoizedValue.contextLoop)
						).map(([key, value]) => [key.replace('cl-', ''), value])
					);

					const { newValues } =
						(await getDCOptions(
							dataRequest,
							memoizedValue.contextLoop['cl-id'],
							undefined,
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
			}, [setAttributes, memoizedValue]);

			return (
				<LoopContext.Provider value={memoizedValue}>
					<WrappedComponent {...ownProps} />{' '}
				</LoopContext.Provider>
			);
		}),
	'withMaxiContextLoop'
);

export default withMaxiContextLoop;
