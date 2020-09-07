/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

/**
 * Icons
 */
import { toolbarAdvancedSettings } from '../../../../icons';

/**
 * RowSettings
 */
const RowSettings = props => {
	const { blockName, horizontalAlign, verticalAlign, onChange } = props;

	if (blockName !== 'maxi-blocks/row-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__row-settings'
			tooltip={__('Row Settings', 'maxi-blocks')}
			icon={toolbarAdvancedSettings}
			advancedOptions='row settings'
			content={
				<Fragment>
					<SelectControl
						label={__('Horizontal align', 'maxi-blocks')}
						value={horizontalAlign}
						options={[
							{
								label: __('Flex-start', 'maxi-blocks'),
								value: 'flex-start',
							},
							{
								label: __('Flex-end', 'maxi-blocks'),
								value: 'flex-end',
							},
							{
								label: __('Center', 'maxi-blocks'),
								value: 'center',
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
						onChange={horizontalAlign =>
							onChange({ horizontalAlign, verticalAlign })
						}
					/>
					<SelectControl
						label={__('Vertical align', 'maxi-blocks')}
						value={verticalAlign}
						options={[
							{
								label: __('Stretch', 'maxi-blocks'),
								value: 'stretch',
							},
							{
								label: __('Flex-start', 'maxi-blocks'),
								value: 'flex-start',
							},
							{
								label: __('Flex-end', 'maxi-blocks'),
								value: 'flex-end',
							},
							{
								label: __('Center', 'maxi-blocks'),
								value: 'center',
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
							onChange({ horizontalAlign, verticalAlign })
						}
					/>
				</Fragment>
			}
		/>
	);
};

export default RowSettings;
