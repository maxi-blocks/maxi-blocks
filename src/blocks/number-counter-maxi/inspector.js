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
	BlockStylesControl,
	CustomLabel,
	FullSizeControl,
	NumberCounterControl,
	SettingTabsControl,
	ToggleSwitch,
} from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, clientId, deviceType, setAttributes } = props;
	const { blockFullWidth, blockStyle, customLabel, isFirstOnHierarchy } =
		attributes;

	return (
		<InspectorControls>
			{inspectorTabs.infoBox({ props })}
			<SettingTabsControl
				disablePadding
				deviceType={deviceType}
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
											label: __('Number', 'maxi-blocks'),
											content: (
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
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
												/>
											),
										},
										...inspectorTabs.border({
											props,
											prefix: 'number-counter-',
										}),
										...inspectorTabs.boxShadow({
											props,
											prefox: 'number-counter-',
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
									...inspectorTabs.background({
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
									isFirstOnHierarchy && {
										label: __(
											'Height / Width',
											'maxi-blocks'
										),
										content: (
											<>
												{isFirstOnHierarchy && (
													<ToggleSwitch
														label={__(
															'Set number counter to full-width',
															'maxi-blocks'
														)}
														selected={
															blockFullWidth ===
															'full'
														}
														onChange={val =>
															setAttributes({
																blockFullWidth:
																	val
																		? 'full'
																		: 'normal',
															})
														}
													/>
												)}
												<FullSizeControl
													{...getGroupAttributes(
														attributes,
														'size'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
												/>
											</>
										),
									},
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
									...inspectorTabs.transform({
										props,
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
