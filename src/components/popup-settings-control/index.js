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
import SelectControl from '../select-control';
import VideoIconControl from '../video-icon-control';

const PopupSettingsControl = props => {
	const { breakpoint, clientId, blockStyle, onChange, popAnimation } = props;

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
					['icon', 'iconHover'],
					false,
					'close-'
				)}
			/>
			<SelectControl
				label={__('Pop animation', 'maxi-blocks')}
				className='maxi-video-popup-control__pop-animation'
				value={popAnimation}
				options={[
					{
						label: __('None', 'maxi-blocks'),
						value: '',
					},
					{
						label: __('Zoom in', 'maxi-blocks'),
						value: 'zoom-in',
					},
					{
						label: __('Zoom out', 'maxi-blocks'),
						value: 'zoom-out',
					},
				]}
				onChange={val =>
					onChange({
						popAnimation: val,
					})
				}
			/>
		</>
	);
};

export default PopupSettingsControl;
