/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';

/**
 * Component
 */
const BlockStylesControl = props => {
	const { blockStyle, onChange, isFirstOnHierarchy } = props;

	const getSelectorOptions = () => {
		if (isFirstOnHierarchy)
			return [
				{ label: __('Dark', 'maxi-blocks'), value: 'maxi-dark' },
				{ label: __('Light', 'maxi-blocks'), value: 'maxi-light' },
			];
		return [{ label: __('Parent', 'maxi-blocks'), value: 'maxi-parent' }];
	};

	return (
		<SelectControl
			label={__('Block Style', 'maxi-blocks')}
			value={blockStyle}
			options={getSelectorOptions()}
			onChange={blockStyle => onChange({ blockStyle })}
		/>
	);
};

export default BlockStylesControl;
