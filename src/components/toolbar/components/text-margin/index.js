/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
// import BoxShadowControl from '../../../box-shadow-control';
import ToolbarPopover from '../toolbar-popover';
import { getGroupAttributes } from '../../../../extensions/styles';
import TextMarginControl from '../text-margin-control';

/**
 * Icons
 */
import './editor.scss';
import { toolbarTextMargin } from '../../../../icons';

/**
 * BoxShadow
 */
const ALLOWED_BLOCKS = ['maxi-blocks/text-maxi'];

const TextMargin = props => {
	const { blockName, breakpoint, name, onChange } = props;
	// const { uniqueID, parentBlockStyle } = attributes;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	return (
		<ToolbarPopover
			className='toolbar-item__text-margin'
			tooltip={__('Margin', 'maxi-blocks')}
			icon={toolbarTextMargin}
			advancedOptions='margin padding'
		>
			<div className='toolbar-item__text-margin__popover'>
				{/* <TextMarginControl
					blockName={name}
					{...getGroupAttributes(props, 'margin')}
					onChange={onChange}
					breakpoint={breakpoint}
					disableMargin
					marginTarget='margin'
				/> */}
				<TextMarginControl
					blockName={name}
					{...getGroupAttributes(props, 'margin')}
					onChange={onChange}
					breakpoint={breakpoint}
					disablePadding
					marginTarget=''
				/>
			</div>
		</ToolbarPopover>
	);
};

export default TextMargin;
