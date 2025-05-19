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

	const { customColors } = useSelect(select => {
		const {
			receiveSelectedStyleCardValue,
			receiveMaxiSelectedStyleCardValue,
		} = select('maxiBlocks/style-cards');

		// Try multiple strategies to get custom colors in order of preference
		// First check if we can get them directly from receiveSelectedStyleCardValue
		let colors = receiveSelectedStyleCardValue(
			'customColors',
			null,
			'color'
		);

		// If that fails, try the direct selector
		if (!colors || colors.length === 0) {
			colors = receiveMaxiSelectedStyleCardValue('customColors') || [];
		}

		// If still no colors, try to get the styleCard directly
		if (!colors || colors.length === 0) {
			const styleCard = select(
				'maxiBlocks/style-cards'
			).receiveMaxiSelectedStyleCard();

			if (styleCard && styleCard.value) {
				// Check multiple possible locations for custom colors
				colors =
					styleCard.value.light?.styleCard?.color?.customColors ||
					styleCard.value.dark?.styleCard?.color?.customColors ||
					styleCard.value.color?.customColors ||
					[];
			}
		}

		return {
			customColors: colors || [],
		};
	});

	const paletteStatus = globalStatus && !paletteSCStatus;

	const getIsActive = item => {
		// item can be a number (for standard palette 1-8) or a numeric ID (for custom colors)
		if (paletteStatus && globalPaletteColor === item) return true;
		if (!paletteStatus && value === item) return true;

		return false;
	};

	return (
		<div className='maxi-color-control__palette'>
			<BaseControl
				__nextHasNoMarginBottom
				className='maxi-color-control__palette-label'
				label={label ? `${label} colour` : ''}
			>
				<div className='maxi-color-control__palette-container'>
					{/* Standard palette colors */}
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
				</div>
				{/* Custom palette colors */}
				{customColors.length > 0 && (
					<div className='maxi-color-control__palette-custom'>
						<div className='maxi-color-control__palette-custom-header'>
							{__('Custom colours', 'maxi-blocks')}
						</div>
						<div className='maxi-color-control__palette-container'>
							{customColors.map((color, index) => {
								return (
									<button
										key={`maxi-color-control__palette-custom-box-${color.id}`}
										type='button'
										aria-label={
											color.name ||
											sprintf(
												// translators: Generic label for a custom color if no name is provided.
												__(
													'Custom Colour %d',
													'maxi-blocks'
												),
												// Using a simple index for this sprintf as it's just for a fallback aria-label
												// The actual ID is color.id and is a large number.
												customColors.findIndex(
													c => c.id === color.id
												) + 1
											)
										}
										title={
											color.name ||
											sprintf(
												__(
													'Custom Colour %d',
													'maxi-blocks'
												),
												customColors.findIndex(
													c => c.id === color.id
												) + 1
											)
										}
										className={classnames(
											'maxi-color-control__palette-box',
											'maxi-color-control__palette-custom-box',
											getIsActive(color.id) && // Use color.id (numeric) for active check
												'maxi-color-control__palette-box--active'
										)}
										data-item={color.id} // Use color.id (numeric) for data-item
										onClick={e =>
											onChange({
												// Ensure paletteColor is passed as a number if it's a numeric ID from data-item
												paletteColor: Number(
													e.currentTarget.dataset.item
												),
											})
										}
									>
										<span
											className='maxi-color-control__palette-custom-item'
											style={{
												backgroundColor: color.value,
											}}
										/>
									</button>
								);
							})}
						</div>
					</div>
				)}
				{!disableReset && (
					<ResetButton
						onReset={e => {
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
