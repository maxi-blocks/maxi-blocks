/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

import { SelectControl } from '@wordpress/components';

/**
 * Component
 */
const SvgAnimationControl = props => {
	const { animation, onChange } = props;

	const getSelectorOptions = () => {
		return [
			{ label: __('Loop Animation', 'maxi-blocks'), value: 'loop' },
			{ label: __('On Load: Once', 'maxi-blocks'), value: 'load-once' },
			// { label: __('On Hover: Loop', 'maxi-blocks'), value: 'hover-loop' },
			// { label: __('On Hover: Once', 'maxi-blocks'), value: 'hover-once' },
			// { label: __('On Hover: Off', 'maxi-blocks'), value: 'hover-off' },
			{ label: __('Off: No Animation', 'maxi-blocks'), value: 'off' },
		];
	};

	return (
		<SelectControl
			label={__('Animation', 'maxi-blocks')}
			value={animation}
			options={getSelectorOptions()}
			onChange={value => onChange(value)}
		/>
	);
};

export default SvgAnimationControl;
