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
		_pan: popAnimation,
		_pra: popupRatio,
	} = props;

	return (
		<>
			<ColorControl
				className='maxi-video-options-control__lightbox-colour'
				label={__('Lightbox background', 'maxi-blocks')}
				color={getLastBreakpointAttribute({
					target: 'lb-bc_cc',
					breakpoint,
					attributes: props,
				})}
				defaultColor={getDefaultAttribute(`lb-bc_cc-${breakpoint}`)}
				paletteStatus={getLastBreakpointAttribute({
					target: 'lb-bc_ps',
					breakpoint,
					attributes: props,
				})}
				paletteColor={getLastBreakpointAttribute({
					target: 'lb-bc_pc',
					breakpoint,
					attributes: props,
				})}
				paletteOpacity={getLastBreakpointAttribute({
					target: 'lb-bc_po',
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
						[getAttributeKey({
							key: '_ps',
							prefix: 'lb-bc-',
							breakpoint,
						})]: paletteStatus,
						[getAttributeKey({
							key: '_pc',
							prefix: 'lb-bc-',
							breakpoint,
						})]: paletteColor,
						[getAttributeKey({
							key: '_po',
							prefix: 'lb-bc-',
							breakpoint,
						})]: paletteOpacity,
						[getAttributeKey({
							key: '_cc',
							prefix: 'lb-bc-',
							breakpoint,
						})]: color,
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
				onChange={popupRatio => onChange({ _pra: popupRatio })}
				onReset={() =>
					onChange({
						_pra: getDefaultAttribute('_pra'),
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
						_pan: val,
					})
				}
			/>
			<VideoIconControl
				prefix='cl-'
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
					'cl-'
				)}
			/>
		</>
	);
};

export default PopupSettingsControl;
