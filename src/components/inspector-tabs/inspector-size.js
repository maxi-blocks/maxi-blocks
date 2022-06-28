/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import FullSizeControl from '../full-size-control';
import ToggleSwitch from '../toggle-switch';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import ResponsiveTabsControl from '../responsive-tabs-control';

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
	const { attributes, deviceType, maxiSetAttributes, name } = props;
	const { isFirstOnHierarchy } = attributes;

	const fullWidth = getLastBreakpointAttribute({
		target: `${prefix}full-width`,
		breakpoint: deviceType,
		attributes,
	});

	const showFullWidth = isFirstOnHierarchy || name === 'maxi-blocks/row-maxi';
	const isBlockFullWidth = fullWidth === 'full';

	const ignoreIndicatorGroups = !attributes[`${prefix}size-advanced-options`]
		? ['maxWidth', 'minWidth', 'maxHeight', 'minHeight']
		: [];

	return {
		label: __('Height / Width', 'maxi-blocks'),
		content: (
			<ResponsiveTabsControl
				breakpoint={deviceType}
				ignoreIndicatorGroups={ignoreIndicatorGroups}
			>
				<>
					{showFullWidth &&
						(block ? (
							<ToggleSwitch
								label={__(
									'Set block full-width',
									'maxi-blocks'
								)}
								className='maxi-full-width-toggle'
								selected={isBlockFullWidth}
								onChange={val =>
									maxiSetAttributes({
										[`full-width-${deviceType}`]: val
											? 'full'
											: 'normal',
									})
								}
							/>
						) : (
							<ToggleSwitch
								label={__(
									'Set block full-width',
									'maxi-blocks'
								)}
								selected={fullWidth === 'full'}
								onChange={val =>
									isImage
										? maxiSetAttributes({
												imageRatio: 'original',
												imageSize: 'full',
												imgWidth: 100,
												[`${prefix}full-width-${deviceType}`]:
													val ? 'full' : 'normal',
										  })
										: maxiSetAttributes({
												[`${prefix}full-width-${deviceType}`]:
													val ? 'full' : 'normal',
										  })
								}
							/>
						))}
					<FullSizeControl
						{...getGroupAttributes(
							attributes,
							'size',
							false,
							prefix
						)}
						prefix={prefix}
						onChange={obj => maxiSetAttributes(obj)}
						breakpoint={deviceType}
						hideWidth={hideWidth || isBlockFullWidth}
						hideMaxWidth={hideMaxWidth || isBlockFullWidth}
						isBlockFullWidth={isBlockFullWidth}
						allowForceAspectRatio={block}
					/>
				</>
			</ResponsiveTabsControl>
		),
		ignoreIndicatorGroups,
	};
};

export default size;
