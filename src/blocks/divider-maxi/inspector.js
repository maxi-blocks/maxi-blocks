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
	AxisControl,
	BlockStylesControl,
	BoxShadowControl,
	CustomLabel,
	DisplayControl,
	DividerControl,
	FullSizeControl,
	InfoBox,
	MotionControl,
	OpacityControl,
	OverflowControl,
	PositionControl,
	RadioControl,
	ResponsiveControl,
	SettingTabsControl,
	TextControl,
	ToggleSwitch,
	TransformControl,
	ZIndexControl,
} from '../../components';
import {
	getGroupAttributes,
	setHoverAttributes,
} from '../../extensions/styles';
import * as inspectorTabs from '../../components/inspector-tabs';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, setAttributes, clientId } = props;
	const {
		customLabel,
		uniqueID,
		isFirstOnHierarchy,
		blockStyle,
		fullWidth,
		extraClassName,
		lineOrientation,
		lineVertical,
		lineHorizontal,
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
						label: __('Style', 'maxi-blocks'),
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
									isSecondary
									items={[
										deviceType === 'general' && {
											label: __('Line', 'maxi-blocks'),
											content: (
												<>
													<RadioControl
														fullWidthMode
														label={__(
															'Line Orientation',
															'maxi-blocks'
														)}
														selected={
															lineOrientation
														}
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
														onChange={lineOrientation =>
															setAttributes({
																lineOrientation,
															})
														}
													/>
													<RadioControl
														fullWidthMode
														label={__(
															'Line Vertical Position',
															'maxi-blocks'
														)}
														selected={lineVertical}
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
														onChange={lineVertical =>
															setAttributes({
																lineVertical,
															})
														}
													/>
													<RadioControl
														fullWidthMode
														label={__(
															'Line Horizontal Position',
															'maxi-blocks'
														)}
														selected={
															lineHorizontal
														}
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
														onChange={lineHorizontal =>
															setAttributes({
																lineHorizontal,
															})
														}
													/>
													<DividerControl
														{...getGroupAttributes(
															attributes,
															['divider', 'size']
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														lineOrientation={
															lineOrientation
														}
														breakpoint={deviceType}
														clientId={clientId}
													/>
												</>
											),
										},
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
																'Set divider to full-width',
																'maxi-blocks'
															)}
															selected={
																fullWidth ===
																'full'
															}
															onChange={val =>
																setAttributes({
																	fullWidth:
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
										...inspectorTabs.background({ props }),
										{
											label: __(
												'Box Shadow',
												'maxi-blocks'
											),
											disablePadding: true,
											content: (
												<SettingTabsControl
													items={[
														{
															label: __(
																'Normal',
																'maxi-blocks'
															),
															content: (
																<BoxShadowControl
																	{...getGroupAttributes(
																		attributes,
																		'boxShadow'
																	)}
																	onChange={obj =>
																		setAttributes(
																			obj
																		)
																	}
																	breakpoint={
																		deviceType
																	}
																	clientId={
																		clientId
																	}
																/>
															),
														},
														{
															label: __(
																'Hover',
																'maxi-blocks'
															),
															content: (
																<>
																	<ToggleSwitch
																		label={__(
																			'Enable Box Shadow Hover',
																			'maxi-blocks'
																		)}
																		selected={
																			attributes[
																				'box-shadow-status-hover'
																			]
																		}
																		className='maxi-box-shadow-status-hover'
																		onChange={val =>
																			setAttributes(
																				{
																					...(val &&
																						setHoverAttributes(
																							{
																								...getGroupAttributes(
																									attributes,
																									'boxShadow'
																								),
																							},
																							{
																								...getGroupAttributes(
																									attributes,
																									'boxShadow',
																									true
																								),
																							}
																						)),
																					'box-shadow-status-hover':
																						val,
																				}
																			)
																		}
																	/>
																	{attributes[
																		'box-shadow-status-hover'
																	] && (
																		<BoxShadowControl
																			{...getGroupAttributes(
																				attributes,
																				'boxShadowHover'
																			)}
																			onChange={obj =>
																				setAttributes(
																					obj
																				)
																			}
																			breakpoint={
																				deviceType
																			}
																			isHover
																			clientId={
																				clientId
																			}
																		/>
																	)}
																</>
															),
														},
													]}
												/>
											),
										},
										{
											label: __(
												'Padding & Margin',
												'maxi-blocks'
											),
											content: (
												<>
													<AxisControl
														{...getGroupAttributes(
															attributes,
															'padding'
														)}
														label={__(
															'Padding',
															'maxi-blocks'
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														breakpoint={deviceType}
														target='padding'
														disableAuto
													/>
													<AxisControl
														{...getGroupAttributes(
															attributes,
															'margin'
														)}
														label={__(
															'Margin',
															'maxi-blocks'
														)}
														onChange={obj =>
															setAttributes(obj)
														}
														target='margin'
														breakpoint={deviceType}
														optionType='string'
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
							<>
								<AccordionControl
									isPrimary
									items={[
										deviceType === 'general' && {
											label: __(
												'Custom Classes',
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
												'Motion Effects',
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
											label: __(
												'Transform',
												'maxi-blocks'
											),
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
										{
											label: __('Display', 'maxi-blocks'),
											content: (
												<DisplayControl
													{...getGroupAttributes(
														attributes,
														'display'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __(
												'Position',
												'maxi-blocks'
											),
											content: (
												<PositionControl
													{...getGroupAttributes(
														attributes,
														'position'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
												/>
											),
										},
										deviceType !== 'general' && {
											label: __(
												'Breakpoint',
												'maxi-blocks'
											),
											content: (
												<ResponsiveControl
													{...getGroupAttributes(
														attributes,
														'breakpoints'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __('Z-index', 'maxi-blocks'),
											content: (
												<ZIndexControl
													{...getGroupAttributes(
														attributes,
														'zIndex'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __('Opacity', 'maxi-blocks'),
											content: (
												<OpacityControl
													{...getGroupAttributes(
														attributes,
														'opacity'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
												/>
											),
										},
										{
											label: __(
												'Overflow',
												'maxi-blocks'
											),
											content: (
												<OverflowControl
													{...getGroupAttributes(
														attributes,
														'overflow'
													)}
													onChange={obj =>
														setAttributes(obj)
													}
													breakpoint={deviceType}
												/>
											),
										},
									]}
								/>
							</>
						),
					},
				]}
			/>
		</InspectorControls>
	);
};

export default Inspector;
