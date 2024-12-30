/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import SvgColor from '@components/svg-color';
import { getGroupAttributes } from '@extensions/styles';

/**
 * Styles
 */
import './editor.scss';
import { toolbarShapeColor, toolbarShapeLineColor } from '@maxi-icons';

/**
 * SvgColor
 */
function SvgColorToolbar(props) {
	const {
		type,
		blockName,
		content,
		onChangeInline,
		onChangeFill,
		onChangeHoverFill,
		onChangeStroke,
		onChangeHoverStroke,
		maxiSetAttributes,
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
			advancedOptions='icon colour'
		>
			<div className='toolbar-item__svg-color__popover'>
				<SvgColor
					{...getGroupAttributes(props, 'svg')}
					{...getGroupAttributes(props, 'svgHover')}
					type={type}
					maxiSetAttributes={maxiSetAttributes}
					onChangeInline={onChangeInline}
					onChangeFill={onChangeFill}
					onChangeStroke={onChangeStroke}
					onChangeHoverFill={onChangeHoverFill}
					onChangeHoverStroke={onChangeHoverStroke}
					label={__(`Icon ${type}`, 'maxi-blocks')}
					blockStyle={blockStyle}
					content={content}
				/>
			</div>
		</ToolbarPopover>
	);
}

export default SvgColorToolbar;
