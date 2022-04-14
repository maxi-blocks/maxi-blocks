/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * Icons
 */
import './editor.scss';
import { toolbarDropShadow } from '../../../../icons';
import BoxShadowControl from '../../../box-shadow-control';

/**
 * BoxShadow
 */
const ALLOWED_BLOCKS = ['maxi-blocks/button-maxi', 'maxi-blocks/image-maxi'];

const BoxShadow = props => {
	const {
		blockName,
		onChangeInline,
		onChange,
		breakpoint,
		clientId,
		prefix = '',
	} = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	return (
		<ToolbarPopover
			className='toolbar-item__box-shadow'
			tooltip={__('Drop shadow', 'maxi-blocks')}
			icon={toolbarDropShadow}
			advancedOptions='box shadow'
		>
			<div className='toolbar-item__box-shadow__popover'>
				<BoxShadowControl
					{...getGroupAttributes(props, ['boxShadow'], false, prefix)}
					onChangeInline={onChangeInline}
					onChange={onChange}
					breakpoint={breakpoint}
					clientId={clientId}
					disableAdvanced
					prefix={prefix}
					isToolbar
				/>
			</div>
		</ToolbarPopover>
	);
};

export default BoxShadow;
