/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import AxisControl from '../../../axis-control';
import { getGroupAttributes } from '../../../../extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarPadding } from '../../../../icons';

/**
 * PaddingMargin
 */
const PaddingMargin = props => {
	const { onChange, breakpoint } = props;

	return (
		<ToolbarPopover
			className='toolbar-item__padding-margin'
			tooltip={__('Padding & Margin', 'maxi-blocks')}
			icon={toolbarPadding}
			content={
				<div className='toolbar-item__padding-margin__popover'>
					<AxisControl
						{...getGroupAttributes(props, 'padding')}
						label={__('Padding', 'maxi-blocks')}
						onChange={obj => onChange(obj)}
						breakpoint={breakpoint}
						target='padding'
					/>
					<AxisControl
						{...getGroupAttributes(props, 'margin')}
						label={__('Margin', 'maxi-blocks')}
						onChange={obj => onChange(obj)}
						breakpoint={breakpoint}
						target='margin'
					/>
				</div>
			}
		/>
	);
};

export default PaddingMargin;
