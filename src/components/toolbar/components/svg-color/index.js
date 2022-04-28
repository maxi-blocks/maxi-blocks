/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import { SvgColor } from '../../../svg-color';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * Styles
 */
import './editor.scss';
import { toolbarShapeColor, toolbarShapeLineColor } from '../../../../icons';

/**
 * SvgColor
 */
function SvgColorToolbar(props) {
	const {
		type,
		blockName,
		onChangeFill,
		onChangeHoverFill,
		onChangeStroke,
		onChangeHoverStroke,
		changeSVGContent,
		maxiSetAttributes,
		changeSVGContentHover,
		blockStyle,
	} = props;

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
					{...getGroupAttributes(props, 'svgHover')}
					type={type}
					maxiSetAttributes={maxiSetAttributes}
					onChangeFill={onChangeFill}
					onChangeStroke={onChangeStroke}
					onChangeHoverFill={onChangeHoverFill}
					onChangeHoverStroke={onChangeHoverStroke}
					changeSVGContent={changeSVGContent}
					changeSVGContentHover={changeSVGContentHover}
					label={__(`Icon ${type}`, 'maxi-blocks')}
					blockStyle={blockStyle}
				/>
			</div>
		</ToolbarPopover>
	);
}

export default SvgColorToolbar;
