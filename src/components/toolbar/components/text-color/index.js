/* eslint-disable react-hooks/rules-of-hooks */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useContext, useRef, memo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ColorControl from '@components/color-control';
import Icon from '@components/icon';
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import {
	getCustomFormatValue,
	setFormat,
	TextContext,
	ListContext,
} from '@extensions/text/formats';
import {
	getGroupAttributes,
	getBlockStyle,
	getColorRGBAString,
} from '@extensions/styles';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarType } from '@maxi-icons';
import { getListTypographyAttributes } from '@extensions/text/lists';

const ALLOWED_BLOCKS = ['maxi-blocks/text-maxi', 'maxi-blocks/list-item-maxi'];

/**
 * TextColor
 */
const TextColor = props => {
	const {
		blockName,
		onChangeInline,
		onChange,
		breakpoint,
		clientId,
		isList,
		textLevel,
		styleCard,
		disableCustomFormats,
	} = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	const { formatValue, onChangeTextFormat } = useContext(TextContext);
	const listContext = useContext(ListContext);

	const rawTypography = getGroupAttributes(props, 'typography');
	const typography = listContext
		? getListTypographyAttributes(listContext, rawTypography)
		: { ...rawTypography };

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
	const colorPaletteSCStatus = getCustomFormatValue({
		typography,
		formatValue,
		prop: 'palette-sc-status',
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
			returnFormatValue: true,
			disableCustomFormats,
		});

		const newFormatValue = {
			...obj.formatValue,
		};
		delete obj?.formatValue;

		onChangeTextFormat(newFormatValue);

		onChange(obj);
	};

	const textColor = useRef();

	return (
		<ToolbarPopover
			className='toolbar-item__text-options toolbar-item__text-color'
			tooltip={__('Text Colour', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__text-options__icon'
					ref={textColor}
					style={{
						background: colorPaletteStatus
							? getColorRGBAString({
									firstVar: `color-${colorPalette}`,
									opacity: colorOpacity,
									blockStyle: getBlockStyle(clientId),
							  })
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
					color={color}
					paletteColor={colorPalette}
					paletteStatus={colorPaletteStatus}
					paletteSCStatus={colorPaletteSCStatus}
					paletteOpacity={colorOpacity}
					onChangeInline={({ color }) => {
						onChangeInline({ color });
						textColor.current.style.background = color;
					}}
					onChange={({
						color,
						paletteColor,
						paletteStatus,
						paletteSCStatus,
						paletteOpacity,
					}) =>
						onChangeFormat({
							color,
							'palette-color': paletteColor,
							'palette-status': paletteStatus,
							'palette-sc-status': paletteSCStatus,
							'palette-opacity': paletteOpacity,
						})
					}
					globalProps={{ target: '', type: textLevel }}
					textLevel={textLevel}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default memo(TextColor);
