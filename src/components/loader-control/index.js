/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState } = wp.element;
const { SelectControl, Button } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const LoaderControl = props => {
	const {
		options,
		buttonText = __('Add New Layer', 'maxi-blocks'),
		onChange,
		onClick,
		className,
		forwards = false,
	} = props;

	const [presetLoad, setPresetLoad] = useState(options[0].value);

	const classes = classnames('maxi-loader-control', className);

	return (
		<div className={classes}>
			<SelectControl
				className='maxi-loader-control__options'
				value={presetLoad}
				options={options}
				onChange={val => {
					onChange && onChange(val);
					setPresetLoad(val);
				}}
			/>
			<Button
				className='maxi-loader-control__add'
				onClick={() => {
					onClick(presetLoad);
					!forwards && setPresetLoad('');
				}}
			>
				{buttonText}
			</Button>
		</div>
	);
};

export default LoaderControl;
