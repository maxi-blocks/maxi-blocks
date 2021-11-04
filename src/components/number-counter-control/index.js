/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import ColorControl from '../color-control';
import ToggleSwitch from '../toggle-switch';
import FontFamilySelector from '../font-family-selector';
import SelectControl from '../select-control';

import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

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
	const { className, breakpoint, onChange } = props;

	const classes = classnames('maxi-number-counter-control', className);

	const minMaxSettings = {
		px: {
			min: 0,
			max: 3999,
		},
		em: {
			min: 0,
			max: 999,
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

	return (
		<div className={classes}>
			<AdvancedNumberControl
				label={__('Width', 'maxi-blocks')}
				className='maxi-number-counter-control__width'
				enableUnit
				unit={getLastBreakpointAttribute(
					'number-counter-width-unit',
					breakpoint,
					props
				)}
				onChangeUnit={val =>
					onChange({
						[`number-counter-width-unit-${breakpoint}`]: val,
					})
				}
				value={getLastBreakpointAttribute(
					'number-counter-width',
					breakpoint,
					props
				)}
				onChangeValue={val =>
					onChange({ [`number-counter-width-${breakpoint}`]: val })
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
					})
				}
				minMaxSettings={minMaxSettings}
				allowedUnits={['px', 'em', 'vw', '%']}
			/>
			<ToggleSwitch
				label={__('Preview', 'maxi-block')}
				selected={props['number-counter-preview']}
				onChange={val =>
					onChange({
						'number-counter-preview': val,
					})
				}
			/>
			<SelectControl
				label={__('Start Animation', 'maxi-blocks')}
				className='maxi-number-counter-control__start-animation'
				value={props['number-counter-start-animation']}
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
			{props['number-counter-start'] >= props['number-counter-end'] && (
				<div className='maxi-number-counter-control__alert-warning'>
					<i>{__('Start Number ', 'maxi-blocks')}</i>
					{__('can not be grater than ', 'maxi-blocks')}
					<i>{__('End Number ', 'maxi-blocks')}</i>
				</div>
			)}
			<AdvancedNumberControl
				label={__('Start Number', 'maxi-blocks')}
				min={0}
				max={100}
				initial={0}
				step={1}
				value={props['number-counter-start']}
				onChangeValue={val => onChange({ 'number-counter-start': val })}
				onReset={() =>
					onChange({
						'number-counter-start': getDefaultAttribute(
							'number-counter-start'
						),
					})
				}
			/>
			<AdvancedNumberControl
				label={__('End Number', 'maxi-blocks')}
				min={1}
				max={props['number-counter-circle-status'] ? 9999 : 100}
				initial={100}
				step={1}
				value={props['number-counter-end']}
				onChangeValue={val => onChange({ 'number-counter-end': val })}
				onReset={() =>
					onChange({
						'number-counter-end':
							getDefaultAttribute('number-counter-end'),
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
				max={9999}
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
						})
					}
				/>
			)}
			<FontFamilySelector
				className='maxi-typography-control__font-family'
				defaultValue={getDefaultAttribute(
					'number-counter-title-font-family'
				)}
				font={props['number-counter-title-font-family']}
				onChange={font =>
					onChange({
						'number-counter-title-font-family': font.value,
					})
				}
			/>
			<AdvancedNumberControl
				label={__('Title Font Size', 'maxi-blocks')}
				min={0}
				max={99}
				initial={32}
				step={1}
				value={props['number-counter-title-font-size']}
				onChangeValue={val =>
					onChange({ 'number-counter-title-font-size': val })
				}
				onReset={() =>
					onChange({
						'number-counter-title-font-size': getDefaultAttribute(
							'number-counter-title-font-size'
						),
					})
				}
			/>
			<ToggleSwitch
				className='number-counter-percentage-sign-status'
				label={__('Show Percentage Sign', 'maxi-block')}
				selected={props['number-counter-percentage-sign-status']}
				onChange={val =>
					onChange({
						'number-counter-percentage-sign-status': val,
					})
				}
			/>
			<ToggleSwitch
				className='number-counter-circle-status'
				label={__('Hide Circle', 'maxi-block')}
				selected={props['number-counter-circle-status']}
				onChange={val => {
					onChange({
						'number-counter-circle-status': val,
					});

					if (!val && props['number-counter-end'] > 100)
						onChange({ 'number-counter-end': 100 });
				}}
			/>
			{!props['number-counter-circle-status'] && (
				<ToggleSwitch
					className='number-counter-rounded-status'
					label={__('Rounded Bar', 'maxi-block')}
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
				paletteStatus={
					props['number-counter-palette-text-color-status']
				}
				paletteColor={props['number-counter-palette-text-color']}
				paletteOpacity={props['number-counter-palette-text-opacity']}
				color={props['number-counter-text-color']}
				defaultColor={getDefaultAttribute('number-counter-text-color')}
				onChange={({
					paletteStatus,
					paletteColor,
					paletteOpacity,
					color,
				}) =>
					onChange({
						'number-counter-palette-text-color-status':
							paletteStatus,
						'number-counter-palette-text-color': paletteColor,
						'number-counter-palette-text-opacity': paletteOpacity,
						'number-counter-text-color': color,
					})
				}
			/>
			<hr />
			{!props['number-counter-circle-status'] && (
				<>
					<ColorControl
						label={__('Circle Background', 'maxi-blocks')}
						paletteStatus={
							props[
								'number-counter-palette-circle-background-color-status'
							]
						}
						paletteColor={
							props[
								'number-counter-palette-circle-background-color'
							]
						}
						paletteOpacity={
							props[
								'number-counter-palette-circle-background-opacity'
							]
						}
						color={props['number-counter-circle-background-color']}
						defaultColor={getDefaultAttribute(
							'number-counter-circle-background-color'
						)}
						onChange={({
							paletteStatus,
							paletteColor,
							paletteOpacity,
							color,
						}) =>
							onChange({
								'number-counter-palette-circle-background-color-status':
									paletteStatus,
								'number-counter-palette-circle-background-color':
									paletteColor,
								'number-counter-palette-circle-background-opacity':
									paletteOpacity,
								'number-counter-circle-background-color': color,
							})
						}
					/>
					<hr />
					<ColorControl
						label={__('Circle Bar', 'maxi-blocks')}
						paletteStatus={
							props[
								'number-counter-palette-circle-bar-color-status'
							]
						}
						paletteColor={
							props['number-counter-palette-circle-bar-color']
						}
						paletteOpacity={
							props['number-counter-palette-circle-bar-opacity']
						}
						color={props['number-counter-circle-bar-color']}
						defaultColor={getDefaultAttribute(
							'number-counter-circle-bar-color'
						)}
						onChange={({
							paletteStatus,
							paletteColor,
							paletteOpacity,
							color,
						}) =>
							onChange({
								'number-counter-palette-circle-bar-color-status':
									paletteStatus,
								'number-counter-palette-circle-bar-color':
									paletteColor,
								'number-counter-palette-circle-bar-opacity':
									paletteOpacity,
								'number-counter-circle-bar-color': color,
							})
						}
					/>
				</>
			)}
		</div>
	);
};

export default NumberCounterControl;
