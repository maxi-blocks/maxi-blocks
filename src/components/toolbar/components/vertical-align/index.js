/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '@components/select-control';
import ToolbarPopover from '@components/toolbar/components/toolbar-popover';
import { getDefaultAttribute } from '@extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarVerticalAlign } from '@maxi-icons';

/**
 * ColumnSize
 */
const VerticalAlign = props => {
	const { blockName, verticalAlign, onChange, breakpoint } = props;

	if (blockName !== 'maxi-blocks/column-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__vertical-align'
			tooltip={__('Vertical align', 'maxi-blocks')}
			icon={toolbarVerticalAlign}
			advancedOptions='column settings'
		>
			<div className='toolbar-item__vertical-align__popover'>
				<SelectControl
					__nextHasNoMarginBottom
					label={__('Vertical align', 'maxi-blocks')}
					value={verticalAlign}
					defaultValue={getDefaultAttribute(
						`justify-content-${breakpoint}`
					)}
					onReset={() =>
						onChange({
							[`justify-content-${breakpoint}`]:
								getDefaultAttribute(
									`justify-content-${breakpoint}`
								),
							isReset: true,
						})
					}
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
							[`justify-content-${breakpoint}`]: verticalAlign,
						})
					}
					newStyle
				/>
			</div>
		</ToolbarPopover>
	);
};

export default VerticalAlign;
