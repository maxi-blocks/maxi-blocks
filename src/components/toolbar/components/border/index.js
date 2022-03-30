/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Icon from '../../../icon';
import BorderControl from '../../../border-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarBorder } from '../../../../icons';
import { getGroupAttributes } from '../../../../extensions/styles';

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
			tab={0}
			tooltip={__('Border', 'maxi-blocks')}
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
					onChange={value => onChange(value)}
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
