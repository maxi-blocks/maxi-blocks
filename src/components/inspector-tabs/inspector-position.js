/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Suspense, lazy } from '@wordpress/element';
import Spinner from '@components/spinner';
const PositionControl = lazy(() => import(/* webpackChunkName: "maxi-position-layout" */ '@components/position-control'));
import { getGroupAttributes } from '@extensions/styles';

/**
 * Component
 */
const position = ({ props }) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	return {
		label: __('Position', 'maxi-blocks'),
		content: () => (
			<Suspense fallback={<Spinner />}>
				<PositionControl
					{...getGroupAttributes(attributes, 'position')}
					onChange={obj => maxiSetAttributes(obj)}
					breakpoint={deviceType}
				/>
			</Suspense>
		),
	};
};

export default position;
