/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { FancyRadioControl } from '..';

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
const ColorPaletteControl = props => {
	const {
		className,
		onChange,
		colorPaletteType = 'background',
		isHover,
	} = props;

	const classes = classnames('maxi-color-palette-control', className);

	return (
		<div className={classes}>
			<FancyRadioControl
				label={__('Custom Colour', 'maxi-blocks')}
				selected={
					props[
						`palette-custom-${colorPaletteType}-color${
							isHover ? '-hover' : ''
						}`
					]
				}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val =>
					onChange({
						[`palette-custom-${colorPaletteType}-color${
							isHover ? '-hover' : ''
						}`]: val,
					})
				}
			/>
			<FancyRadioControl
				className='maxi-sc-color-palette'
				selected={
					props[
						`palette-preset-${colorPaletteType}-color${
							isHover ? '-hover' : ''
						}`
					]
				}
				optionType='number'
				options={[
					{ value: 1 },
					{ value: 2 },
					{ value: 3 },
					{ value: 4 },
					{ value: 5 },
					{ value: 6 },
					{ value: 7 },
				]}
				onChange={val =>
					onChange({
						[`palette-preset-${colorPaletteType}-color${
							isHover ? '-hover' : ''
						}`]: val,
					})
				}
			/>
		</div>
	);
};

export default ColorPaletteControl;
