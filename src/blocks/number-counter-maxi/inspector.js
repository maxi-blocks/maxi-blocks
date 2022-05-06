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
	NumberCounterControl,
	SettingTabsControl,
} from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';
import { selectorsNumberCounter, categoriesNumberCounter } from './custom-css';
import ResponsiveTabsControl from '../../components/responsive-tabs-control';
import { withMaxiInspector } from '../../extensions/inspector';

/**
 * Inspector
 */
const Inspector = props => {
	const {
		attributes,
		deviceType,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
	} = props;

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
										...inspectorTabs.alignment({
											props: {
												...props,
											},
											isAlignment: true,
											alignmentLabel: __(
												'Counter',
												'maxi-blocks'
											),
											disableJustify: true,
										}),
										{
											label: __('Number', 'maxi-blocks'),
											content: (
												<ResponsiveTabsControl
													breakpoint={deviceType}
												>
													<NumberCounterControl
														{...getGroupAttributes(
															attributes,
															'numberCounter'
														)}
														{...getGroupAttributes(
															attributes,
															'size',
															false,
															'number-counter-'
														)}
														onChangeInline={(
															obj,
															target
														) =>
															insertInlineStyles({
																obj,
																target,
															})
														}
														onChange={(
															obj,
															target
														) => {
															maxiSetAttributes(
																obj
															);
															cleanInlineStyles(
																target
															);
														}}
														breakpoint={deviceType}
													/>
												</ResponsiveTabsControl>
											),
										},
										...inspectorTabs.border({
											props,
											prefix: 'number-counter-',
										}),
										...inspectorTabs.boxShadow({
											props,
											prefix: 'number-counter-',
										}),
										...inspectorTabs.marginPadding({
											props,
											prefix: 'number-counter-',
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
										selectors: selectorsNumberCounter,
										categories: categoriesNumberCounter,
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
