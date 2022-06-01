/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import VideoIconControl from '../video-icon-control';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getDefaultAttribute,
} from '../../extensions/styles';
import ColorControl from '../color-control';

const VideoOverlayControl = props => {
	const { blockStyle, breakpoint, clientId, onChange } = props;

	return (
		<>
			<ColorControl
				className='maxi-video-overlay-control__overlay-colour'
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
				// onChangeInline={({ color }) => {
				// 	onChangeInline &&
				// 		onChangeInline({
				// 			'border-color': color,
				// 		});
				// }}
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
			<VideoIconControl
				prefix='play-'
				label={__('Play icon', 'maxi-blocks')}
				blockStyle={blockStyle}
				breakpoint={breakpoint}
				clientId={clientId}
				onChange={obj => onChange(obj)}
				{...getGroupAttributes(
					props,
					['icon', 'iconBackground', 'iconBackgroundColor'],
					false,
					'play-'
				)}
			/>
		</>
	);
};

export default VideoOverlayControl;
