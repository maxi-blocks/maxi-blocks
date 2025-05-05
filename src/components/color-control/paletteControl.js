/**
 * Wordpress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import BaseControl from '@components/base-control';
import OpacityControl from '@components/opacity-control';
import ResetButton from '@components/reset-control';
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
const ColorPaletteControl = props => {
	const {
		label = '',
		value,
		paletteSCStatus,
		onChange,
		disableOpacity,
		opacity = 1,
		disableReset,
		onReset,
		onResetOpacity,
		globalStatus,
		globalPaletteColor,
		globalPaletteOpacity,
	} = props;

	// Get custom colors from the active style card
	const customColors = useSelect(select => {
		const { receiveMaxiActiveStyleCard } = select('maxiBlocks/style-cards');
		const activeStyleCard = receiveMaxiActiveStyleCard();
		const { value: activeSCValue } = activeStyleCard;

		return activeSCValue?.light?.styleCard?.color?.customColors || [];
	}, []);

	const paletteStatus = globalStatus && !paletteSCStatus;

	const getIsActive = item => {
		if (paletteStatus && globalPaletteColor === item) return true;
		if (!paletteStatus && value === item) return true;

		return false;
	};

	// Check if a custom color is active
	const isCustomColorActive = customColorId => {
		if (paletteStatus && globalPaletteColor === customColorId) return true;
		if (!paletteStatus && value === customColorId) return true;

		return false;
	};

	return (
		<div className='maxi-color-control__palette'>
			<BaseControl
				className='maxi-color-control__palette-label'
				label={label ? `${label} colour` : ''}
			>
				<div className='maxi-color-control__palette-container'>
					{/* Standard Palette Colors */}
					{[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
						<button
							key={`maxi-color-control__palette-box__${item}`}
							type='button'
							aria-label={sprintf(
								// translators: %s: color number
								__('Pallet box colour %s', 'maxi-blocks'),
								item
							)}
							className={classnames(
								'maxi-color-control__palette-box',
								getIsActive(item) &&
									'maxi-color-control__palette-box--active'
							)}
							data-item={item}
							onClick={e =>
								onChange({
									paletteColor: +e.currentTarget.dataset.item,
								})
							}
						>
							<span
								className={classnames(
									'maxi-color-control__palette-item',
									`maxi-color-control__palette-item__${item}`
								)}
							/>
						</button>
					))}

					{/* Custom Colors */}
					{!isEmpty(customColors) &&
						customColors.map(customColor => (
							<button
								key={`maxi-color-control__palette-box__${customColor.id}`}
								type='button'
								aria-label={sprintf(
									// translators: %s: custom color name
									__('Custom color: %s', 'maxi-blocks'),
									customColor.name
								)}
								className={classnames(
									'maxi-color-control__palette-box',
									'maxi-color-control__palette-box--custom',
									isCustomColorActive(customColor.id) &&
										'maxi-color-control__palette-box--active'
								)}
								data-item={customColor.id}
								onClick={() =>
									onChange({
										paletteColor: customColor.id,
									})
								}
							>
								<span
									className='maxi-color-control__palette-item maxi-color-control__palette-item--custom'
									title={customColor.name}
									style={{
										background: `rgba(${customColor.value}, 1)`,
									}}
								/>
							</button>
						))}
				</div>
				{!disableReset && (
					<ResetButton
						onReset={() => {
							onReset();
						}}
						isSmall
					/>
				)}
			</BaseControl>
			{!disableOpacity && (
				<OpacityControl
					label={__('Colour opacity', 'maxi-blocks')}
					opacity={globalStatus ? globalPaletteOpacity : opacity}
					onChangeOpacity={val =>
						onChange({
							paletteOpacity: val,
						})
					}
					onReset={onResetOpacity}
					disableRTC
				/>
			)}
		</div>
	);
};

export default ColorPaletteControl;
