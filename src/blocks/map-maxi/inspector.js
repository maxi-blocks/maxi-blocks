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
	FullSizeControl,
	MapControl,
	SettingTabsControl,
	ToggleSwitch,
} from '../../components';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, setAttributes } = props;
	const { isFirstOnHierarchy, blockFullWidth } = attributes;

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
											label: __('Map', 'maxi-blocks'),
											content: (
												<MapControl
													{...getGroupAttributes(
														attributes,
														'map'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
												/>
											),
										},
										...inspectorTabs.border({
											props,
										}),
										...inspectorTabs.boxShadow({
											props,
										}),
										{
											label: __(
												'Height / Width',
												'maxi-blocks'
											),
											content: (
												<>
													{isFirstOnHierarchy && (
														<ToggleSwitch
															label={__(
																'Set map to full-width',
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
