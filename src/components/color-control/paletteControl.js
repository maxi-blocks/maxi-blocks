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
		const { receiveSelectedStyleCardValue } = select(
			'maxiBlocks/style-cards'
		);

		return {
			customColors:
				receiveSelectedStyleCardValue('customColors', null, 'color') ||
				[],
		};
	});

	const paletteStatus = globalStatus && !paletteSCStatus;

	const getIsActive = item => {
		if (paletteStatus && globalPaletteColor === item) return true;
		if (!paletteStatus && value === item) return true;

		return false;
	};

	const getColorId = (color, index) => {
		return `${color.replace(/[^a-zA-Z0-9]/g, '')}-${index}`;
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

					{/* Custom palette colors */}
					{customColors.length > 0 && (
						<div className='maxi-color-control__palette-custom'>
							{customColors.map((color, index) => (
								<button
									key={`maxi-color-control__palette-custom-box-${getColorId(
										color,
										index
									)}`}
									type='button'
									aria-label={sprintf(
										// translators: %s: custom color number
										__('Custom colour %s', 'maxi-blocks'),
										index + 1
									)}
									className={classnames(
										'maxi-color-control__palette-box',
										'maxi-color-control__palette-custom-box',
										getIsActive(`custom-${index}`) &&
											'maxi-color-control__palette-box--active'
									)}
									data-item={`custom-${index}`}
									onClick={e =>
										onChange({
											paletteColor:
												e.currentTarget.dataset.item,
										})
									}
								>
									<span
										className='maxi-color-control__palette-custom-item'
										style={{ backgroundColor: color }}
									/>
								</button>
							))}
						</div>
					)}
				</div>
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
