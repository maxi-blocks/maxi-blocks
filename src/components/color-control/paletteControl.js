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
import { has } from 'lodash';

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
		textLevel,
		allowedGlobalTypes,
		clientId,
		className,
	} = props;

	const { selectedSC, currentBlockName } = useSelect(select => {
		const { receiveMaxiSelectedStyleCard } = select(
			'maxiBlocks/style-cards'
		);

		const selectedSC = receiveMaxiSelectedStyleCard()?.value || {};

		const { getSelectedBlockClientId, getBlockName } =
			select('core/block-editor');

		const currentBlockName = getBlockName(getSelectedBlockClientId());

		return {
			selectedSC,
			currentBlockName,
		};
	});

	const currentSC = selectedSC[`${getBlockStyle(clientId)}`].styleCard;

	const paletteClasses = classnames(
		'maxi-sc-color-palette',
		(currentBlockName === 'maxi-blocks/svg-icon-maxi' &&
			allowedGlobalTypes.includes('icon-line-color') &&
			has(currentSC.icon, 'line-global') &&
			currentSC.icon['line-global']) ||
			(currentBlockName === 'maxi-blocks/svg-icon-maxi' &&
				allowedGlobalTypes.includes('icon-fill-color') &&
				has(currentSC.icon, 'fill-global') &&
				currentSC.icon['fill-global']) ||
			(currentBlockName === 'maxi-blocks/divider-maxi' &&
				allowedGlobalTypes.includes('divider-color') &&
				has(currentSC, 'divider') &&
				currentSC.divider['color-global']) ||
			(currentBlockName === 'maxi-blocks/text-maxi' &&
				allowedGlobalTypes.includes('text-color') &&
				has(currentSC, textLevel) &&
				currentSC[textLevel]['color-global']) ||
			(currentBlockName === 'maxi-blocks/button-maxi' &&
				allowedGlobalTypes.includes('button-background-color') &&
				has(currentSC, 'button') &&
				currentSC.button['background-color-global']) ||
			(currentBlockName === 'maxi-blocks/button-maxi' &&
				allowedGlobalTypes.includes('button-color') &&
				has(currentSC, 'button') &&
				currentSC.button['color-global'])
			? 'palette-disabled'
			: null
	);

	const classes = classnames(
		`maxi-color-palette-control maxi-color-palette--${getBlockStyle(
			clientId
		)}`,
		className
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
					{ label: __('Yes', 'maxi-blocks'), value: 0 },
					{ label: __('No', 'maxi-blocks'), value: 1 },
				]}
				onChange={val => onChange({ paletteStatus: val })}
			/>
		</div>
	);
};

export default ColorPaletteControl;
