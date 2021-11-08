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
import ButtonGroupControl from '../../../button-group-control';

/**
 * Styles & Icons
 */
import './editor.scss';
import {
	alignLeft,
	alignCenter,
	alignRight,
	toolbarDividerAlign,
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
		options.push({ label: <Icon icon={alignLeft} />, value: 'flex-start' });
		options.push({ label: <Icon icon={alignCenter} />, value: 'center' });
		options.push({ label: <Icon icon={alignRight} />, value: 'flex-end' });

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
			tooltip={__('Divider aligment', 'maxi-blocks')}
			icon={toolbarDividerAlign}
			advancedOptions='line'
		>
			<div className='toolbar-item__divider-alignment__popover'>
				<SelectControl
					label={__('Line Orientation', 'maxi-blocks')}
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
						label={__('Vertical Position', 'maxi-blocks')}
						options={getVerticalOptions()}
						value={lineVertical}
						onChange={value => onChangeVertical(value)}
					/>
				)}
				{lineOrientation === 'horizontal' && (
					<ButtonGroupControl
						className='maxi-alignment-control'
						selected={lineHorizontal}
						options={getHorizontalOptions()}
						onChange={value => onChangeHorizontal(value)}
					/>
				)}
			</div>
		</ToolbarPopover>
	);
};

export default DividerAlignment;
