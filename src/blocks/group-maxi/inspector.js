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
	ArrowControl,
	BlockStylesControl,
	CustomLabel,
	FullSizeControl,
	InfoBox,
	MotionControl,
	SettingTabsControl,
	TextControl,
	ToggleSwitch,
	TransformControl,
} from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, setAttributes, clientId } = props;
	const {
		blockFullWidth,
		blockStyle,
		customLabel,
		extraClassName,
		isFirstOnHierarchy,
		uniqueID,
	} = attributes;

	return (
		<InspectorControls>
			{deviceType !== 'general' && (
				<InfoBox
					message={__(
						'You are currently in responsive editing mode. Select Base to continue editing general settings.',
						'maxi-blocks'
					)}
				/>
			)}
			<SettingTabsControl
				disablePadding
				deviceType={deviceType}
				items={[
					{
						label: __('Settings', 'maxi-blocks'),
						content: (
							<>
								{deviceType === 'general' && (
									<div className='maxi-tab-content__box'>
										<CustomLabel
											customLabel={customLabel}
											onChange={customLabel =>
												setAttributes({ customLabel })
											}
										/>
										<BlockStylesControl
											blockStyle={blockStyle}
											isFirstOnHierarchy={
												isFirstOnHierarchy
											}
											onChange={obj => setAttributes(obj)}
											clientId={clientId}
										/>
									</div>
								)}
								<AccordionControl
									isPrimary
									items={[
										{
											label: __(
												'Callout arrow',
												'maxi-blocks'
											),
											content: (
												<ArrowControl
													{...getGroupAttributes(
														attributes,
														[
															'blockBackground',
															'arrow',
															'border',
														]
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													isFullWidth={blockFullWidth}
													breakpoint={deviceType}
												/>
											),
										},
										...inspectorTabs.background({
											props,
											enableParallax: true,
										}),
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
													<ToggleSwitch
														label={__(
															'Set group to full-width',
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
													<FullSizeControl
														{...getGroupAttributes(
															attributes,
															'size'
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														breakpoint={deviceType}
														hideMaxWidth={
															blockFullWidth ===
															'full'
														}
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
										label: __(
											'Add CSS class/id',
											'maxi-blocks'
										),
										content: (
											<TextControl
												label={__(
													'Additional CSS Classes',
													'maxi-blocks'
												)}
												className='maxi-additional__css-classes'
												value={extraClassName}
												onChange={extraClassName =>
													setAttributes({
														extraClassName,
													})
												}
											/>
										),
									},
									{
										label: __(
											'Motion effect',
											'maxi-blocks'
										),
										content: (
											<MotionControl
												{...getGroupAttributes(
													attributes,
													'motion'
												)}
												onChange={obj =>
													setAttributes(obj)
												}
											/>
										),
									},
									{
										label: __('Transform', 'maxi-blocks'),
										content: (
											<TransformControl
												{...getGroupAttributes(
													attributes,
													'transform'
												)}
												onChange={obj =>
													setAttributes(obj)
												}
												uniqueID={uniqueID}
												breakpoint={deviceType}
											/>
										),
									},
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
