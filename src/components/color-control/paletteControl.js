/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import FancyRadioControl from '../fancy-radio-control';
import { getBlockStyle } from '../../extensions/styles';

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
		label = '',
		value,
		status,
		onChange,
		clientId,
		className,
		globalStatus,
		isHover,
	} = props;

	const paletteClasses = classnames(
		'maxi-sc-color-palette',
		globalStatus && 'palette-disabled'
	);

	const classes = classnames(
		`maxi-color-palette-control maxi-color-palette--${getBlockStyle(
			clientId
		)}`,
		className
	);

	console.log(`isHover ${isHover}`);
	console.log(`status ${status}`);

	return (
		<div className={classes}>
			{status && (
				<BaseControl
					className='maxi-color-palette-control__palette-label'
					label={label ? `${label} Colour` : ''}
				>
					<div className={paletteClasses}>
						{[1, 2, 3, 4, 5, 6, 7].map(item => (
							<div
								key={`maxi-sc-color-palette__box__${item}`}
								className={`maxi-sc-color-palette__box ${
									value === item
										? 'maxi-sc-color-palette__box--active'
										: ''
								}`}
								data-item={item}
								onClick={e =>
									onChange({
										paletteColor:
											+e.currentTarget.dataset.item,
									})
								}
							>
								<span
									className={`maxi-sc-color-palette__box__item maxi-sc-color-palette__box__item__${item}`}
								/>
							</div>
						))}
					</div>
				</BaseControl>
			)}
			<FancyRadioControl
				label={__('Custom Colour', 'maxi-blocks')}
				className='maxi-sc-color-palette__custom'
				selected={status}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 0 },
					{ label: __('No', 'maxi-blocks'), value: 1 },
				]}
				onChange={val => onChange({ paletteStatus: val })}
			/>
		</div>
	);
};

export default ColorPaletteControl;
