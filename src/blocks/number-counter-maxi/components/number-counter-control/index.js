/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import ColorControl from '@components/color-control';
import FontFamilySelector from '@components/font-family-selector';
import FontWeightControl from '@components/font-weight-control';
import SelectControl from '@components/select-control';
import ToggleSwitch from '@components/toggle-switch';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const NumberCounterControl = props => {
	const { className, breakpoint, onChangeInline, onChange, setShowLoader } =
		props;

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
			{!props['number-counter-circle-status'] && (
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
				label={__('Preview', 'maxi-blocks')}
				selected={props['number-counter-preview']}
				onChange={val =>
					onChange({
						'number-counter-preview': val,
					})
				}
			/>
			<SelectControl
				__nextHasNoMarginBottom
				label={__('Start animation', 'maxi-blocks')}
				className='maxi-number-counter-control__start-animation'
				value={props['number-counter-start-animation']}
				newStyle
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
			{props['number-counter-start-animation'] === 'view-scroll' && (
				<AdvancedNumberControl
					label={__('Offset', 'maxi-blocks')}
					min={50}
					max={100}
					initial={100}
					step={1}
					value={props['number-counter-start-animation-offset']}
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
			{props['number-counter-start'] >= props['number-counter-end'] && (
				<div className='maxi-number-counter-control__alert-warning'>
					<i>{__('Start Number ', 'maxi-blocks')}</i>
					{__('can not be grater than ', 'maxi-blocks')}
					<i>{__('End Number ', 'maxi-blocks')}</i>
				</div>
			)}
			<AdvancedNumberControl
				className='number-counter-control__start-end'
				label={__('Start number', 'maxi-blocks')}
				min={0}
				max={props['number-counter-end']}
				initial={0}
				step={1}
				value={props['number-counter-start']}
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
				className='number-counter-control__start-end'
				label={__('End number', 'maxi-blocks')}
				min={1}
				max={props['number-counter-circle-status'] ? 9999999999 : 100}
				initial={100}
				step={1}
				value={props['number-counter-end']}
				onChangeValue={val => onChange({ 'number-counter-end': val })}
				onReset={() =>
					onChange({
						'number-counter-end':
							getDefaultAttribute('number-counter-end'),
						isReset: true,
					})
				}
			/>
			{!props['number-counter-circle-status'] &&
				props['number-counter-end'] >= 100 && (
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
				value={props['number-counter-duration']}
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
			{!props['number-counter-circle-status'] && (
				<AdvancedNumberControl
					label={__('Stroke', 'maxi-blocks')}
					min={1}
					max={99}
					initial={8}
					step={1}
					value={props['number-counter-stroke']}
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
				setShowLoader={setShowLoader}
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
				setShowLoader={setShowLoader}
			/>
			<AdvancedNumberControl
				className='maxi-number-counter-control__font-size'
				label={__('Title font size', 'maxi-blocks')}
				min={0}
				max={999}
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
				label={__('Show percentage sign', 'maxi-blocks')}
				selected={props['number-counter-percentage-sign-status']}
				onChange={val =>
					onChange({
						'number-counter-percentage-sign-status': val,
					})
				}
			/>
			{props['number-counter-percentage-sign-status'] === true && (
				<ToggleSwitch
					className='number-counter-percentage-sign-position'
					label={__('Centre percentage sign', 'maxi-blocks')}
					selected={
						props['number-counter-percentage-sign-position-status']
					}
					onChange={val =>
						onChange({
							'number-counter-percentage-sign-position-status':
								val,
						})
					}
				/>
			)}
			<ToggleSwitch
				className='number-counter-circle-status'
				label={__('Hide circle', 'maxi-blocks')}
				selected={props['number-counter-circle-status']}
				onChange={val => {
					onChange({
						'number-counter-circle-status': val,
						...(!val && {
							...(props['number-counter-end'] > 100 && {
								'number-counter-end': 100,
							}),
							...(props['number-counter-start'] > 100 && {
								'number-counter-start': 0,
							}),
						}),
					});
				}}
			/>
			{!props['number-counter-circle-status'] && (
				<ToggleSwitch
					className='number-counter-rounded-status'
					label={__('Rounded bar', 'maxi-blocks')}
					selected={props['number-counter-rounded-status']}
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
				paletteSCStatus={getLastBreakpointAttribute({
					target: 'number-counter-text-palette-sc-status',
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
					onChangeInline({ color }, '.maxi-number-counter__box__text')
				}
				onChange={({
					paletteStatus,
					paletteSCStatus,
					paletteColor,
					paletteOpacity,
					color,
				}) =>
					onChange(
						{
							[`number-counter-text-palette-status-${breakpoint}`]:
								paletteStatus,
							[`number-counter-text-palette-sc-status-${breakpoint}`]:
								paletteSCStatus,
							[`number-counter-text-palette-color-${breakpoint}`]:
								paletteColor,
							[`number-counter-text-palette-opacity-${breakpoint}`]:
								paletteOpacity,
							[`number-counter-text-color-${breakpoint}`]: color,
						},
						'.maxi-number-counter__box__text'
					)
				}
			/>
			<hr />
			{!props['number-counter-circle-status'] && (
				<>
					<ColorControl
						label={__('Circle background', 'maxi-blocks')}
						paletteStatus={
							props[
								'number-counter-circle-background-palette-status'
							]
						}
						paletteSCStatus={
							props[
								'number-counter-circle-background-palette-sc-status'
							]
						}
						paletteColor={
							props[
								'number-counter-circle-background-palette-color'
							]
						}
						paletteOpacity={
							props[
								'number-counter-circle-background-palette-opacity'
							]
						}
						color={props['number-counter-circle-background-color']}
						prefix='number-counter-circle-background-'
						onChangeInline={({ color }) =>
							onChangeInline(
								{ color },
								'.maxi-number-counter__box__background'
							)
						}
						onChange={({
							paletteStatus,
							paletteSCStatus,
							paletteColor,
							paletteOpacity,
							color,
						}) =>
							onChange(
								{
									'number-counter-circle-background-palette-status':
										paletteStatus,
									'number-counter-circle-background-palette-sc-status':
										paletteStatus,
									'number-counter-circle-background-palette-color':
										paletteColor,
									'number-counter-circle-background-palette-opacity':
										paletteOpacity,
									'number-counter-circle-background-color':
										color,
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
						paletteSCStatus={getLastBreakpointAttribute({
							target: 'number-counter-circle-bar-palette-sc-status',
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
							paletteSCStatus,
							paletteColor,
							paletteOpacity,
							color,
						}) =>
							onChange(
								{
									[`number-counter-circle-bar-palette-status-${breakpoint}`]:
										paletteStatus,
									[`number-counter-circle-bar-palette-sc-status-${breakpoint}`]:
										paletteSCStatus,
									[`number-counter-circle-bar-palette-color-${breakpoint}`]:
										paletteColor,
									[`number-counter-circle-bar-palette-opacity-${breakpoint}`]:
										paletteOpacity,
									[`number-counter-circle-bar-color-${breakpoint}`]:
										color,
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
