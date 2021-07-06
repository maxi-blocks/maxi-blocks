/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import FancyRadioControl from '../fancy-radio-control';
import ColorControl from '../color-control';
import BorderControl from '../border-control';
import {
	getDefaultAttribute,
	getGroupAttributes,
} from '../../extensions/styles';
import Icon from '../icon';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	smileIcon,
	backgroundColor,
	backgroundGradient,
	solid,
} from '../../icons';

/**
 * Component
 */
const IconControl = props => {
	const { className, onChange, clientId, deviceType } = props;

	const classes = classnames('maxi-icon-control', className);

	const [iconStyle, setIconStyle] = useState('color');

	const getOptions = () => {
		const options = [];

		options.push({
			label: <Icon icon={smileIcon} />,
			value: 'color',
		});

		options.push({
			label: <Icon icon={backgroundColor} />,
			value: 'background-color',
		});

		options.push({
			label: <Icon icon={backgroundGradient} />,
			value: 'gradient',
		});

		options.push({
			label: <Icon icon={solid} />,
			value: 'border',
		});

		return options;
	};

	return (
		<div className={classes}>
			<AdvancedNumberControl
				label={__('Size', 'maxi-blocks')}
				min={1}
				max={999}
				initial={1}
				step={1}
				value={props['icon-size']}
				onChangeValue={val => onChange({ 'icon-size': val })}
				onReset={() =>
					onChange({ 'icon-size': getDefaultAttribute('icon-size') })
				}
			/>
			<AdvancedNumberControl
				label={__('Spacing', 'maxi-blocks')}
				min={1}
				max={999}
				initial={1}
				step={1}
				value={props['icon-spacing']}
				onChangeValue={val => onChange({ 'icon-spacing': val })}
				onReset={() =>
					onChange({
						'icon-spacing': getDefaultAttribute('icon-spacing'),
					})
				}
			/>
			<FancyRadioControl
				label={__('Icon Position', 'maxi-block')}
				selected={props['icon-position']}
				options={[
					{ label: __('Right', 'maxi-block'), value: 'right' },
					{ label: __('Left', 'maxi-block'), value: 'left' },
				]}
				optionType='string'
				onChange={val =>
					onChange({
						'icon-position': val,
					})
				}
			/>
			<FancyRadioControl
				label=''
				fullWidthMode
				selected={iconStyle}
				options={getOptions()}
				optionType='string'
				onChange={val => setIconStyle(val)}
			/>
			{iconStyle === 'color' && (
				<ColorControl
					label={__('Icon', 'maxi-blocks')}
					color={props['icon-color']}
					defaultColor={getDefaultAttribute('icon-color')}
					paletteColor={props['icon-palette-color']}
					paletteStatus={props['icon-palette-color-status']}
					onChange={({ color, paletteColor, paletteStatus }) => {
						onChange({
							'icon-color': color,
							'icon-palette-color': paletteColor,
							'icon-palette-color-status': paletteStatus,
						});
					}}
					showPalette
					disableOpacity
				/>
			)}
			{iconStyle === 'border' && (
				<BorderControl
					{...getGroupAttributes(props, [
						'iconBorder',
						'iconBorderWidth',
						'iconBorderRadius',
					])}
					prefix='icon-'
					onChange={obj => onChange(obj)}
					breakpoint={deviceType}
					clientId={clientId}
				/>
			)}
		</div>
	);
};

export default IconControl;
