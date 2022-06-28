/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
import ColorControl from '../color-control';
import VideoIconControl from '../video-icon-control';

const PopupSettingsControl = props => {
	const { breakpoint, clientId, blockStyle, onChange } = props;

	return (
		<>
			<ColorControl
				className='maxi-video-options-control__lightbox-colour'
				label={__('Lightbox background', 'maxi-blocks')}
				color={getLastBreakpointAttribute({
					target: 'lightbox-background-color',
					breakpoint,
					attributes: props,
				})}
				defaultColor={getDefaultAttribute(
					`lightbox-background-color-${breakpoint}`
				)}
				paletteStatus={getLastBreakpointAttribute({
					target: 'lightbox-background-palette-status',
					breakpoint,
					attributes: props,
				})}
				paletteColor={getLastBreakpointAttribute({
					target: 'lightbox-background-palette-color',
					breakpoint,
					attributes: props,
				})}
				paletteOpacity={getLastBreakpointAttribute({
					target: 'lightbox-background-palette-opacity',
					breakpoint,
					attributes: props,
				})}
				onChangeInline={() => null}
				onChange={({
					paletteColor,
					paletteStatus,
					paletteOpacity,
					color,
				}) => {
					onChange({
						[`lightbox-background-palette-status-${breakpoint}`]:
							paletteStatus,
						[`lightbox-background-palette-color-${breakpoint}`]:
							paletteColor,
						[`lightbox-background-palette-opacity-${breakpoint}`]:
							paletteOpacity,
						[`lightbox-background-color-${breakpoint}`]: color,
					});
				}}
				disableImage
				disableVideo
				disableGradient
				deviceType={breakpoint}
				clientId={clientId}
				globalProps={{
					target: 'lightbox',
				}}
			/>
			<VideoIconControl
				prefix='close-'
				label={__('Lightbox close button', 'maxi-blocks')}
				blockStyle={blockStyle}
				breakpoint={breakpoint}
				clientId={clientId}
				onChange={obj => onChange(obj)}
				{...getGroupAttributes(
					props,
					['icon', 'iconBackground', 'iconBackgroundColor'],
					false,
					'close-'
				)}
			/>
		</>
	);
};

export default PopupSettingsControl;
