/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarBorderControl from '../toolbar-border-control';
import Icon from '../../../icon';
import ToolbarPopover from '../toolbar-popover';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarBorder } from '../../../../icons';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getBlockStyle,
	getColorRGBAString,
} from '../../../../extensions/styles';

/**
 * Border
 */
const ALLOWED_BLOCKS = ['maxi-blocks/button-maxi', 'maxi-blocks/image-maxi'];

/**
 * Component
 */
const Border = props => {
	const {
		blockName,
		onChange,
		breakpoint,
		disableColor = false,
		clientId,
		isIconToolbar = false,
		prefix = '',
	} = props;

	if (!ALLOWED_BLOCKS.includes(blockName) && !isIconToolbar) return null;

	return (
		<ToolbarPopover
			className='toolbar-item__border'
			advancedOptions={isIconToolbar ? 'icon' : 'border'}
			tooltip={__('Border', 'maxi-blocks')}
			icon={
				<div
					className='toolbar-item__border__icon'
					style={{
						borderStyle: getLastBreakpointAttribute(
							`${prefix}border-style`,
							breakpoint,
							props
						),
						background:
							getLastBreakpointAttribute(
								`${prefix}border-style`,
								breakpoint,
								props
							) === 'none'
								? 'transparent'
								: getLastBreakpointAttribute(
										`${prefix}border-style`,
										breakpoint,
										props
								  ),
						borderWidth: '1px',
						borderColor: props[
							`${prefix}border-palette-status-${breakpoint}`
						]
							? getColorRGBAString({
									firstVar: `color-${
										props[
											`${prefix}border-palette-color-${breakpoint}`
										]
									}`,
									opacity:
										props[
											`${prefix}border-palette-opacity-${breakpoint}`
										],
									blockStyle: getBlockStyle(clientId),
							  })
							: props[`${prefix}border-color-${breakpoint}`],
					}}
				>
					<Icon
						className='toolbar-item__border__inner-icon'
						icon={toolbarBorder}
					/>
				</div>
			}
		>
			<div className='toolbar-item__border__popover'>
				<ToolbarBorderControl
					{...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						false,
						prefix
					)}
					onChange={value => onChange(value)}
					breakpoint={breakpoint}
					disableAdvanced
					disableColor={disableColor}
					clientId={clientId}
					prefix={prefix}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default Border;
