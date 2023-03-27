/**
 * WordPress dependencies
 */
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useContext, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../styles';

/**
 * External dependencies
 */
import LoopContext from './loopContext';

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

			// TODO: Needs logics, temporary
			const contextLoop = {
				...contextLoopAttributes,
				...prevContextLoopAttributes,
			};

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
