/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../../../color-control';
import Icon from '../../../icon';
import ToolbarPopover from '../toolbar-popover';
import {
	getCustomFormatValue,
	withFormatValue,
	setFormat,
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
		clientId,
		isList,
		textLevel,
		styleCard,
	} = props;

	if (blockName !== 'maxi-blocks/text-maxi') return null;

	const typography = { ...getGroupAttributes(props, 'typography') };

	const color = getCustomFormatValue({
		typography,
		formatValue,
		prop: 'color',
		breakpoint,
		textLevel,
		styleCard,
	});
	const colorPalette = getCustomFormatValue({
		typography,
		formatValue,
		prop: 'palette-color',
		breakpoint,
		textLevel,
		styleCard,
	});
	const colorPaletteStatus = getCustomFormatValue({
		typography,
		formatValue,
		prop: 'palette-color-status',
		breakpoint,
		textLevel,
		styleCard,
	});

	const onChangeFormat = value => {
		const obj = setFormat({
			formatValue,
			isList,
			typography,
			value,
			breakpoint,
			textLevel,
		});

		onChange(obj);
	};

	return (
		<ToolbarPopover
			className='toolbar-item__text-options'
			tooltip={__('Text Colour', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__text-options__icon'
					style={{
						background: colorPaletteStatus
							? `var(--maxi-${getBlockStyle(
									clientId
							  )}-color-${colorPalette})`
							: color,
					}}
				>
					<Icon
						className='toolbar-item__text-options__inner-icon'
						icon={toolbarType}
					/>
				</div>
			}
		>
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
					paletteColor={
						colorPalette ||
						getLastBreakpointAttribute(
							'palette-color',
							breakpoint,
							typography
						)
					}
					paletteStatus={
						colorPaletteStatus ||
						getLastBreakpointAttribute(
							'palette-color-status',
							breakpoint,
							typography
						)
					}
					onChange={({ color, paletteColor, paletteStatus }) =>
						onChangeFormat({
							color,
							'palette-color': paletteColor,
							'palette-color-status': paletteStatus,
						})
					}
					showPalette
					globalProps={{ target: 'color-global', type: textLevel }}
					textLevel={textLevel}
				/>
			</div>
		</ToolbarPopover>
	);
});

export default TextColor;
