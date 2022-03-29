/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../../../select-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarVerticalAlign } from '../../../../icons';

/**
 * ColumnSize
 */
const VerticalAlign = props => {
	const { blockName, verticalAlign, onChange } = props;

	if (blockName !== 'maxi-blocks/column-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__vertical-align'
			tooltip={__('Vertical Align', 'maxi-blocks')}
			icon={toolbarVerticalAlign}
			advancedOptions='column settings'
		>
			<div className='toolbar-item__vertical-align__popover'>
				<SelectControl
					label={__('Vertical align', 'maxi-blocks')}
					value={verticalAlign}
					options={[
						{
							label: __('Top', 'maxi-blocks'),
							value: 'flex-start',
						},
						{
							label: __('Center', 'maxi-blocks'),
							value: 'center',
						},
						{
							label: __('Bottom', 'maxi-blocks'),
							value: 'flex-end',
						},
						{
							label: __('Space between', 'maxi-blocks'),
							value: 'space-between',
						},
						{
							label: __('Space around', 'maxi-blocks'),
							value: 'space-around',
						},
					]}
					onChange={verticalAlign =>
						onChange({
							verticalAlign,
						})
					}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default VerticalAlign;
