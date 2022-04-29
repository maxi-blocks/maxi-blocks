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
	DividerControl,
	SelectControl,
	SettingTabsControl,
} from '../../components';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsDivider, categoriesDivider } from './custom-css';
import { withMaxiInspector } from '../../extensions/inspector';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, maxiSetAttributes, clientId } = props;
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
									isSecondary
									items={[
										{
											label: __(
												'Alignment',
												'maxi-blocks'
											),
											content: (
												<>
													<SelectControl
														label={__(
															'Line orientation',
															'maxi-blocks'
														)}
														className='line-orientation-selector'
														value={getLastBreakpointAttribute(
															{
																target: 'line-orientation',
																breakpoint:
																	deviceType,
																attributes,
															}
														)}
														options={[
															{
																label: __(
																	'Horizontal',
																	'maxi-blocks'
																),
																value: 'horizontal',
															},
															{
																label: __(
																	'Vertical',
																	'maxi-blocks'
																),
																value: 'vertical',
															},
														]}
														onChange={val =>
															maxiSetAttributes({
																[`line-orientation-${deviceType}`]:
																	val,
															})
														}
													/>
													<SelectControl
														label={__(
															'Line vertical position',
															'maxi-blocks'
														)}
														value={getLastBreakpointAttribute(
															{
																target: 'line-vertical',
																breakpoint:
																	deviceType,
																attributes,
															}
														)}
														options={[
															{
																label: __(
																	'Top',
																	'maxi-blocks'
																),
																value: 'flex-start',
															},
															{
																label: __(
																	'Center',
																	'maxi-blocks'
																),
																value: 'center',
															},
															{
																label: __(
																	'Bottom',
																	'maxi-blocks'
																),
																value: 'flex-end',
															},
														]}
														onChange={val =>
															maxiSetAttributes({
																[`line-vertical-${deviceType}`]:
																	val,
															})
														}
													/>
													<SelectControl
														label={__(
															'Line horizontal position',
															'maxi-blocks'
														)}
														value={getLastBreakpointAttribute(
															{
																target: 'line-horizontal',
																breakpoint:
																	deviceType,
																attributes,
															}
														)}
														options={[
															{
																label: __(
																	'Left',
																	'maxi-blocks'
																),
																value: 'flex-start',
															},
															{
																label: __(
																	'Center',
																	'maxi-blocks'
																),
																value: 'center',
															},
															{
																label: __(
																	'Right',
																	'maxi-blocks'
																),
																value: 'flex-end',
															},
														]}
														onChange={val =>
															maxiSetAttributes({
																[`line-horizontal-${deviceType}`]:
																	val,
															})
														}
													/>
												</>
											),
											extraIndicators: [
												`line-horizontal-${deviceType}`,
												`line-vertical-${deviceType}`,
												`line-orientation-${deviceType}`,
											],
										},
										{
											label: __(
												'Line settings',
												'maxi-blocks'
											),
											content: (
												<DividerControl
													{...getGroupAttributes(
														attributes,
														['divider', 'size']
													)}
													onChange={obj =>
														maxiSetAttributes(obj)
													}
													breakpoint={deviceType}
													clientId={clientId}
												/>
											),
											ignoreIndicator: [
												`line-horizontal-${deviceType}`,
												`line-vertical-${deviceType}`,
												`line-orientation-${deviceType}`,
											],
										},
										...inspectorTabs.boxShadow({
											props,
											prefix: 'divider-',
										}),
									]}
								/>
							</>
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
									...inspectorTabs.opacity({
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
										selectors: selectorsDivider,
										categories: categoriesDivider,
									}),
									...inspectorTabs.scrollEffects({
										props,
									}),
									...inspectorTabs.transform({
										props,
									}),
									...inspectorTabs.transition({
										props: {
											...props,
										},
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

export default withMaxiInspector(Inspector);
