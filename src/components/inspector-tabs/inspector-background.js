/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import BlockBackgroundControl from '../background-control/blockBackgroundControl';
import ToggleSwitch from '../toggle-switch';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const background = ({ props, enableParallax = false }) => {
	const { attributes, clientId, deviceType, setAttributes } = props;

	const bgHoverStatus = attributes['background-hover-status'];

	return {
		label: __('Background', 'maxi-blocks'),
		disablePadding: true,
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal', 'maxi-blocks'),
						content: (
							<>
								<BlockBackgroundControl
									{...getGroupAttributes(attributes, [
										'blockBackground',
										'parallax',
									])}
									onChange={obj => setAttributes(obj)}
									clientId={clientId}
									breakpoint={deviceType}
									enableParallax={enableParallax}
								/>
							</>
						),
					},
					{
						label: __('Hover', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable Background Hover',
										'maxi-blocks'
									)}
									selected={bgHoverStatus}
									className='maxi-background-status-hover'
									onChange={val => {
										setAttributes({
											'background-hover-status': val,
										});
									}}
								/>
								{bgHoverStatus && (
									<BlockBackgroundControl
										{...getGroupAttributes(
											attributes,
											'blockBackground',
											true
										)}
										onChange={obj => setAttributes(obj)}
										isHover
										clientId={clientId}
										breakpoint={deviceType}
									/>
								)}
							</>
						),
					},
				]}
			/>
		),
	};
};

export default background;
