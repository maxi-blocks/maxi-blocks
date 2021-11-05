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
		onChange,
		globalProps,
		disableOpacity,
		opacity = 1,
		clientId,
	} = props;

	const { globalStatus, globalPaletteColor, globalPaletteOpacity } =
		useSelect(select => {
			const { receiveStyleCardValue } = select('maxiBlocks/style-cards');

			const prefix = globalProps?.target ? `${globalProps?.target}-` : '';

			const globalStatus = globalProps
				? receiveStyleCardValue(
						`${prefix}color-global`,
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

	const paletteClasses = classnames(
		'maxi-sc-color-palette',
		globalStatus && 'palette-disabled'
	);

	const getIsActive = item => {
		if (globalStatus && globalPaletteColor === item) return true;
		if (!globalStatus && value === item) return true;

		return false;
	};

	return (
		<>
			<BaseControl
				className='maxi-color-palette-control__palette-label'
				label={label ? `${label} colour` : ''}
			>
				<div className={paletteClasses}>
					{[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
						<button
							key={`maxi-sc-color-palette__box__${item}`}
							type='button'
							aria-label={sprintf(
								__('Pallet box colour %s', 'maxi-blocks'),
								item
							)}
							className={`maxi-sc-color-palette__box ${
								getIsActive(item)
									? 'maxi-sc-color-palette__box--active'
									: ''
							}`}
							data-item={item}
							onClick={e =>
								onChange({
									paletteColor: +e.currentTarget.dataset.item,
								})
							}
						>
							<span
								className={`maxi-sc-color-palette__box__item maxi-sc-color-palette__box__item__${item}`}
							/>
						</button>
					))}
				</div>
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
				/>
			)}
		</>
	);
};

export default ColorPaletteControl;
