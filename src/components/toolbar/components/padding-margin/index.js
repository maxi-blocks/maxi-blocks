/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
// import ToolbarPopover from '../toolbar-popover';
import AxisControl from '../../../axis-control';
import { getGroupAttributes } from '../../../../extensions/styles';
import Button from '../../../button';
import Dropdown from '../../../dropdown';

/**
 * Styles & Icons
 */
import './editor.scss';
// import { toolbarPadding } from '../../../../icons';

/**
 * PaddingMargin
 */
const PaddingMargin = props => {
	const {
		blockName,
		breakpoint,
		disableMargin = false,
		disablePadding = false,
		isIconToolbar = false,
		marginTarget = 'margin',
		onChange,
		paddingTarget = 'padding',
	} = props;

	if (blockName !== 'maxi-blocks/button-maxi' && !isIconToolbar) return null;

	return (
		<Dropdown
			className='toolbar-item__padding-margin'
			contentClassName='maxi-dropdown__child-content'
			position='right top'
			renderToggle={({ isOpen, onToggle }) => (
				<Button onClick={onToggle} text='Copy'>
					{__('Button padding/margin', 'maxi-blocks')}
				</Button>
			)}
			renderContent={() => (
				<div className='toolbar-item__padding-margin__popover'>
					{!disablePadding && (
						<AxisControl
							{...getGroupAttributes(
								props,
								isIconToolbar ? 'iconPadding' : 'padding'
							)}
							label={__('Padding', 'maxi-blocks')}
							onChange={obj => onChange(obj)}
							breakpoint={breakpoint}
							target={paddingTarget}
							disableAuto
						/>
					)}
					{!disableMargin && (
						<AxisControl
							{...getGroupAttributes(props, 'margin')}
							label={__('Margin', 'maxi-blocks')}
							onChange={obj => onChange(obj)}
							breakpoint={breakpoint}
							target={marginTarget}
							optionType='string'
						/>
					)}
				</div>
			)}
		/>
	);
};

export default PaddingMargin;
