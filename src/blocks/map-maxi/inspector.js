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
import {
	AccordionControl,
	SettingTabsControl,
	FontLevelControl,
	TypographyControl,
	ToggleSwitch,
	MapControl,
} from '../../components';
import {
	MapMarkersControl,
	MapPopupsControl,
} from '../../components/map-control';
import { getGroupAttributes } from '../../extensions/styles';
import { selectorsMap, categoriesMap } from './custom-css';
import * as inspectorTabs from '../../components/inspector-tabs';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes,
		changeSVGContent,
		deviceType,
		maxiSetAttributes,
		clientId,
		parentBlockStyle,
	} = props;
	const { apiKey } = attributes;

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
											label: __(
												'Configure map',
												'maxi-blocks'
											),
											content: (
												<MapControl
													{...getGroupAttributes(
														attributes,
														'map'
													)}
													onChange={obj =>
														maxiSetAttributes(obj)
													}
													hasApiKey={!isEmpty(apiKey)}
												/>
											),
										},
										{
											label: __(
												'Map marker',
												'maxi-blocks'
											),
											content: (
												<MapMarkersControl
													{...getGroupAttributes(
														attributes,
														['map', 'svg']
													)}
													onChange={obj =>
														maxiSetAttributes(obj)
													}
													parentBlockStyle={
														parentBlockStyle
													}
													changeSVGContent={
														changeSVGContent
													}
													deviceType={deviceType}
												/>
											),
										},
										{
											label: __(
												'Marker pop-up text',
												'maxi-blocks'
											),
											content: (
												<>
													<SettingTabsControl
														items={[
															{
																label: __(
																	'Title',
																	'maxi-blocks'
																),
																content: (
																	<>
																		<span>
																			Marker
																			title
																			text
																		</span>
																		<FontLevelControl
																			{...getGroupAttributes(
																				attributes,
																				'map'
																			)}
																			value={
																				attributes[
																					'map-marker-heading-level'
																				]
																			}
																			onChange={obj => {
																				maxiSetAttributes(
																					{
																						'map-marker-heading-level':
																							obj.textLevel,
																					}
																				);
																			}}
																		/>
																		<TypographyControl
																			typography={{
																				...getGroupAttributes(
																					attributes,
																					'typography'
																				),
																			}}
																			onChange={obj => {
																				maxiSetAttributes(
																					obj
																				);
																			}}
																			textLevel={
																				attributes[
																					'map-marker-heading-level'
																				]
																			}
																			hideAlignment
																			clientId={
																				clientId
																			}
																			blockStyle={
																				parentBlockStyle
																			}
																			breakpoint={
																				deviceType
																			}
																		/>
																	</>
																),
															},
															{
																label: __(
																	'Description',
																	'maxi-blocks'
																),
																content: (
																	<>
																		<span>
																			Marker
																			description
																			text
																		</span>
																		<TypographyControl
																			typography={{
																				...getGroupAttributes(
																					attributes,
																					'typography',
																					false,
																					'description-'
																				),
																			}}
																			textLevel='p'
																			prefix='description-'
																			onChange={obj => {
																				maxiSetAttributes(
																					obj
																				);
																			}}
																			hideAlignment
																			clientId={
																				clientId
																			}
																			blockStyle={
																				parentBlockStyle
																			}
																			breakpoint={
																				deviceType
																			}
																		/>
																	</>
																),
															},
														]}
													/>
												</>
											),
										},
										{
											label: __(
												'Marker pop-up',
												'maxi-blocks'
											),
											content: (
												<>
													<MapPopupsControl
														onChange={obj =>
															maxiSetAttributes(
																obj
															)
														}
														parentBlockStyle={
															parentBlockStyle
														}
														deviceType={deviceType}
														changeSVGContent={
															changeSVGContent
														}
														clientId={clientId}
														attributes={attributes}
													/>
												</>
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
												<>
													<ToggleSwitch
														label={__(
															'Map dragging',
															'maxi-blocks'
														)}
														selected={
															attributes[
																'map-dragging'
															]
														}
														onChange={() => {
															maxiSetAttributes({
																'map-dragging':
																	!attributes[
																		'map-dragging'
																	],
															});
														}}
													/>
													<ToggleSwitch
														label={__(
															'Touch zoom',
															'maxi-blocks'
														)}
														selected={
															attributes[
																'map-touch-zoom'
															]
														}
														onChange={() => {
															maxiSetAttributes({
																'map-touch-zoom':
																	!attributes[
																		'map-touch-zoom'
																	],
															});
														}}
													/>
													<ToggleSwitch
														label={__(
															'Double click zoom',
															'maxi-blocks'
														)}
														selected={
															attributes[
																'map-double-click-zoom'
															]
														}
														onChange={() => {
															maxiSetAttributes({
																'map-double-click-zoom':
																	!attributes[
																		'map-double-click-zoom'
																	],
															});
														}}
													/>
													<ToggleSwitch
														label={__(
															'Scroll wheel zoom',
															'maxi-blocks'
														)}
														selected={
															attributes[
																'map-scroll-wheel-zoom'
															]
														}
														onChange={() => {
															maxiSetAttributes({
																'map-scroll-wheel-zoom':
																	!attributes[
																		'map-scroll-wheel-zoom'
																	],
															});
														}}
													/>
												</>
											),
										},
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
										selectors: selectorsMap,
										categories: categoriesMap,
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
