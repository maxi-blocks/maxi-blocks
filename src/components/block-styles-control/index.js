/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

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

	const [, setColorPaletteClass] = useState(blockStyle);

	return (
		<SelectControl
			label={__('Block Style', 'maxi-blocks')}
			value={blockStyle}
			options={getSelectorOptions()}
			onChange={blockStyle => {
				onChange({ blockStyle });
				setColorPaletteClass(blockStyle);
			}}
		/>
	);
};

export default BlockStylesControl;
