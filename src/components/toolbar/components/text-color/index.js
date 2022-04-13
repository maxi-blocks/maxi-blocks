/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

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
	getBlockStyle,
	getColorRGBAString,
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
		onChangeInline,
		onChange,
		breakpoint,
		formatValue,
		clientId,
		isList,
		textLevel,
		styleCard,
		isCaptionToolbar = false,
	} = props;

	if (blockName !== 'maxi-blocks/text-maxi' && !isCaptionToolbar) return null;

	const typography = { ...getGroupAttributes(props, 'typography') };

	const color = getCustomFormatValue({
		typography,
		formatValue,
		prop: 'color',
		breakpoint,
		textLevel,
		styleCard,
	});
	const colorPaletteStatus = getCustomFormatValue({
		typography,
		formatValue,
		prop: 'palette-status',
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
	const colorOpacity = getCustomFormatValue({
		typography,
		formatValue,
		prop: 'palette-opacity',
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

	const [textColor, setTextColor] = useState(color);

	return (
		<ToolbarPopover
			className='toolbar-item__text-options toolbar-item__text-color'
			tooltip={__('Text Colour', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__text-options__icon'
					style={{
						background: colorPaletteStatus
							? getColorRGBAString({
									firstVar: `color-${colorPalette}`,
									opacity: colorOpacity,
									blockStyle: getBlockStyle(clientId),
							  })
							: textColor,
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
					color={color}
					paletteColor={colorPalette}
					paletteStatus={colorPaletteStatus}
					paletteOpacity={colorOpacity}
					onChangeInline={({ color }) => {
						onChangeInline({ color });
						setTextColor(color);
					}}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteOpacity,
					}) =>
						onChangeFormat({
							color,
							'palette-color': paletteColor,
							'palette-status': paletteStatus,
							'palette-opacity': paletteOpacity,
						})
					}
					globalProps={{ target: '', type: textLevel }}
					textLevel={textLevel}
				/>
			</div>
		</ToolbarPopover>
	);
});

export default TextColor;
