/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import { getGroupAttributes } from '../../../../extensions/styles';
import AxisControl from '../../../axis-control';

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
	const { blockName, breakpoint, onChange } = props;

	if (!ALLOWED_BLOCKS.includes(blockName)) return null;

	return (
		<ToolbarPopover
			className='toolbar-item__text-margin'
			tooltip={__('Margin', 'maxi-blocks')}
			icon={toolbarTextMargin}
			advancedOptions='margin padding'
		>
			<div className='toolbar-item__text-margin__popover toolbar-item__padding-margin__popover'>
				{props['margin-sync-general'] === 'none' ? (
					<AxisControl
						{...getGroupAttributes(props, 'margin')}
						label={__('Margin', 'maxi-blocks')}
						onChange={onChange}
						target='margin'
						inputsArray={['bottom', 'top', 'left', 'right', 'unit']}
						noResponsiveTabs
						breakpoint={breakpoint}
						optionType='string'
						disableSync
					/>
				) : props['margin-sync-general'] === 'axis' ? (
					<>
						<AxisControl
							{...getGroupAttributes(props, 'margin')}
							label={__('Top/bottom margin', 'maxi-blocks')}
							onChange={onChange}
							target='margin'
							inputsArray={['top', 'bottom', 'unit']}
							noResponsiveTabs
							breakpoint={breakpoint}
							optionType='string'
							disableSync
						/>
						<AxisControl
							{...getGroupAttributes(props, 'margin')}
							label={__('Right/left margin', 'maxi-blocks')}
							onChange={onChange}
							target='margin'
							inputsArray={['left', 'right', 'unit']}
							noResponsiveTabs
							breakpoint={breakpoint}
							optionType='string'
							disableSync
						/>
					</>
				) : (
					<AxisControl
						{...getGroupAttributes(props, 'margin')}
						label={__('Margin', 'maxi-blocks')}
						onChange={onChange}
						target='margin'
						noResponsiveTabs
						breakpoint={breakpoint}
						optionType='string'
						disableSync
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default TextMargin;
