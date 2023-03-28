/**
 * WordPress dependencies
 */
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useContext, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../styles';
import LoopContext from './loopContext';

/**
 * External dependencies
 */
import { merge } from 'lodash';

const withMaxiContextLoop = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { attributes } = ownProps;

			let prevContextLoopAttributes = null;

			if (ownProps.name !== 'maxi-blocks/container-maxi') {
				const context = useContext(LoopContext);

				prevContextLoopAttributes = context.contextLoop;
			}

			const contextLoopAttributes = getGroupAttributes(
				attributes,
				'contextLoop'
			);

			const contextLoop = merge(
				{},
				prevContextLoopAttributes,
				contextLoopAttributes
			);

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
