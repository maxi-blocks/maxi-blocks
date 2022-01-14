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
const size = ({
	props,
	prefix = '',
	block = false,
	hideWidth = false,
	hideMaxWidth = false,
	isImage = false,
}) => {
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
								isImage
									? setAttributes({
											imageRatio: 'original',
											imageSize: 'full',
											imgWidth: 100,
											fullWidth: val ? 'full' : 'normal',
									  })
									: setAttributes({
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
					hideWidth={hideWidth}
					hideMaxWidth={hideMaxWidth}
				/>
			</>
		),
		extraIndicators: [
			...(isFirstOnHierarchy ? 'blockFullWidth' : 'fullWidth'),
		],
	};
};

export default size;
