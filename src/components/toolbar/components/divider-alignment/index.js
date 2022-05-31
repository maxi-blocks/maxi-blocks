/**
 * Internal dependencies
 */
import { __ } from '@wordpress/i18n';
import ToolbarPopover from '../toolbar-popover';

/**
 * Internal dependencies
 */
import Icon from '../../../icon';
import SelectControl from '../../../select-control';
import SettingTabsControl from '../../../setting-tabs-control';

/**
 * Styles & Icons
 */
import './editor.scss';
import {
	alignLeft,
	alignCenter,
	alignRight,
	toolbarVerticalAlign,
} from '../../../../icons';

/**
 * DividerAlignment
 */
const DividerAlignment = props => {
	const {
		blockName,
		lineOrientation,
		lineVertical,
		lineHorizontal,
		onChangeOrientation,
		onChangeVertical,
		onChangeHorizontal,
	} = props;

	if (blockName !== 'maxi-blocks/divider-maxi') return null;

	const getHorizontalOptions = () => {
		const options = [];
		options.push({ icon: <Icon icon={alignLeft} />, value: 'flex-start' });
		options.push({ icon: <Icon icon={alignCenter} />, value: 'center' });
		options.push({ icon: <Icon icon={alignRight} />, value: 'flex-end' });

		return options;
	};

	const getVerticalOptions = () => {
		return [
			{ label: __('Top', 'maxi-blocks'), value: 'flex-start' },
			{ label: __('Center', 'maxi-blocks'), value: 'center' },
			{ label: __('Bottom', 'maxi-blocks'), value: 'flex-end' },
		];
	};

	return (
		<ToolbarPopover
			className='toolbar-item__divider-alignment'
			tooltip={__('Divider alignment', 'maxi-blocks')}
			icon={toolbarVerticalAlign}
			advancedOptions='alignment'
		>
			<div className='toolbar-item__divider-alignment__popover'>
				<SelectControl
					label={__('Line orientation', 'maxi-blocks')}
					options={[
						{
							label: __('Horizontal', 'maxi-blocks'),
							value: 'horizontal',
						},
						{
							label: __('Vertical', 'maxi-blocks'),
							value: 'vertical',
						},
					]}
					value={lineOrientation}
					onChange={value => onChangeOrientation(value)}
				/>
				{lineOrientation === 'vertical' && (
					<SelectControl
						label={__('Vertical position', 'maxi-blocks')}
						options={getVerticalOptions()}
						value={lineVertical}
						onChange={value => onChangeVertical(value)}
					/>
				)}
				{lineOrientation === 'horizontal' && (
					<SettingTabsControl
						className='maxi-alignment-control'
						type='buttons'
						selected={lineHorizontal}
						items={getHorizontalOptions()}
						onChange={value => onChangeHorizontal(value)}
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default DividerAlignment;
