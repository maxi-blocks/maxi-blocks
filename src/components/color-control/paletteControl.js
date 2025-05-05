/**
 * Wordpress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

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

	// Use local state for custom colors that will be updated via event listener
	const [localCustomColors, setLocalCustomColors] = useState([]);

	// Get custom colors from the active style card
	const customColors = useSelect(select => {
		const { receiveMaxiActiveStyleCard } = select('maxiBlocks/style-cards');
		const activeStyleCard = receiveMaxiActiveStyleCard();
		const { value: activeSCValue } = activeStyleCard;

		return activeSCValue?.light?.styleCard?.color?.customColors || [];
	}, []);

	// Set local custom colors initially from props
	useEffect(() => {
		setLocalCustomColors(customColors);
	}, [customColors]);

	// Add event listener for custom color updates
	useEffect(() => {
		const handleCustomColorsUpdated = event => {
			// Update local custom colors from the event
			if (event?.detail?.customColors) {
				setLocalCustomColors(event.detail.customColors);
			}
		};

		// Listen for custom colors updated event
		document.addEventListener(
			'maxi-blocks-sc-custom-colors-updated',
			handleCustomColorsUpdated
		);

		// Clean up
		return () => {
			document.removeEventListener(
				'maxi-blocks-sc-custom-colors-updated',
				handleCustomColorsUpdated
			);
		};
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

	// Use the local state for rendering custom colors
	const customColorsToRender =
		localCustomColors.length > 0 ? localCustomColors : customColors;

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
					{!isEmpty(customColorsToRender) &&
						customColorsToRender.map(customColor => (
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
