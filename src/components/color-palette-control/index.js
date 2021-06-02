/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import FancyRadioControl from '../fancy-radio-control';
import { getPaletteDefault, getBlockStyle } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, isEmpty } from 'lodash';

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
		paletteLabel = '',
		onChange,
		colorPaletteType = 'background',
		isHover,
		textLevel,
		deviceType,
		clientId,
	} = props;

	const currentBlockName = select('core/block-editor').getBlockName(clientId);

	const { activeSC } = useSelect(select => {
		const { receiveMaxiSelectedStyleCard } = select(
			'maxiBlocks/style-cards'
		);

		const activeSC = receiveMaxiSelectedStyleCard()?.value || {};

		return {
			activeSC,
		};
	});

	const currentShortBlockName = currentBlockName.substring(
		12,
		currentBlockName.lastIndexOf('-maxi')
	);

	const paletteStatus = !isEmpty(activeSC)
		? activeSC.styleCard[`${getBlockStyle(clientId)}`][
				`${
					currentShortBlockName === 'text'
						? textLevel
						: currentShortBlockName
				}-${
					colorPaletteType === 'typography' ||
					colorPaletteType === 'divider'
						? 'color'
						: `${colorPaletteType}-color`
				}-global`
		  ]
		: false;

	const classes = classnames(
		`maxi-color-palette-control maxi-color-palette--${getBlockStyle(
			clientId
		)}`,
		className
	);

	const paletteClasses = classnames(
		'maxi-sc-color-palette',
		paletteStatus && 'palette-disabled'
	);

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
		: getPaletteDefault(colorPaletteType, currentBlockName, textLevel);

	const onChangePaletteWithType = colorPaletteType => {
		switch (colorPaletteType) {
			case 'box-shadow':
				onChange({
					[`box-shadow-color-${deviceType}`]: '',
				});
				break;

			case 'border':
				onChange({
					[`border-color-${deviceType}`]: '',
				});
				break;

			case 'typography':
				onChange({
					[`color-${deviceType}`]: '',
				});
				break;

			case 'background':
				onChange({
					'background-color': '',
				});
				break;

			case 'divider':
				onChange({
					'divider-border-color': '',
				});
				break;

			case 'icon':
				onChange({
					'icon-color': '',
				});
				break;

			case 'svgColorFill':
				onChange({
					svgColorFill: '',
				});
				break;

			case 'svgColorLine':
				onChange({
					svgColorLine: '',
				});
				break;

			case 'marker-text':
				onChange({
					'marker-text': '',
				});
				break;

			case 'marker-address':
				onChange({
					'marker-address': '',
				});
				break;

			default:
				return null;
		}
		return null;
	};

	return (
		<div className={classes}>
			{!props[
				`palette-custom-${colorPaletteType}${
					isHover ? '-hover' : ''
				}-color`
			] && (
				<BaseControl
					className='maxi-color-palette-control__palette-label'
					label={paletteLabel ? `${paletteLabel} Colour` : ''}
				>
					<div className={paletteClasses}>
						{[1, 2, 3, 4, 5, 6, 7].map(item => (
							<div
								key={`maxi-sc-color-palette__box__${item}`}
								className={`maxi-sc-color-palette__box ${
									currentItem === item
										? 'maxi-sc-color-palette__box--active'
										: ''
								}`}
								data-item={item}
								onClick={e =>
									onChange({
										[`palette-preset-${colorPaletteType}${
											isHover ? '-hover' : ''
										}-color`]:
											+e.currentTarget.dataset.item,
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
						props[
							`palette-custom-${colorPaletteType}${
								isHover ? '-hover' : ''
							}-color`
						]
					)
						onChangePaletteWithType(colorPaletteType);
				}}
			/>
		</div>
	);
};

export default ColorPaletteControl;
