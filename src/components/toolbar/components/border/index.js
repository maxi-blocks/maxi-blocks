/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Icon from '@components/icon';
import BorderControl from '@components/border-control';
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarBorder } from '@maxi-icons';
import { getGroupAttributes } from '@extensions/styles';

/**
 * Border
 */
const ALLOWED_BLOCKS = [
	'maxi-blocks/button-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/slider-maxi',
	'maxi-blocks/slide-maxi',
	'maxi-blocks/video-maxi',
];

/**
 * Component
 */
const Border = props => {
	const {
		blockName,
		onChangeInline,
		onChange,
		breakpoint,
		disableColor = false,
		clientId,
		prefix = '',
	} = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	return (
		<ToolbarPopover
			className='toolbar-item__border'
			advancedOptions='border'
			tooltip={__('Border', 'maxi-blocks')}
			position='top center'
			icon={
				<div className='toolbar-item__border__icon'>
					<Icon
						className='toolbar-item__border__inner-icon'
						icon={toolbarBorder}
					/>
				</div>
			}
		>
			<div className='toolbar-item__border__popover'>
				<BorderControl
					{...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						false,
						prefix
					)}
					onChangeInline={onChangeInline}
					onChange={onChange}
					breakpoint={breakpoint}
					isToolbar
					disableColor={disableColor}
					clientId={clientId}
					prefix={prefix}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default Border;
