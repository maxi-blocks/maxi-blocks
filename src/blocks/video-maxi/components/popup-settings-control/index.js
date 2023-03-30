/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import VideoIconControl from '../video-icon-control';
import {
	SelectControl,
	ColorControl,
	AspectRatioControl,
} from '../../../../components';
import {
	getAttributeKey,
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../../../extensions/attributes';

const PopupSettingsControl = props => {
	const {
		breakpoint,
		clientId,
		blockStyle,
		onChange,
		popAnimation,
		popupRatio,
	} = props;

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
						[getAttributeKey(
							'_ps',
							false,
							'lightbox-background-',
							breakpoint
						)]: paletteStatus,
						[getAttributeKey(
							'_pc',
							false,
							'lightbox-background-',
							breakpoint
						)]: paletteColor,
						[getAttributeKey(
							'_po',
							false,
							'lightbox-background-',
							breakpoint
						)]: paletteOpacity,
						[getAttributeKey(
							'_cc',
							false,
							'lightbox-background-',
							breakpoint
						)]: color,
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
			<AspectRatioControl
				className='maxi-video-control__ratio'
				label={__('Video aspect ratio', 'maxi-blocks')}
				value={popupRatio}
				additionalOptions={[
					{
						label: __('None', 'maxi-blocks'),
						value: 'initial',
					},
				]}
				onChange={popupRatio => onChange({ popupRatio })}
				onReset={() =>
					onChange({
						popupRatio: getDefaultAttribute('popupRatio'),
						isReset: true,
					})
				}
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
			<VideoIconControl
				prefix='close-'
				type='video-icon-close'
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
		</>
	);
};

export default PopupSettingsControl;
