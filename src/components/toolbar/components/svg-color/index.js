/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import SvgColor from '../../../svg-color';
import {
	getColorRGBAString,
	getGroupAttributes,
} from '../../../../extensions/styles';
import { setSVGContent } from '../../../../extensions/svg';

/**
 * Styles
 */
import './editor.scss';
import { toolbarShapeColor, toolbarShapeLineColor } from '../../../../icons';

/**
 * SvgColor
 */
const SvgColorToolbar = props => {
	const { type, blockName, onChangeInline, onChange, parentBlockStyle } =
		props;

	if (blockName !== 'maxi-blocks/svg-icon-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__background'
			// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
			tooltip={__(`Icon ${type} colour`, 'maxi-blocks')}
			icon={
				<div className='toolbar-item__icon'>
					{type === 'fill'
						? toolbarShapeColor
						: toolbarShapeLineColor}
				</div>
			}
			advancedOptions='colour'
		>
			<div className='toolbar-item__svg-color__popover'>
				<SvgColor
					{...getGroupAttributes(props, 'svg')}
					type={type}
					label={__(`Icon ${type}`, 'maxi-blocks')}
					onChangeInline={onChangeInline}
					onChange={obj => {
						const colorStr = getColorRGBAString({
							firstVar: `icon-${type}`,
							secondVar: `color-${
								obj[`svg-${type}-palette-color`]
							}`,
							opacity: obj[`svg-${type}-palette-opacity`],
							blockStyle: parentBlockStyle,
						});

						onChange({
							...obj,
							content: setSVGContent(
								props.content,
								obj[`svg-${type}-palette-status`]
									? colorStr
									: obj[`svg-${type}-color`],
								type
							),
						});
					}}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default SvgColorToolbar;
