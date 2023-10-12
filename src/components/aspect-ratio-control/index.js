/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';

const AspectRatioControl = ({ additionalOptions, ...props }) => (
	<SelectControl
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
		]}
	/>
);

export default AspectRatioControl;
