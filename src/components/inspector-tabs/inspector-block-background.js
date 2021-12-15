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
import getActiveAttributes from '../../extensions/active-indicators';

/**
 * Component
 */
const blockBackground = ({
	props,
	disableImage = false,
	disableVideo = false,
	disableGradient = false,
	disableColor = false,
	disableSVG = false,
}) => {
	const { attributes, clientId, deviceType, setAttributes } = props;

	const bgHoverStatus = attributes['block-background-hover-status'];

	return {
		label: __('Background / Layer', 'maxi-blocks'),
		disablePadding: true,
		content: (
			<SettingTabsControl
				active={getActiveAttributes(
					{
						...getGroupAttributes(attributes, ['blockBackground']),
						...getGroupAttributes(
							attributes,
							'blockBackground',
							true
						),
					},
					'background'
				)}
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<>
								<BlockBackgroundControl
									{...getGroupAttributes(attributes, [
										'blockBackground',
									])}
									onChange={obj => setAttributes(obj)}
									clientId={clientId}
									breakpoint={deviceType}
									disableImage={disableImage}
									disableVideo={disableVideo}
									disableGradient={disableGradient}
									disableColor={disableColor}
									disableSVG={disableSVG}
								/>
							</>
						),
					},
					{
						label: __('Hover state', 'maxi-blocks'),
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
											'block-background-hover-status':
												val,
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

export default blockBackground;
