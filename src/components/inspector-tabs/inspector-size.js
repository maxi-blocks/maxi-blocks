/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import FullSizeControl from '../full-size-control';
import ToggleSwitch from '../toggle-switch';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const zindex = ({ props, prefix = '', block = false }) => {
	const { attributes, deviceType, setAttributes } = props;
	const { fullWidth, blockFullWidth, isFirstOnHierarchy } = attributes;

	return {
		label: __('Height / Width', 'maxi-blocks'),
		content: (
			<>
				{isFirstOnHierarchy &&
					(block ? (
						<ToggleSwitch
							label={__('Set full-width', 'maxi-blocks')}
							selected={blockFullWidth === 'full'}
							onChange={val =>
								setAttributes({
									blockFullWidth: val ? 'full' : 'normal',
								})
							}
						/>
					) : (
						<ToggleSwitch
							label={__('Set full-width', 'maxi-blocks')}
							selected={fullWidth === 'full'}
							onChange={val =>
								setAttributes({
									fullWidth: val ? 'full' : 'normal',
								})
							}
						/>
					))}
				<FullSizeControl
					{...getGroupAttributes(attributes, 'size', false, prefix)}
					prefix={prefix}
					onChange={obj => setAttributes(obj)}
					breakpoint={deviceType}
				/>
			</>
		),
	};
};

export default zindex;
