/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

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
import { isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';
import { getTypographyFromSC } from '../../extensions/style-cards';

/**
 * Component
 */
const ColorPaletteControl = props => {
	const {
		label = '',
		value,
		status,
		onChange,
		textLevel,
		clientId,
		className,
	} = props;

	const { selectedSC } = useSelect(select => {
		const { receiveMaxiSelectedStyleCard } = select(
			'maxiBlocks/style-cards'
		);

		const selectedSC = receiveMaxiSelectedStyleCard()?.value || {};

		return {
			selectedSC,
		};
	});

	const SCPaletteStatus = !isEmpty(selectedSC)
		? getTypographyFromSC(
				selectedSC[`${getBlockStyle(clientId)}`],
				textLevel
		  )['color-global']
		: false;

	const classes = classnames(
		`maxi-color-palette-control maxi-color-palette--${getBlockStyle(
			clientId
		)}`,
		className
	);

	const paletteClasses = classnames(
		'maxi-sc-color-palette',
		SCPaletteStatus && 'palette-disabled'
	);

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
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val => onChange({ paletteStatus: val })}
			/>
		</div>
	);
};

export default ColorPaletteControl;
