/**
 * Wordpress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

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

	const paletteStatus = globalStatus && !paletteSCStatus;

	const getIsActive = item => {
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
