/**
 * Wordpress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import OpacityControl from '../opacity-control';
import { getBlockStyle } from '../../extensions/styles';
import Button from '../button';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';
import { reset } from '../../icons';

/**
 * Component
 */
const ColorPaletteControl = props => {
	const {
		label = '',
		value,
		onChange,
		globalProps,
		noColorPrefix = false,
		disableOpacity,
		opacity = 1,
		clientId,
		disableReset,
		onReset,
		onResetOpacity,
	} = props;

	const { globalStatus, globalPaletteColor, globalPaletteOpacity } =
		useSelect(select => {
			const { receiveStyleCardValue } = select('maxiBlocks/style-cards');

			const prefix = globalProps?.target ? `${globalProps?.target}-` : '';

			const globalStatus = globalProps
				? receiveStyleCardValue(
						`${prefix}${noColorPrefix ? '' : 'color-'}global`,
						globalProps ? getBlockStyle(clientId) : null,
						globalProps?.type
				  )
				: false;
			const globalPaletteColor = globalProps
				? receiveStyleCardValue(
						`${prefix}palette-color`,
						globalProps ? getBlockStyle(clientId) : null,
						globalProps?.type
				  )
				: false;
			const globalPaletteOpacity = globalProps
				? receiveStyleCardValue(
						`${prefix}palette-opacity`,
						globalProps ? getBlockStyle(clientId) : null,
						globalProps?.type
				  )
				: false;

			return { globalStatus, globalPaletteColor, globalPaletteOpacity };
		});

	const classes = classnames(
		'maxi-color-control__palette',
		globalStatus && 'maxi-color-control__palette--disabled'
	);

	const getIsActive = item => {
		if (globalStatus && globalPaletteColor === item) return true;
		if (!globalStatus && value === item) return true;

		return false;
	};

	return (
		<div className={classes}>
			<BaseControl
				className='maxi-color-control__palette-label'
				label={label ? `${label} colour` : ''}
			>
				<div className='maxi-color-control__palette-container'>
					{[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
						<button
							key={`maxi-color-control__palette-box__${item}`}
							type='button'
							aria-label={sprintf(
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
					<Button
						className='components-maxi-control__reset-button'
						onClick={e => {
							e.preventDefault();
							onReset();
						}}
						isSmall
						aria-label={sprintf(
							/* translators: %s: a textual label  */
							__('Reset %s settings', 'maxi-blocks'),
							label.toLowerCase()
						)}
						type='reset'
					>
						{reset}
					</Button>
				)}
			</BaseControl>
			{!disableOpacity && (
				<OpacityControl
					label={__('Colour opacity', 'maxi-blocks')}
					opacity={globalStatus ? globalPaletteOpacity : opacity}
					onChange={val =>
						onChange({
							paletteOpacity: val,
						})
					}
					onReset={onResetOpacity}
				/>
			)}
		</div>
	);
};

export default ColorPaletteControl;
