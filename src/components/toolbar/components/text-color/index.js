/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import ColorControl from '../../../color-control';
import {
	getCustomFormatValue,
	withFormatValue,
} from '../../../../extensions/text/formats';
import {
	getGroupAttributes,
	getDefaultAttribute,
	getLastBreakpointAttribute,
	getBlockStyle,
} from '../../../../extensions/styles';

/**
 * Icons
 */
import './editor.scss';
import { toolbarType } from '../../../../icons';

/**
 * TextColor
 */
const TextColor = withFormatValue(props => {
	const {
		blockName,
		onChange,
		breakpoint,
		formatValue,
		blockStyle,
		clientId,
	} = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const typography = { ...getGroupAttributes(props, 'typography') };

	const color = getCustomFormatValue({
		typography,
		formatValue,
		prop: 'color',
		breakpoint,
	});

	return (
		<ToolbarPopover
			className='toolbar-item__text-options'
			tooltip={__('Text Colour', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__text-options__icon'
					style={{
						background:
							props['color'] ||
							`var(--maxi-${getBlockStyle(
								blockStyle,
								clientId
							)}-color-${
								props['palette-preset-typography-color']
							})`,
					}}
				>
					<Icon
						className='toolbar-item__text-options__inner-icon'
						icon={toolbarType}
					/>
				</div>
			}
			content={
				<div className='toolbar-item__text-color__popover'>
					<ColorControl
						label={__('Text', 'maxi-blocks')}
						defaultColor={getDefaultAttribute('color')}
						color={
							color ||
							getLastBreakpointAttribute(
								'color',
								breakpoint,
								typography
							)
						}
						onChange={val =>
							onChange({
								[`color-${breakpoint}`]: val,
							})
						}
						showPalette
						blockStyle={blockStyle}
						palette={{ ...getGroupAttributes(props, 'palette') }}
						colorPaletteType='typography'
						onChangePalette={val => onChange(val)}
						deviceType={breakpoint}
					/>
				</div>
			}
		/>
	);
});

export default TextColor;
