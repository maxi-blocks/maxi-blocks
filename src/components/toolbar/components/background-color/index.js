/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorControl from '../../../color-control';
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

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			advancedOptions='background'
			tooltip={__('Background color', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__icon'
					style={{
						background:
							props['background-color'] ||
							`var(--maxi-${getBlockStyle(clientId)}-color-${
								props['palette-preset-background-color']
							})`,
						border: '1px solid #fff',
					}}
				/>
			}
		>
			<div className='toolbar-item__background__popover'>
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
			</div>
		</ToolbarPopover>
	);
};

export default BackgroundColor;
