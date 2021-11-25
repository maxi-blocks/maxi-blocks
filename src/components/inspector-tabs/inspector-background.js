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
const background = ({
	props,
	disableImage = false,
	disableVideo = false,
	disableGradient = false,
	disableColor = false,
	disableSVG = false,
}) => {
	const { attributes, clientId, deviceType, setAttributes } = props;

	const bgHoverStatus = attributes['background-hover-status'];

	return {
		label: __('Background / Layer', 'maxi-blocks'),
		disablePadding: true,
		content: (
			<SettingTabsControl
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
										'Enable background hover',
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
