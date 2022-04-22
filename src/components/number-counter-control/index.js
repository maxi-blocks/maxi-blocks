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
				autoLabel='Auto Width'
				enableAuto
				autoDefaultValue='250'
				unit={getLastBreakpointAttribute({
					target: 'number-counter-width-unit',
					breakpoint,
					attributes: props,
				})}
				onChangeUnit={val =>
					onChange({
						[`number-counter-width-unit-${breakpoint}`]: val,
					})
				}
				value={getLastBreakpointAttribute({
					target: 'number-counter-width',
					breakpoint,
					attributes: props,
				})}
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
						...(!val && {
							...(props['number-counter-end'] > 100 && {
								'number-counter-end': 100,
							}),
							...(props['number-counter-start'] > 100 && {
								'number-counter-start': 100,
							}),
						}),
					});
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
				paletteStatus={props['number-counter-text-palette-status']}
				paletteColor={props['number-counter-text-palette-color']}
				paletteOpacity={props['number-counter-palette-text-opacity']}
				color={props['number-counter-text-color']}
				prefix='number-counter-text-'
				onChange={({
					paletteStatus,
					paletteColor,
					paletteOpacity,
					color,
				}) =>
					onChange({
						'number-counter-text-palette-status': paletteStatus,
						'number-counter-text-palette-color': paletteColor,
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
								'number-counter-circle-background-palette-status'
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
						onChange={({
							paletteStatus,
							paletteColor,
							paletteOpacity,
							color,
						}) =>
							onChange({
								'number-counter-circle-background-palette-status':
									paletteStatus,
								'number-counter-circle-background-palette-color':
									paletteColor,
								'number-counter-circle-background-palette-opacity':
									paletteOpacity,
								'number-counter-circle-background-color': color,
							})
						}
					/>
					<hr />
					<ColorControl
						label={__('Circle Bar', 'maxi-blocks')}
						paletteStatus={
							props['number-counter-circle-bar-palette-status']
						}
						paletteColor={
							props['number-counter-circle-bar-palette-color']
						}
						paletteOpacity={
							props['number-counter-circle-bar-palette-opacity']
						}
						color={props['number-counter-circle-bar-color']}
						prefix='number-counter-circle-bar-'
						onChange={({
							paletteStatus,
							paletteColor,
							paletteOpacity,
							color,
						}) =>
							onChange({
								'number-counter-circle-bar-palette-status':
									paletteStatus,
								'number-counter-circle-bar-palette-color':
									paletteColor,
								'number-counter-circle-bar-palette-opacity':
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
