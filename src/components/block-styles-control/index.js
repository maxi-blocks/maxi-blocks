/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';

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
			onChange={blockStyle => {
				const dependsOnParent = blockStyle.includes('parent');
				const parentBlockStyle = blockStyle.replace('maxi-', '');

				onChange({
					blockStyle,
					...(!dependsOnParent && { parentBlockStyle }),
				});
			}}
		/>
	);
};

export default BlockStylesControl;
