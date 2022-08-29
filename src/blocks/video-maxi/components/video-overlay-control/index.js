/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	ColorControl,
	ToggleSwitch,
	SettingTabsControl,
} from '../../../../components';
import {
	getAttributeKey,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';

const OverlayColor = props => {
	const {
		breakpoint,
		clientId,
		onChange,
		insertInlineStyles,
		inlineStylesTargets,
		cleanInlineStyles,
		isHover = false,
	} = props;

	return (
		<ColorControl
			className='maxi-video-overlay-control__overlay-background-colour'
			label={__('Overlay background', 'maxi-blocks')}
			color={getLastBreakpointAttribute({
				target: 'overlay-background-color',
				breakpoint,
				attributes: props,
				isHover,
			})}
			defaultColor={getDefaultAttribute(
				getAttributeKey(
					'overlay-background-color',
					isHover,
					'',
					breakpoint
				)
			)}
			paletteStatus={getLastBreakpointAttribute({
				target: 'overlay-background-palette-status',
				breakpoint,
				attributes: props,
				isHover,
			})}
			paletteColor={getLastBreakpointAttribute({
				target: 'overlay-background-palette-color',
				breakpoint,
				attributes: props,
				isHover,
			})}
			paletteOpacity={getLastBreakpointAttribute({
				target: 'overlay-background-palette-opacity',
				breakpoint,
				attributes: props,
				isHover,
			})}
			onChangeInline={({ color }) =>
				insertInlineStyles &&
				!isHover &&
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
					[getAttributeKey(
						'overlay-background-palette-status',
						isHover,
						'',
						breakpoint
					)]: paletteStatus,
					[getAttributeKey(
						'overlay-background-palette-color',
						isHover,
						'',
						breakpoint
					)]: paletteColor,
					[getAttributeKey(
						'overlay-background-palette-opacity',
						isHover,
						'',
						breakpoint
					)]: paletteOpacity,
					[getAttributeKey(
						'overlay-background-color',
						isHover,
						'',
						breakpoint
					)]: color,
				});
				cleanInlineStyles &&
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
			isHover={isHover}
		/>
	);
};

const VideoOverlayControl = props => {
	const {
		onChange,
		hideImage,
		disableHideImage = false,
		disableHover = false,
	} = props;

	return (
		<>
			{!disableHideImage && (
				<ToggleSwitch
					className='maxi-video-overlay-control__hide-image'
					label={__('Hide image(icon only)', 'maxi-blocks')}
					selected={hideImage}
					onChange={val => onChange({ hideImage: val })}
				/>
			)}
			{disableHover && <OverlayColor {...props} />}
			{!disableHover && (
				<SettingTabsControl
					depth={2}
					items={[
						{
							label: __('Normal state', 'maxi-blocks'),
							content: <OverlayColor {...props} />,
						},
						{
							label: __('Hover state', 'maxi-blocks'),
							content: (
								<>
									<ToggleSwitch
										label={__(
											'Enable hover',
											'maxi-blocks'
										)}
										selected={
											props[
												'overlay-background-hover-status'
											]
										}
										onChange={val =>
											onChange({
												'overlay-background-hover-status':
													val,
											})
										}
									/>
									{props[
										'overlay-background-hover-status'
									] && <OverlayColor {...props} isHover />}
								</>
							),
						},
					]}
				/>
			)}
		</>
	);
};

export default VideoOverlayControl;
