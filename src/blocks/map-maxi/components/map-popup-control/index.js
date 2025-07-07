/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BackgroundControl, BoxShadowControl } from '@components';
import { getGroupAttributes } from '@extensions/styles';

const MapPopupControl = props => {
	const { onChange, clientId, deviceType, ...attributes } = props;
	const prefix = 'popup-';

	return (
		<div className='maxi-map-popup-control'>
			<BackgroundControl
				{...getGroupAttributes(
					attributes,
					['background', 'backgroundColor'],
					false,
					prefix
				)}
				prefix={prefix}
				onChange={obj => onChange(obj)}
				disableNoneStyle
				disableImage
				disableGradient
				disableVideo
				disableSVG
				disableClipPath
				clientId={clientId}
				breakpoint={deviceType}
			/>
			<span className='maxi-map-popup-control-box-shadow-label'>
				{__('Box shadow', 'maxi-blocks')}
			</span>
			<BoxShadowControl
				{...getGroupAttributes(attributes, 'boxShadow', false, prefix)}
				prefix={prefix}
				onChange={obj => onChange(obj)}
				breakpoint={deviceType}
				clientId={clientId}
			/>
		</div>
	);
};

export default MapPopupControl;
