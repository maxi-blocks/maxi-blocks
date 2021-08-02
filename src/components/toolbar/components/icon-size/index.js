/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../../../advanced-number-control';
import ToolbarPopover from '../toolbar-popover';
import { getDefaultAttribute } from '../../../../extensions/styles';

/**
 * Styles & Icons
 */
import './editor.scss';
import { toolbarShapeWidth } from '../../../../icons';

/**
 * Size
 */
const IconSize = props => {
	const { blockName, onChange } = props;

	if (blockName !== 'maxi-blocks/button-maxi') return null;

	return (
		<ToolbarPopover
			className='toolbar-item__icon-size'
			tooltip={__('Position', 'maxi-blocks')}
			icon={toolbarShapeWidth}
		>
			<div className='toolbar-item__icon-size__popover'>
				<AdvancedNumberControl
					label={__('Size', 'maxi-blocks')}
					min={1}
					max={999}
					initial={1}
					step={1}
					value={props['icon-size']}
					onChangeValue={val => onChange({ 'icon-size': val })}
					onReset={() =>
						onChange({
							'icon-size': getDefaultAttribute('icon-size'),
						})
					}
				/>
				<AdvancedNumberControl
					label={__('Spacing', 'maxi-blocks')}
					min={1}
					max={999}
					initial={1}
					step={1}
					value={props['icon-spacing']}
					onChangeValue={val => onChange({ 'icon-spacing': val })}
					onReset={() =>
						onChange({
							'icon-spacing': getDefaultAttribute('icon-spacing'),
						})
					}
				/>
			</div>
		</ToolbarPopover>
	);
};

export default IconSize;
