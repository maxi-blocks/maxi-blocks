/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { FancyRadioControl } from '..';

/**
 * Internal dependencies
 */
import {
	getPaletteDefault,
	getDefaultAttribute,
} from '../../extensions/styles';

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
		blockName,
		textLevel,
		deviceType,
	} = props;

	const classes = classnames('maxi-color-palette-control', className);

	const currentItem = !isNil(
		props[
			`palette-preset-${colorPaletteType}${isHover ? '-hover' : ''}-color`
		]
	)
		? props[
				`palette-preset-${colorPaletteType}${
					isHover ? '-hover' : ''
				}-color`
		  ]
		: getPaletteDefault(colorPaletteType, blockName, textLevel);

	return (
		<div className={classes}>
			{!props[
				`palette-custom-${colorPaletteType}${
					isHover ? '-hover' : ''
				}-color`
			] && (
				<div className='maxi-sc-color-palette'>
					{['1', '2', '3', '4', '5', '6', '7'].map(item => (
						<div
							key={`maxi-sc-color-palette__box__${item}`}
							className={`maxi-sc-color-palette__box ${
								String(currentItem) === item
									? 'maxi-sc-color-palette__box__active'
									: ''
							}`}
							data-item={item}
							onClick={e =>
								onChange({
									[`palette-preset-${colorPaletteType}${
										isHover ? '-hover' : ''
									}-color`]: e.currentTarget.dataset.item,
								})
							}
						>
							<span
								className={`maxi-sc-color-palette__box__item maxi-sc-color-palette__box__item__${item}`}
							></span>
						</div>
					))}
				</div>
			)}
			<FancyRadioControl
				label={__('Custom Colour', 'maxi-blocks')}
				className='maxi-sc-color-palette__custom'
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
				onChange={val => {
					onChange({
						[`palette-custom-${colorPaletteType}${
							isHover ? '-hover' : ''
						}-color`]: val,
					});

					if (
						!!props[
							`palette-custom-${colorPaletteType}${
								isHover ? '-hover' : ''
							}-color`
						] &&
						colorPaletteType === 'box-shadow'
					)
						onChange({
							[`box-shadow-color-${deviceType}`]: getDefaultAttribute(
								`box-shadow-color-${deviceType}`
							),
						});
				}}
			/>
		</div>
	);
};

export default ColorPaletteControl;
