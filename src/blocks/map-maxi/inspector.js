/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import { AccordionControl, SettingTabsControl } from '@components';
import {
	MapControl,
	MapInteractionControl,
	MapMarkersControl,
	MapPopupControl,
	MapPopupTextControl,
} from './components';
import { getGroupAttributes } from '@extensions/styles';
import { ariaLabelsCategories, customCss } from './data';
import { withMaxiInspector } from '@extensions/inspector';
import * as inspectorTabs from '@components/inspector-tabs';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes,
		deviceType,
		clientId,
		apiKey,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
	} = props;
	const { blockStyle } = attributes;
	const { selectors, categories } = customCss;

	return (
		<InspectorControls>
			{inspectorTabs.repeaterInfoBox({ props })}
			{inspectorTabs.blockSettings({
				props,
			})}
			{inspectorTabs.repeaterInfoBox({ props })}
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
							<AccordionControl
								isPrimary
								items={[
									{
										label: __(
											'Configure map',
											'maxi-blocks'
										),
										content: (
											<MapControl
												{...{
													'map-provider':
														attributes[
															'map-provider'
														],
													'map-min-zoom':
														attributes[
															'map-min-zoom'
														],
													'map-max-zoom':
														attributes[
															'map-max-zoom'
														],
													'map-type':
														attributes['map-type'],
												}}
												onChange={obj =>
													maxiSetAttributes(obj)
												}
												hasApiKey={!isEmpty(apiKey)}
											/>
										),
									},
									{
										label: __('Map marker', 'maxi-blocks'),
										content: (
											<MapMarkersControl
												{...getGroupAttributes(
													attributes,
													'mapMarker'
												)}
												onChangeInline={obj =>
													insertInlineStyles({
														obj,
														target: 'path',
													})
												}
												onChange={obj => {
													maxiSetAttributes(obj);
													cleanInlineStyles('path');
												}}
												blockStyle={blockStyle}
												deviceType={deviceType}
											/>
										),
										ignoreIndicator: ['map-marker-icon'],
									},
									{
										label: __(
											'Marker pop-up text',
											'maxi-blocks'
										),
										content: (
											<MapPopupTextControl
												{...getGroupAttributes(
													attributes,
													'typography'
												)}
												{...getGroupAttributes(
													attributes,
													'typography',
													false,
													'description-'
												)}
												{...{
													'map-marker-heading-level':
														attributes[
															'map-marker-heading-level'
														],
												}}
												blockStyle={blockStyle}
												clientId={clientId}
												deviceType={deviceType}
												onChange={maxiSetAttributes}
												setShowLoader={
													props.setShowLoader
												}
											/>
										),
									},
									{
										label: __(
											'Marker pop-up',
											'maxi-blocks'
										),
										content: (
											<MapPopupControl
												{...getGroupAttributes(
													attributes,
													'mapPopup'
												)}
												onChange={obj =>
													maxiSetAttributes(obj)
												}
												blockStyle={blockStyle}
												deviceType={deviceType}
												clientId={clientId}
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
									}),
									...inspectorTabs.marginPadding({
										props,
									}),
									{
										label: __(
											'Map interaction',
											'maxi-blocks'
										),
										content: (
											<MapInteractionControl
												{...getGroupAttributes(
													attributes,
													'mapInteraction'
												)}
												onChange={maxiSetAttributes}
											/>
										),
									},
									...inspectorTabs.savedStyles({
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
									...inspectorTabs.ariaLabel({
										props,
										targets: ariaLabelsCategories,
										blockName: props.name,
									}),
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
									...inspectorTabs.advancedCss({
										props,
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
									...inspectorTabs.opacity({
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

export default withMaxiInspector(Inspector);
