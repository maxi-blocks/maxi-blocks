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
	const { className, onChange, colorPaletteType = 'background' } = props;

	const classes = classnames('maxi-color-palette-control', className);

	return (
		<div className={classes}>
			<FancyRadioControl
				label={__('Custom Colour', 'maxi-blocks')}
				selected={props['palette-custom-color']}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val =>
					onChange({
						['palette-custom-color']: val,
					})
				}
			/>
			<FancyRadioControl
				className='maxi-sc-color-palette'
				selected={props[`${colorPaletteType}-palette-preset-color`]}
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
						[`${colorPaletteType}-palette-preset-color`]: val,
					})
				}
			/>
		</div>
	);
};

export default ColorPaletteControl;
