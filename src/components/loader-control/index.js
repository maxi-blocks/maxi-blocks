/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Button from '../button';
import Dropdown from '../dropdown';
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
		buttonText = __('Add', 'maxi-blocks'),
		onClick,
		className,
		forwards = false,
		buttonLess = false,
	} = props;

	const [presetLoad, setPresetLoad] = useState(options[0].value);

	const classes = classnames('maxi-loader-control', className);

	return (
		<div className={classes}>
			{!buttonLess && (
				<>
					<SelectControl
						className='maxi-loader-control__options'
						value={presetLoad}
						options={options}
						onChange={val => {
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
				</>
			)}
			{buttonLess && (
				<Dropdown
					className='maxi-loader-control__dropdown'
					contentClassName='maxi-loader-control__dropdown-selector'
					position='bottom center'
					renderToggle={({ onToggle }) => (
						<div
							className='maxi-loader-control__dropdown-selector-title'
							onClick={onToggle}
						>
							{buttonText}
						</div>
					)}
					renderContent={({ onToggle }) => (
						<div className='maxi-loader-content'>
							{options.map(option => (
								<Button
									key={`maxi-loader-control__content-item-${option.value}`}
									className={classnames(
										'maxi-loader-control__content-item',
										`maxi-loader-control__content-item-${option.value}`
									)}
									onClick={() => {
										onClick(option.value);

										onToggle();
									}}
								>
									{option.label}
								</Button>
							))}
						</div>
					)}
				/>
			)}
		</div>
	);
};

export default LoaderControl;
