/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import {
	AccordionControl,
	SettingTabsControl,
	VideoControl,
	VideoOptionsControl,
	VideoOverlayControl,
} from '../../components';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsVideo, categoriesVideo } from './custom-css';
import { getGroupAttributes } from '../../extensions/styles';

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
	const { blockStyle } = attributes;

	return (
		<InspectorControls>
			{inspectorTabs.responsiveInfoBox({ props })}
			<SettingTabsControl
				target='sidebar-settings-tabs'
				disablePadding
				deviceType={deviceType}
				depth={0}
				items={[
					{
						label: __('Settings', 'maxi-blocks'),
						content: (
							<>
								{inspectorTabs.blockSettings({
									props,
								})}
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
										{
											label: __(
												'Video overlay',
												'maxi-blocks'
											),
											content: (
												<VideoOverlayControl
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
														'overlay-'
													)}
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
										...inspectorTabs.border({
											props,
										}),
										...inspectorTabs.boxShadow({
											props,
										}),
										...inspectorTabs.size({
											props,
											block: true,
											disableWidth: true,
											disableMaxWidth: true,
										}),
										...inspectorTabs.marginPadding({
											props,
										}),
									]}
								/>
							</>
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
										selectors: selectorsVideo,
										categories: categoriesVideo,
									}),
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
										props,
									}),
									...inspectorTabs.display({
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
