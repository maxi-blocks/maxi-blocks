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
import FancyRadioControl from '../../../fancy-radio-control';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getBlockStyle,
} from '../../../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';

/**
 * BackgroundColor
 */
const BackgroundColor = props => {
	const { blockName, onChange, breakpoint, clientId } = props;

	if (
		blockName === 'maxi-blocks/divider-maxi' ||
		blockName === 'maxi-blocks/text-maxi' ||
		blockName === 'maxi-blocks/svg-icon-maxi'
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
									background:
										props['background-color'] ||
										`var(--maxi-${getBlockStyle(
											clientId
										)}-color-${
											props[
												'palette-preset-background-color'
											]
										})`,
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
						onChange={val =>
							onChange({
								'background-color': val,
								'background-active-media': 'color',
							})
						}
						showPalette
						palette={{ ...getGroupAttributes(props, 'palette') }}
						colorPaletteType='background'
						onChangePalette={val => onChange(val)}
						deviceType={breakpoint}
						clientId={clientId}
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default BackgroundColor;
