/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import FancyRadioControl from '../fancy-radio-control';
import SizeControl from '../size-control';
import FontFamilySelector from '../font-family-selector';

import {
	getDefaultAttribute,
	getGroupAttributes,
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
	const { className, onChange, clientId } = props;

	const classes = classnames('maxi-number-counter-control', className);

	return (
		<div className={classes}>
			<FancyRadioControl
				label={__('Preview', 'maxi-block')}
				selected={props['number-counter-preview']}
				options={[
					{ label: __('Yes', 'maxi-block'), value: 1 },
					{ label: __('No', 'maxi-block'), value: 0 },
				]}
				onChange={val => onChange({ 'number-counter-preview': val })}
			/>
			<SelectControl
				label={__('Start Animation', 'maxi-blocks')}
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
			<SizeControl
				label={__('Start Number', 'maxi-blocks')}
				disableUnit
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
			<SizeControl
				label={__('End Number', 'maxi-blocks')}
				disableUnit
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
			<SizeControl
				label={__('Duration', 'maxi-blocks')}
				disableUnit
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
			<SizeControl
				label={__('Radius', 'maxi-blocks')}
				disableUnit
				min={90}
				max={999}
				initial={85}
				step={1}
				value={props['number-counter-radius']}
				onChangeValue={val =>
					onChange({ 'number-counter-radius': val })
				}
				onReset={() =>
					onChange({
						'number-counter-radius': getDefaultAttribute(
							'number-counter-radius'
						),
					})
				}
			/>
			<SizeControl
				label={__('Stroke', 'maxi-blocks')}
				disableUnit
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
			<FontFamilySelector
				className='maxi-typography-control__font-family'
				defaultValue={getDefaultAttribute(
					'number-counter-title-font-family'
				)}
				font={props['number-counter-title-font-family']}
				onChange={font =>
					onChange({
						['number-counter-title-font-family']: font.value,
					})
				}
			/>
			<SizeControl
				label={__('Title Font Size', 'maxi-blocks')}
				disableUnit
				min={32}
				max={999}
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
			<FancyRadioControl
				label={__('Show Percentage Sign', 'maxi-block')}
				selected={props['number-counter-percentage-sign-status']}
				options={[
					{ label: __('Yes', 'maxi-block'), value: 1 },
					{ label: __('No', 'maxi-block'), value: 0 },
				]}
				onChange={val =>
					onChange({ 'number-counter-percentage-sign-status': val })
				}
			/>
			<FancyRadioControl
				label={__('Hide Circle', 'maxi-block')}
				selected={props['number-counter-circle-status']}
				options={[
					{ label: __('Yes', 'maxi-block'), value: 1 },
					{ label: __('No', 'maxi-block'), value: 0 },
				]}
				onChange={val => {
					onChange({ 'number-counter-circle-status': val });

					if (!val && props['number-counter-end'] > 100)
						onChange({ 'number-counter-end': 100 });
				}}
			/>
			{!props['number-counter-circle-status'] && (
				<FancyRadioControl
					label={__('Rounded Bar', 'maxi-block')}
					selected={props['number-counter-rounded-status']}
					options={[
						{ label: __('Yes', 'maxi-block'), value: 1 },
						{ label: __('No', 'maxi-block'), value: 0 },
					]}
					onChange={val =>
						onChange({ 'number-counter-rounded-status': val })
					}
				/>
			)}
			<hr />
			<ColorControl
				label={__('Text', 'maxi-blocks')}
				color={props['number-counter-text-color']}
				defaultColor={getDefaultAttribute('number-counter-text-color')}
				onChange={val => onChange({ 'number-counter-text-color': val })}
				showPalette
				palette={{ ...getGroupAttributes(props, 'palette') }}
				isHover={false}
				colorPaletteType='typography'
				onChangePalette={val => onChange(val)}
				clientId={clientId}
			/>
			<hr />
			<ColorControl
				label={__('Circle Background', 'maxi-blocks')}
				color={props['number-counter-circle-background-color']}
				defaultColor={getDefaultAttribute(
					'number-counter-circle-background-color'
				)}
				onChange={val =>
					onChange({ 'number-counter-circle-background-color': val })
				}
				showPalette
				palette={{ ...getGroupAttributes(props, 'palette') }}
				isHover={false}
				colorPaletteType='circle-background'
				onChangePalette={val => onChange(val)}
				clientId={clientId}
			/>
			<hr />
			<ColorControl
				label={__('Circle Bar', 'maxi-blocks')}
				color={props['number-counter-circle-bar-color']}
				defaultColor={getDefaultAttribute(
					'number-counter-circle-bar-color'
				)}
				onChange={val =>
					onChange({ 'number-counter-circle-bar-color': val })
				}
				showPalette
				palette={{ ...getGroupAttributes(props, 'palette') }}
				isHover={false}
				colorPaletteType='circle-bar-background'
				onChangePalette={val => onChange(val)}
				clientId={clientId}
			/>
		</div>
	);
};

export default NumberCounterControl;
