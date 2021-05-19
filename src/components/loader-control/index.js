/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';

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
