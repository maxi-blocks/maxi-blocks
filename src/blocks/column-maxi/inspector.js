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
	AdvancedNumberControl,
	BlockStylesControl,
	CustomLabel,
	DisplayControl,
	InfoBox,
	OpacityControl,
	OverflowControl,
	ResponsiveControl,
	SelectControl,
	SettingTabsControl,
	TextControl,
	TransformControl,
	ZIndexControl,
} from '../../components';
import {
	getGroupAttributes,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { getColumnDefaultValue } from '../../extensions/column-templates';
import * as inspectorTabs from '../../components/inspector-tabs';

/**
 * Inspector
 */
const Inspector = props => {
	const { attributes, deviceType, setAttributes, clientId, rowPattern } =
		props;
	const {
		customLabel,
		uniqueID,
		isFirstOnHierarchy,
		blockStyle,
		extraClassName,
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
												'Column settings',
												'maxi-blocks'
											),
											content: (
												<>
													<AdvancedNumberControl
														label={__(
															'Column Size (%)',
															'maxi-blocks'
														)}
														value={getLastBreakpointAttribute(
															'column-size',
															deviceType,
															attributes
														)}
														onChangeValue={val => {
															setAttributes({
																[`column-size-${deviceType}`]:
																	val !==
																		undefined &&
																	val !== ''
																		? val
																		: '',
															});
														}}
														min={0}
														max={100}
														step={0.1}
														onReset={() =>
															setAttributes({
																[`column-size-${deviceType}`]:
																	getColumnDefaultValue(
																		rowPattern,
																		{
																			...getGroupAttributes(
																				attributes,
																				'columnSize'
																			),
																		},
																		clientId,
																		deviceType
																	),
															})
														}
														initialPosition={getDefaultAttribute(
															`column-size-${deviceType}`,
															clientId
														)}
													/>
													<SelectControl
														label={__(
															'Vertical align',
															'maxi-blocks'
														)}
														value={
															attributes.verticalAlign
														}
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
															{
																label: __(
																	'Space between',
																	'maxi-blocks'
																),
																value: 'space-between',
															},
															{
																label: __(
																	'Space around',
																	'maxi-blocks'
																),
																value: 'space-around',
															},
														]}
														onChange={verticalAlign =>
															setAttributes({
																verticalAlign,
															})
														}
													/>
												</>
											),
										},
										...inspectorTabs.background({
											props,
											disableVideo: true,
										}),
										...inspectorTabs.border({
											props,
										}),
										...inspectorTabs.boxShadow({
											props,
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
									{
										label: __(
											'Show/hide block',
											'maxi-blocks'
										),
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
									deviceType !== 'general' && {
										label: __('Breakpoint', 'maxi-blocks'),
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
										label: __('Overflow', 'maxi-blocks'),
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
