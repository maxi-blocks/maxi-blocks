/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	AdvancedNumberControl,
	ColorControl,
	FontFamilySelector,
	FontWeightControl,
	SelectControl,
	ToggleSwitch,
} from '../../../../components';
import {
	getAttributeKey,
	getAttributesValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const NumberCounterControl = props => {
	const { className, breakpoint, onChangeInline, onChange } = props;

	const classes = classnames('maxi-number-counter-control', className);

	const minMaxSettings = {
		px: {
			min: 0,
			max: 3999,
		},
		vw: {
			min: 0,
			max: 999,
		},
		'%': {
			min: 0,
			max: 100,
		},
	};

	const autoWidth = getLastBreakpointAttribute({
		target: 'number-counter-width-auto',
		breakpoint,
		attributes: props,
	});

	return (
		<div className={classes}>
			{!getAttributesValue({
				target: 'number-counter-circle-status',
				props,
			}) && (
				<>
					<ToggleSwitch
						label={__('Auto width', 'maxi-blocks')}
						selected={autoWidth}
						onChange={val =>
							onChange({
								[`number-counter-width-auto-${breakpoint}`]:
									val,
							})
						}
					/>
					{!autoWidth && (
						<AdvancedNumberControl
							label={__('Width', 'maxi-blocks')}
							className='maxi-number-counter-control__width'
							enableUnit
							unit={getLastBreakpointAttribute({
								target: 'number-counter-width-unit',
								breakpoint,
								attributes: props,
							})}
							onChangeUnit={val =>
								onChange({
									[`number-counter-width-unit-${breakpoint}`]:
										val,
								})
							}
							value={getLastBreakpointAttribute({
								target: 'number-counter-width',
								breakpoint,
								attributes: props,
							})}
							onChangeValue={val =>
								onChange({
									[`number-counter-width-${breakpoint}`]: val,
								})
							}
							onReset={() =>
								onChange({
									[`number-counter-width-${breakpoint}`]:
										getDefaultAttribute(
											`number-counter-width-${breakpoint}`
										),
									[`number-counter-width-unit-${breakpoint}`]:
										getDefaultAttribute(
											`number-counter-width-unit-${breakpoint}`
										),
									isReset: true,
								})
							}
							minMaxSettings={minMaxSettings}
							optionType='string'
						/>
					)}
				</>
			)}
			<ToggleSwitch
				label={__('Preview', 'maxi-block')}
				selected={getAttributesValue({
					target: 'number-counter-preview',
					props,
				})}
				onChange={val =>
					onChange({
						'number-counter-preview': val,
					})
				}
			/>
			<SelectControl
				label={__('Start animation', 'maxi-blocks')}
				className='maxi-number-counter-control__start-animation'
				value={getAttributesValue({
					target: 'number-counter-start-animation',
					props,
				})}
				options={[
					{
						label: __('Page Load', 'maxi-blocks'),
						value: 'page-load',
					},
					{
						label: __('View On Scroll', 'maxi-blocks'),
						value: 'view-scroll',
					},
				]}
				onChange={val =>
					onChange({ 'number-counter-start-animation': val })
				}
			/>
			{getAttributesValue({
				target: 'number-counter-start-animation',
				props,
			}) === 'view-scroll' && (
				<AdvancedNumberControl
					label={__('Offset', 'maxi-blocks')}
					min={50}
					max={100}
					initial={100}
					step={1}
					value={getAttributesValue({
						target: 'number-counter-start-animation-offset',
						props,
					})}
					onChangeValue={val =>
						onChange({
							'number-counter-start-animation-offset': val,
						})
					}
					onReset={() =>
						onChange({
							'number-counter-start-animation-offset':
								getDefaultAttribute(
									'number-counter-start-animation-offset'
								),
							isReset: true,
						})
					}
				/>
			)}
			{getAttributesValue({
				target: 'number-counter-start',
				props,
			}) >=
				getAttributesValue({
					target: 'number-counter-end',
					props,
				}) && (
				<div className='maxi-number-counter-control__alert-warning'>
					<i>{__('Start Number ', 'maxi-blocks')}</i>
					{__('can not be grater than ', 'maxi-blocks')}
					<i>{__('End Number ', 'maxi-blocks')}</i>
				</div>
			)}
			<AdvancedNumberControl
				label={__('Start number', 'maxi-blocks')}
				min={0}
				max={getAttributesValue({
					target: 'number-counter-end',
					props,
				})}
				initial={0}
				step={1}
				value={getAttributesValue({
					target: 'number-counter-start',
					props,
				})}
				onChangeValue={val => onChange({ 'number-counter-start': val })}
				onReset={() =>
					onChange({
						'number-counter-start': getDefaultAttribute(
							'number-counter-start'
						),
						isReset: true,
					})
				}
			/>
			<AdvancedNumberControl
				label={__('End number', 'maxi-blocks')}
				min={1}
				max={
					getAttributesValue({
						target: 'number-counter-circle-status',
						props,
					})
						? 9999999999
						: 100
				}
				initial={100}
				step={1}
				value={getAttributesValue({
					target: 'number-counter-end',
					props,
				})}
				onChangeValue={val => onChange({ 'number-counter-end': val })}
				onReset={() =>
					onChange({
						'number-counter-end':
							getDefaultAttribute('number-counter-end'),
						isReset: true,
					})
				}
			/>
			{!getAttributesValue({
				target: 'number-counter-circle-status',
				props,
			}) &&
				getAttributesValue({
					target: 'number-counter-end',
					props,
				}) >= 100 && (
					<div className='maxi-number-counter-control__alert-warning'>
						<i>
							{__(
								"End Number can't be grater than 100 when circle is enabled",
								'maxi-blocks'
							)}
						</i>
					</div>
				)}
			<AdvancedNumberControl
				label={__('Duration', 'maxi-blocks')}
				min={1}
				max={10}
				initial={1}
				step={1}
				value={getAttributesValue({
					target: 'number-counter-duration',
					props,
				})}
				onChangeValue={val =>
					onChange({ 'number-counter-duration': val })
				}
				onReset={() =>
					onChange({
						'number-counter-duration': getDefaultAttribute(
							'number-counter-duration'
						),
						isReset: true,
					})
				}
			/>
			{!getAttributesValue({
				target: 'number-counter-circle-status',
				props,
			}) && (
				<AdvancedNumberControl
					label={__('Stroke', 'maxi-blocks')}
					min={1}
					max={99}
					initial={8}
					step={1}
					value={getAttributesValue({
						target: 'number-counter-stroke',
						props,
					})}
					onChangeValue={val =>
						onChange({ 'number-counter-stroke': val })
					}
					onReset={() =>
						onChange({
							'number-counter-stroke': getDefaultAttribute(
								'number-counter-stroke'
							),
							isReset: true,
						})
					}
				/>
			)}
			<FontFamilySelector
				className='maxi-typography-control__font-family'
				defaultValue={getDefaultAttribute(`font-family-${breakpoint}`)}
				font={getLastBreakpointAttribute({
					target: 'font-family',
					breakpoint,
					attributes: props,
				})}
				onChange={font =>
					onChange({
						[`font-family-${breakpoint}`]: font.value,
					})
				}
				breakpoint={breakpoint}
			/>
			<FontWeightControl
				onChange={val => {
					onChange({ [`font-weight-${breakpoint}`]: val });
				}}
				onReset={() => {
					onChange({
						[`font-weight-${breakpoint}`]: getDefaultAttribute(
							`font-weight-${breakpoint}`
						),
						isReset: true,
					});
				}}
				fontWeight={
					getLastBreakpointAttribute({
						target: 'font-weight',
						breakpoint,
						attributes: props,
					}) || '400'
				}
				fontName={getLastBreakpointAttribute({
					target: 'font-family',
					breakpoint,
					attributes: props,
				})}
				breakpoint={breakpoint}
			/>
			<AdvancedNumberControl
				className='maxi-number-counter-control__font-size'
				label={__('Title font size', 'maxi-blocks')}
				min={0}
				max={99}
				initial={32}
				step={1}
				value={getLastBreakpointAttribute({
					target: 'number-counter-title-font-size',
					breakpoint,
					attributes: props,
				})}
				onChangeValue={val =>
					onChange({
						[`number-counter-title-font-size-${breakpoint}`]: val,
					})
				}
				onReset={() =>
					onChange({
						[`number-counter-title-font-size-${breakpoint}`]:
							getDefaultAttribute(
								`number-counter-title-font-size-${breakpoint}`
							),
						isReset: true,
					})
				}
			/>
			<ToggleSwitch
				className='number-counter-percentage-sign-status'
				label={__('Show percentage sign', 'maxi-block')}
				selected={getAttributesValue({
					target: 'number-counter-percentage-sign-status',
					props,
				})}
				onChange={val =>
					onChange({
						'number-counter-percentage-sign-status': val,
					})
				}
			/>
			<ToggleSwitch
				className='number-counter-circle-status'
				label={__('Hide circle', 'maxi-block')}
				selected={getAttributesValue({
					target: 'number-counter-circle-status',
					props,
				})}
				onChange={val => {
					onChange({
						'number-counter-circle-status': val,
						...(!val && {
							...(getAttributesValue({
								target: 'number-counter-end',
								props,
							}) > 100 && {
								'number-counter-end': 100,
							}),
							...(getAttributesValue({
								target: 'number-counter-start',
								props,
							}) > 100 && {
								'number-counter-start': 100,
							}),
						}),
					});
				}}
			/>
			{!getAttributesValue({
				target: 'number-counter-circle-status',
				props,
			}) && (
				<ToggleSwitch
					className='number-counter-rounded-status'
					label={__('Rounded bar', 'maxi-block')}
					selected={getAttributesValue({
						target: 'number-counter-rounded-status',
						props,
					})}
					onChange={val =>
						onChange({
							'number-counter-rounded-status': val,
						})
					}
				/>
			)}
			<hr />
			<ColorControl
				label={__('Text', 'maxi-blocks')}
				paletteStatus={getLastBreakpointAttribute({
					target: 'number-counter-text-palette-status',
					breakpoint,
					attributes: props,
				})}
				paletteColor={getLastBreakpointAttribute({
					target: 'number-counter-text-palette-color',
					breakpoint,
					attributes: props,
				})}
				paletteOpacity={getLastBreakpointAttribute({
					target: 'number-counter-text-palette-opacity',
					breakpoint,
					attributes: props,
				})}
				color={getLastBreakpointAttribute({
					target: 'number-counter-text-color',
					breakpoint,
					attributes: props,
				})}
				prefix='number-counter-text-'
				deviceType={breakpoint}
				onChangeInline={({ color }) =>
					onChangeInline(
						{ fill: color },
						'.maxi-number-counter__box__text'
					)
				}
				onChange={({
					paletteStatus,
					paletteColor,
					paletteOpacity,
					color,
				}) =>
					onChange(
						{
							[getAttributeKey(
								'palette-status',
								false,
								'number-counter-text-',
								breakpoint
							)]: paletteStatus,
							[getAttributeKey(
								'palette-color',
								false,
								'number-counter-text-',
								breakpoint
							)]: paletteColor,
							[getAttributeKey(
								'palette-opacity',
								false,
								'number-counter-text-',
								breakpoint
							)]: paletteOpacity,
							[getAttributeKey(
								'color',
								false,
								'number-counter-text-',
								breakpoint
							)]: color,
						},
						'.maxi-number-counter__box__text'
					)
				}
			/>
			<hr />
			{!getAttributesValue({
				target: 'number-counter-circle-status',
				props,
			}) && (
				<>
					<ColorControl
						label={__('Circle background', 'maxi-blocks')}
						paletteStatus={getAttributesValue({
							target: 'number-counter-circle-background-palette-status',
							props,
						})}
						paletteColor={getAttributesValue({
							target: 'number-counter-circle-background-palette-color',
							props,
						})}
						paletteOpacity={getAttributesValue({
							target: 'number-counter-circle-background-palette-opacity',
							props,
						})}
						color={getAttributesValue({
							target: 'number-counter-circle-background-color',
							props,
						})}
						prefix='number-counter-circle-background-'
						onChangeInline={({ color }) =>
							onChangeInline(
								{ fill: color },
								'.maxi-number-counter__box__background'
							)
						}
						onChange={({
							paletteStatus,
							paletteColor,
							paletteOpacity,
							color,
						}) =>
							onChange(
								{
									[getAttributeKey(
										'palette-status',
										false,
										'number-counter-circle-background-'
									)]: paletteStatus,
									[getAttributeKey(
										'palette-color',
										false,
										'number-counter-circle-background-'
									)]: paletteColor,
									[getAttributeKey(
										'palette-opacity',
										false,
										'number-counter-circle-background-'
									)]: paletteOpacity,
									[getAttributeKey(
										'color',
										false,
										'number-counter-circle-background-'
									)]: color,
								},
								'.maxi-number-counter__box__background'
							)
						}
					/>
					<hr />
					<ColorControl
						label={__('Circle bar', 'maxi-blocks')}
						paletteStatus={getLastBreakpointAttribute({
							target: 'number-counter-circle-bar-palette-status',
							breakpoint,
							attributes: props,
						})}
						paletteColor={getLastBreakpointAttribute({
							target: 'number-counter-circle-bar-palette-color',
							breakpoint,
							attributes: props,
						})}
						paletteOpacity={getLastBreakpointAttribute({
							target: 'number-counter-circle-bar-palette-opacity',
							breakpoint,
							attributes: props,
						})}
						color={getLastBreakpointAttribute({
							target: 'number-counter-circle-bar-color',
							breakpoint,
							attributes: props,
						})}
						prefix='number-counter-circle-bar-'
						onChangeInline={({ color }) =>
							onChangeInline(
								{ stroke: color },
								'.maxi-number-counter__box__circle'
							)
						}
						onChange={({
							paletteStatus,
							paletteColor,
							paletteOpacity,
							color,
						}) =>
							onChange(
								{
									[getAttributeKey(
										'palette-status',
										false,
										'number-counter-circle-bar-',
										breakpoint
									)]: paletteStatus,
									[getAttributeKey(
										'palette-color',
										false,
										'number-counter-circle-bar-',
										breakpoint
									)]: paletteColor,
									[getAttributeKey(
										'palette-opacity',
										false,
										'number-counter-circle-bar-',
										breakpoint
									)]: paletteOpacity,
									[getAttributeKey(
										'color',
										false,
										'number-counter-circle-bar-',
										breakpoint
									)]: color,
								},
								'.maxi-number-counter__box__circle'
							)
						}
					/>
				</>
			)}
		</div>
	);
};

export default NumberCounterControl;
