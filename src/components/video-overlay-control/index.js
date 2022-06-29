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
} from '../../extensions/styles';
import ColorControl from '../color-control';
import ToggleSwitch from '../toggle-switch';

const VideoOverlayControl = props => {
	const {
		breakpoint,
		clientId,
		onChange,
		insertInlineStyles,
		inlineStylesTargets,
		cleanInlineStyles,
		hideImage,
	} = props;

	return (
		<>
			<ToggleSwitch
				className='maxi-video-overlay-control__hide-image'
				label={__('Hide image(icon only)', 'maxi-blocks')}
				selected={hideImage}
				onChange={val => onChange({ hideImage: val })}
			/>
			<ColorControl
				className='maxi-video-overlay-control__overlay-background-colour'
				label={__('Overlay background', 'maxi-blocks')}
				color={getLastBreakpointAttribute({
					target: 'overlay-background-color',
					breakpoint,
					attributes: props,
				})}
				defaultColor={getDefaultAttribute(
					`overlay-background-color-${breakpoint}`
				)}
				paletteStatus={getLastBreakpointAttribute({
					target: 'overlay-background-palette-status',
					breakpoint,
					attributes: props,
				})}
				paletteColor={getLastBreakpointAttribute({
					target: 'overlay-background-palette-color',
					breakpoint,
					attributes: props,
				})}
				paletteOpacity={getLastBreakpointAttribute({
					target: 'overlay-background-palette-opacity',
					breakpoint,
					attributes: props,
				})}
				onChangeInline={({ color }) =>
					insertInlineStyles({
						obj: {
							background: color,
						},
						target: inlineStylesTargets.overlay,
					})
				}
				onChange={({
					paletteColor,
					paletteStatus,
					paletteOpacity,
					color,
				}) => {
					onChange({
						[`overlay-background-palette-status-${breakpoint}`]:
							paletteStatus,
						[`overlay-background-palette-color-${breakpoint}`]:
							paletteColor,
						[`overlay-background-palette-opacity-${breakpoint}`]:
							paletteOpacity,
						[`overlay-background-color-${breakpoint}`]: color,
					});
					cleanInlineStyles(inlineStylesTargets.overlay);
				}}
				disableImage
				disableVideo
				disableGradient
				deviceType={breakpoint}
				clientId={clientId}
				globalProps={{
					target: 'overlay',
				}}
			/>
		</>
	);
};

export default VideoOverlayControl;
