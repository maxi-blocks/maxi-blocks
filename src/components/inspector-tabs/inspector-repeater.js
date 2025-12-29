/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Suspense, lazy } from '@wordpress/element';
import Spinner from '@components/spinner';
const Repeater = lazy(() => import(/* webpackChunkName: "maxi-repeater-loop" */ '@components/repeater'));
import { getGroupAttributes } from '@extensions/styles';

const repeater = ({
	props: { attributes, clientId, deviceType, maxiSetAttributes },
	isRepeaterInherited,
	updateInnerBlocksPositions,
}) =>
	deviceType === 'general' && {
		label: __('Repeater', 'maxi-blocks'),
		content: () => (
			<Suspense fallback={<Spinner />}>
				<Repeater
					{...getGroupAttributes(attributes, 'repeater')}
					clientId={clientId}
					isRepeaterInherited={isRepeaterInherited}
					updateInnerBlocksPositions={updateInnerBlocksPositions}
					onChange={maxiSetAttributes}
				/>
			</Suspense>
		),
	};

export default repeater;
