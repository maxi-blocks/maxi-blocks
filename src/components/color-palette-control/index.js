/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { FancyRadioControl } from '..';

const { useState } = wp.element;

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
	const { className, value, onChange, setAttributes, colorPreSet } = props;

	const [state, setState] = useState({
		lastLevel: value,
		p: {},
		pHover: {},
		h1: {},
		h1Hover: {},
		h2: {},
		h2Hover: {},
		h3: {},
		h3Hover: {},
		h4: {},
		h4Hover: {},
		h5: {},
		h5Hover: {},
		h6: {},
		h6Hover: {},
	});

	const classes = classnames('maxi-color-palette-control', className);

	return (
		<div className={classes}>
			<FancyRadioControl
				selected={colorPreSet}
				optionType='number'
				options={[
					{ label: 1, value: 1 },
					{ label: 2, value: 2 },
					{ label: 3, value: 3 },
					{ label: 4, value: 4 },
					{ label: 5, value: 5 },
					{ label: 6, value: 6 },
					{ label: 7, value: 7 },
				]}
				onChange={val => setAttributes(val)}
			/>
		</div>
	);
};

export default ColorPaletteControl;
