/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { AccordionControl, SettingTabsControl } from '../../components';
import * as inspectorTabs from '../../components/inspector-tabs';
import { customCss } from './data';
import { getGroupAttributes } from '../../extensions/styles';
import {
	PopupSettingsControl,
	VideoControl,
	VideoIconControl,
	VideoOptionsControl,
	VideoOverlayControl,
} from './components';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		deviceType,
		attributes,
		maxiSetAttributes,
		clientId,
		insertInlineStyles,
		cleanInlineStyles,
		inlineStylesTargets,
	} = props;
	const {
		blockStyle,
		playerType,
		'overlay-mediaID': overlayMediaId,
		'overlay-altSelector': overlayAltSelector,
	} = attributes;
	const { selectors, categories } = customCss;

	return (
		<InspectorControls>
			{inspectorTabs.responsiveInfoBox({ props })}
			{inspectorTabs.blockSettings({
				props,
			})}
			<SettingTabsControl
				target='sidebar-settings-tabs'
				disablePadding
				deviceType={deviceType}
				depth={0}
				items={[
					{
						label: __('Settings', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
								items={[
									{
										label: __('Video', 'maxi-blocks'),
										content: (
											<VideoControl
												{...getGroupAttributes(
													attributes,
													'video'
												)}
												onChange={obj =>
													maxiSetAttributes(obj)
												}
											/>
										),
									},
									{
										label: __(
											'Video options',
											'maxi-blocks'
										),
										content: (
											<VideoOptionsControl
												{...getGroupAttributes(
													attributes,
													'video'
												)}
												{...getGroupAttributes(
													attributes,
													[
														'background',
														'backgroundColor',
													],
													false,
													'lightbox-'
												)}
												onChange={obj =>
													maxiSetAttributes(obj)
												}
												breakpoint={deviceType}
												clientId={clientId}
												blockStyle={blockStyle}
											/>
										),
									},
									...(playerType === 'popup' && [
										{
											label: __(
												'Popup settings',
												'maxi-blocks'
											),
											content: (
												<PopupSettingsControl
													{...getGroupAttributes(
														attributes,
														['video', 'videoPopup']
													)}
													breakpoint={deviceType}
													clientId={clientId}
													blockStyle={blockStyle}
													onChange={obj =>
														maxiSetAttributes(obj)
													}
												/>
											),
										},
										{
											label: __(
												'Playback icon',
												'maxi-blocks'
											),
											content: (
												<VideoIconControl
													prefix='play-'
													type='video-icon-play'
													label={__(
														'Play icon',
														'maxi-blocks'
													)}
													blockStyle={blockStyle}
													breakpoint={deviceType}
													clientId={clientId}
													onChangeInline={obj =>
														insertInlineStyles({
															obj,
															target: inlineStylesTargets.playIcon,
														})
													}
													onChange={obj => {
														maxiSetAttributes(obj);
														cleanInlineStyles(
															inlineStylesTargets.playIcon
														);
													}}
													{...getGroupAttributes(
														attributes,
														['icon', 'iconHover'],
														false,
														'play-'
													)}
												/>
											),
										},
										{
											label: __('Image', 'maxi-blocks'),
											content: (
												<VideoOverlayControl
													{...getGroupAttributes(
														attributes,
														[
															'video',
															'videoOverlay',
														]
													)}
													mediaID={overlayMediaId}
													altSelector={
														overlayAltSelector
													}
													inlineStylesTargets={
														inlineStylesTargets
													}
													insertInlineStyles={
														insertInlineStyles
													}
													cleanInlineStyles={
														cleanInlineStyles
													}
													onChange={obj =>
														maxiSetAttributes(obj)
													}
													breakpoint={deviceType}
													clientId={clientId}
													blockStyle={blockStyle}
												/>
											),
										},
									]),
									...inspectorTabs.border({
										props,
										prefix: 'video-',
									}),
									...inspectorTabs.boxShadow({
										props,
										prefix: 'video-',
									}),
									...inspectorTabs.size({
										props,
										hideFullWidth: true,
										prefix: 'video-',
									}),
									...inspectorTabs.marginPadding({
										props,
										prefix: 'video-',
										customLabel: __(
											'Padding',
											'maxi-blocks'
										),
										disableMargin: true,
									}),
								]}
							/>
						),
					},
					{
						label: __('Canvas', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
								items={[
									...inspectorTabs.blockBackground({
										props,
									}),
									...inspectorTabs.border({
										props,
									}),
									...inspectorTabs.boxShadow({
										props,
									}),
									...inspectorTabs.size({
										props,
										block: true,
									}),
									...inspectorTabs.marginPadding({
										props,
									}),
								]}
							/>
						),
					},
					{
						label: __('Advanced', 'maxi-blocks'),
						content: (
							<AccordionControl
								isPrimary
								items={[
									deviceType === 'general' && {
										...inspectorTabs.customClasses({
											props,
										}),
									},
									deviceType === 'general' && {
										...inspectorTabs.anchor({
											props,
										}),
									},
									...inspectorTabs.customCss({
										props,
										breakpoint: deviceType,
										selectors,
										categories,
									}),
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
										props,
										selectors,
										categories,
									}),
									...inspectorTabs.transition({
										props: {
											...props,
										},
										selectors,
									}),
									...inspectorTabs.display({
										props,
									}),
									...inspectorTabs.position({
										props,
									}),
									deviceType !== 'general' && {
										...inspectorTabs.responsive({
											props,
										}),
									},
									...inspectorTabs.opacity({
										props,
									}),
									...inspectorTabs.overflow({
										props,
									}),
									...inspectorTabs.flex({
										props,
									}),
									...inspectorTabs.zindex({
										props,
									}),
									...inspectorTabs.relation({
										props,
									}),
								]}
							/>
						),
					},
				]}
			/>
		</InspectorControls>
	);
};

export default Inspector;
