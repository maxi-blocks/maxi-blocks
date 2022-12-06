/**
 * WordPress dependencies
 */
import { createHigherOrderComponent, pure } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { ResponsiveTabsControl } from '../../components';

const withRTC = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { disableRTC = false, ...otherProps } = ownProps;

			const component = <WrappedComponent {...otherProps} />;
			return disableRTC ? (
				component
			) : (
				<ResponsiveTabsControl>{component}</ResponsiveTabsControl>
			);
		}),
	'withMaxiProps'
);

export default withRTC;
