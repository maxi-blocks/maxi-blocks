/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import BaseControl from '../base-control';
import { getBlockStyle } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

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
		opacity = 100,
		defaultOpacity = 100,
		clientId,
	} = props;

	const { globalStatus } = useSelect(select => {
		const globalStatus = globalProps
			? select('maxiBlocks/style-cards').receiveStyleCardGlobalValue(
					globalProps?.target,
					globalProps ? getBlockStyle(clientId) : null,
					globalProps?.type
			  )
			: false;

		return { globalStatus };
	});

	const paletteClasses = classnames(
		'maxi-sc-color-palette',
		globalStatus && 'palette-disabled'
	);

	return (
		<>
			<BaseControl
				className='maxi-color-palette-control__palette-label'
				label={label ? `${label} Colour` : ''}
			>
				<div className={paletteClasses}>
					{[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
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
									paletteColor: +e.currentTarget.dataset.item,
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
			{!disableOpacity && (
				<AdvancedNumberControl
					label={__('Colour Opacity', 'maxi-blocks')}
					value={opacity}
					onChangeValue={val => {
						const value = !isNil(val) ? +val : 0;

						onChange({
							paletteOpacity: value,
						});
					}}
					min={0}
					max={100}
					initialPosition={defaultOpacity}
					onReset={() =>
						onChange({
							paletteOpacity: defaultOpacity,
						})
					}
				/>
			)}
		</>
	);
};

export default ColorPaletteControl;
