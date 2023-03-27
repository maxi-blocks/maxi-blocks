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
	ResponsiveTabsControl,
	SelectControl,
	SettingTabsControl,
} from '../../components';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';
import { customCss } from './data';
import { withMaxiInspector } from '../../extensions/inspector';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes,
		deviceType,
		maxiSetAttributes,
		clientId,
		insertInlineStyles,
		cleanInlineStyles,
		inlineStylesTargets,
	} = props;
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
								isSecondary
								items={[
									{
										label: __('Alignment', 'maxi-blocks'),
										content: (
											<ResponsiveTabsControl
												breakpoint={deviceType}
											>
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
														defaultValue={getDefaultAttribute(
															`line-orientation-${deviceType}`
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
														onReset={() => {
															maxiSetAttributes({
																[`line-orientation-${deviceType}`]:
																	getDefaultAttribute(
																		`line-orientation-${deviceType}`
																	),
																isReset: true,
															});
														}}
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
														defaultValue={getDefaultAttribute(
															`line-vertical-${deviceType}`
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
														onReset={() => {
															maxiSetAttributes({
																[`line-vertical-${deviceType}`]:
																	getDefaultAttribute(
																		`line-vertical-${deviceType}`
																	),
																isReset: true,
															});
														}}
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
														defaultValue={getDefaultAttribute(
															`line-horizontal-${deviceType}`
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
														onReset={() =>
															maxiSetAttributes({
																[`line-horizontal-${deviceType}`]:
																	getDefaultAttribute(
																		`line-horizontal-${deviceType}`
																	),
																isReset: true,
															})
														}
													/>
												</>
											</ResponsiveTabsControl>
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
												onChangeInline={obj =>
													insertInlineStyles({
														obj,
														target: inlineStylesTargets.dividerColor,
													})
												}
												onChange={obj => {
													maxiSetAttributes(obj);
													cleanInlineStyles(
														inlineStylesTargets.dividerColor
													);
												}}
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
										disableInset: true,
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
