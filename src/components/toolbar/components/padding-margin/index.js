/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import __experimentalAxisControl from '../../../axis-control';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarPadding } from '../../../../icons';

/**
 * PaddingMargin
 */
const PaddingMargin = props => {
	const {
		blockName,
		margin,
		defaultMargin,
		onChangeMargin,
		padding,
		defaultPadding,
		onChangePadding,
		breakpoint,
	} = props;

	return (
		<ToolbarPopover
			className='toolbar-item__padding-margin'
			tooltip={__('Padding & Margin', 'maxi-blocks')}
			icon={toolbarPadding}
			content={
				<div className='toolbar-item__padding-margin__popover'>
					<__experimentalAxisControl
						values={padding}
						defaultValues={defaultPadding}
						onChange={padding => onChangePadding(padding)}
						breakpoint={breakpoint}
						disableAuto
					/>
					<__experimentalAxisControl
						values={margin}
						defaultValues={defaultMargin}
						onChange={margin => onChangeMargin(margin)}
						breakpoint={breakpoint}
					/>
				</div>
			}
		/>
	);
};

export default PaddingMargin;
