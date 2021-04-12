/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { FancyRadioControl } from '..';

/**
 * Internal dependencies
 */
import getPaletteDefault from '../../extensions/styles/getPaletteDefault';

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
		className,
		onChange,
		colorPaletteType = 'background',
		isHover,
	} = props;

	const classes = classnames('maxi-color-palette-control', className);

	return (
		<div className={classes}>
			{!props[
				`palette-custom-${colorPaletteType}${
					isHover ? '-hover' : ''
				}-color`
			] && (
				<FancyRadioControl
					className='maxi-sc-color-palette'
					selected={
						!isNil(
							props[
								`palette-preset-${colorPaletteType}${
									isHover ? '-hover' : ''
								}-color`
							]
						)
							? props[
									`palette-preset-${colorPaletteType}${
										isHover ? '-hover' : ''
									}-color`
							  ]
							: getPaletteDefault(colorPaletteType)
					}
					optionType='number'
					options={[
						{ value: 1 },
						{ value: 2 },
						{ value: 3 },
						{ value: 4 },
						{ value: 5 },
						{ value: 6 },
						{ value: 7 },
					]}
					onChange={val =>
						onChange({
							[`palette-preset-${colorPaletteType}${
								isHover ? '-hover' : ''
							}-color`]: val,
						})
					}
				/>
			)}
			<FancyRadioControl
				label={__('Custom Colour', 'maxi-blocks')}
				selected={
					props[
						`palette-custom-${colorPaletteType}${
							isHover ? '-hover' : ''
						}-color`
					]
				}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val =>
					onChange({
						[`palette-custom-${colorPaletteType}${
							isHover ? '-hover' : ''
						}-color`]: val,
					})
				}
			/>
		</div>
	);
};

export default ColorPaletteControl;
