/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TextControl from '../text-control';
import SelectControl from '../select-control';

const AriaLabelControl = ({ props, targets }) => {
	const targetsOptions = useMemo(() => {
		return targets.map(value => ({
			label: value.charAt(0).toUpperCase() + value.slice(1),
			value,
		}));
	}, [targets]);

	return (
		<>
			<SelectControl
				label={__('Target', 'maxi-blocks')}
				newStyle
				options={targetsOptions}
			/>
			<TextControl label={__('Aria Label', 'maxi-blocks')} newStyle />
		</>
	);
};

export default AriaLabelControl;
