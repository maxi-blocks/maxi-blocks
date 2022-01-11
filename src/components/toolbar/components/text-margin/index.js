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
import marginPadding from '../../../inspector-tabs/inspector-margin-padding';

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
	const { blockName, onChange, breakpoint, clientId } = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	return (
		<ToolbarPopover
			className='toolbar-item__text-margin'
			tooltip={__('Drop shadow', 'maxi-blocks')}
			icon={toolbarTextMargin}
			advancedOptions='margin padding'
		>
			<div className='toolbar-item__text-margin__popover'>
				<marginPadding
					{...getGroupAttributes(props)}
					onChange={obj => onChange(obj)}
					breakpoint={breakpoint}
					clientId={clientId}
					disableAdvanced
				/>
			</div>
		</ToolbarPopover>
	);
};

export default TextMargin;
