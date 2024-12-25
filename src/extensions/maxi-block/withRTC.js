/**
 * WordPress dependencies
 */
import { createHigherOrderComponent, pure } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { ResponsiveTabsControl } from '@components';

const withRTC = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { disableRTC = false, ...otherProps } = ownProps;

			return (
				<>
					{!disableRTC && <ResponsiveTabsControl />}
					<WrappedComponent {...otherProps} />
				</>
			);
		}),
	'withRTC'
);

export default withRTC;
