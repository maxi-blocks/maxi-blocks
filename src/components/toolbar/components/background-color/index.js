/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorControl from '../../../color-control';
import FancyRadioControl from '../../../toggle-switch';
import {
	getDefaultAttribute,
	getBlockStyle,
	getColorRGBAString,
} from '../../../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';

/**
 * BackgroundColor
 */
const BackgroundColor = props => {
	const { blockName, onChange, clientId } = props;

	if (
		blockName === 'maxi-blocks/divider-maxi' ||
		blockName === 'maxi-blocks/text-maxi'
	)
		return null;

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [useColorBackground, setUseColorBackground] = useState(
		props['background-active-media'] === 'color'
	);

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			advancedOptions='background'
			tooltip={
				!useColorBackground
					? __('Background Colour Disabled', 'maxi-blocks')
					: __('Background Colour', 'maxi-blocks')
			}
			icon={
				<div
					className='toolbar-item__icon'
					style={{
						...(!useColorBackground
							? {
									background: '#fff',
									clipPath:
										'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
							  }
							: {
									background: props[
										'background-palette-color-status'
									]
										? getColorRGBAString({
												firstVal: `color-${props['background-palette-color']}`,
												opacity:
													props[
														'background-palette-opacity'
													],
												blockStyle:
													getBlockStyle(clientId),
										  })
										: props['background-color'],
									border: '1px solid #fff',
							  }),
					}}
				/>
			}
		>
			<div className='toolbar-item__background__popover'>
				<FancyRadioControl
					label={__('Enable Background Colour', 'maxi-blocks')}
					selected={useColorBackground}
					options={[
						{
							label: __('Yes', 'maxi-blocks'),
							value: 1,
						},
						{
							label: __('No', 'maxi-blocks'),
							value: 0,
						},
					]}
					onChange={val => {
						onChange({
							'background-active-media': val ? 'color' : 'none',
						});
						setUseColorBackground(val);
					}}
				/>
				{useColorBackground && (
					<ColorControl
						label={__('Background', 'maxi-blocks')}
						color={props['background-color']}
						defaultColor={getDefaultAttribute('background-color')}
						paletteColor={props['background-palette-color']}
						paletteStatus={props['background-palette-color-status']}
						onChange={({ color, paletteColor, paletteStatus }) =>
							onChange({
								'background-active-media': 'color',
								'background-color': color,
								'background-palette-color': paletteColor,
								'background-palette-color-status':
									paletteStatus,
							})
						}
						showPalette
						globalProps={
							blockName === 'maxi-blocks/button-maxi' && {
								target: 'background-color-global',
								type: 'button',
							}
						}
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default BackgroundColor;
