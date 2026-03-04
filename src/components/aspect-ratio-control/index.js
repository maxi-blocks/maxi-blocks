/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import SelectControl from '@components/select-control';
import { convertAspectRatioToDecimal } from '@extensions/styles';

/**
 * Styles
 */
import './editor.scss';

const AspectRatioControl = ({
	additionalOptions,
	customValue,
	onChangeCustomValue,
	onResetCustomValue,
	...props
}) => (
	<>
		<SelectControl
			__nextHasNoMarginBottom
			newStyle
			{...props}
			options={[
				...additionalOptions,
				{
					label: __('1:1 Aspect ratio', 'maxi-blocks'),
					value: 'ar11',
				},
				{
					label: __('2:3 Aspect ratio', 'maxi-blocks'),
					value: 'ar23',
				},
				{
					label: __('3:2 Aspect ratio', 'maxi-blocks'),
					value: 'ar32',
				},
				{
					label: __('4:3 Aspect ratio', 'maxi-blocks'),
					value: 'ar43',
				},
				{
					label: __('16:9 Aspect ratio', 'maxi-blocks'),
					value: 'ar169',
				},
				{
					label: __('Custom', 'maxi-blocks'),
					value: 'custom',
				},
			]}
		/>
		{props.value === 'custom' && (
			<>
				<AdvancedNumberControl
					className='maxi-aspect-ratio-control__custom-value'
					newStyle
					value={customValue}
					min={0}
					max={999}
					maxRange={10}
					step={0.1}
					optionType='string'
					inputType='text'
					customValidationRegex={/[^0-9.,/]/}
					transformRangePreferredValue={convertAspectRatioToDecimal}
					onChangeValue={onChangeCustomValue}
					onReset={onResetCustomValue}
				/>
				<span>{__('Examples:', 'maxi-blocks')} 1.7778, 16/9</span>
			</>
		)}
	</>
);

export default AspectRatioControl;
