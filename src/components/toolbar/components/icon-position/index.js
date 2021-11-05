/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ButtonGroupControl from '../../../button-group-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarIconAlign } from '../../../../icons';

/**
 * Size
 */
const IconPosition = props => {
	const { blockName, onChange } = props;

	if (blockName !== 'maxi-blocks/button-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__icon-position'
			tooltip={__('Icon Position', 'maxi-blocks')}
			icon={toolbarIconAlign}
		>
			<div className='toolbar-item__icon-position__popover'>
				<ButtonGroupControl
					label={__('Icon Position', 'maxi-block')}
					selected={props['icon-position']}
					options={[
						{
							label: __('Right', 'maxi-block'),
							value: 'right',
						},
						{ label: __('Left', 'maxi-block'), value: 'left' },
					]}
					onChange={val =>
						onChange({
							'icon-position': val,
						})
					}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default IconPosition;
