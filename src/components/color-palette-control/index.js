/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { FancyRadioControl } from '..';

import { useState } from '@wordpress/element';

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

	const getColorPaletteType = `${colorPaletteType}-preset-color`;

	const classes = classnames('maxi-color-palette-control', className);

	return (
		<div className={classes}>
			<FancyRadioControl
				className='maxi-sc-color-palette'
				selected={getColorPaletteType}
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
				onChange={val => onChange({ getColorPaletteType: val })}
			/>
		</div>
	);
};

export default ColorPaletteControl;
