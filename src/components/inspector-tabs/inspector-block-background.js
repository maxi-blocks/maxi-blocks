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
const blockBackground = ({
	props,
	disableImage = false,
	disableVideo = false,
	disableGradient = false,
	disableColor = false,
	disableSVG = false,
	depth = 2,
}) => {
	const {
		attributes,
		clientId,
		deviceType,
		maxiSetAttributes,
		insertInlineStyles,
		cleanInlineStyles,
	} = props;

	const bgHoverStatus = attributes['block-background-hover-status'];

	return {
		label: __('Background / Layer', 'maxi-blocks'),
		disablePadding: true,
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<BlockBackgroundControl
								{...getGroupAttributes(attributes, [
									'blockBackground',
									'background-layers',
								])}
								onChangeInline={(obj, target) =>
									insertInlineStyles({ obj, target })
								}
								onChange={(obj, target) => {
									maxiSetAttributes(obj);
									if (target) cleanInlineStyles(target);
								}}
								clientId={clientId}
								breakpoint={deviceType}
								disableImage={disableImage}
								disableVideo={disableVideo}
								disableGradient={disableGradient}
								disableColor={disableColor}
								disableSVG={disableSVG}
							/>
						),
						extraIndicators: ['background-layers'],
						ignoreIndicator: ['block-background-hover-status'],
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
										maxiSetAttributes({
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
										onChange={obj => maxiSetAttributes(obj)}
										isHover
										clientId={clientId}
										breakpoint={deviceType}
									/>
								)}
							</>
						),
						extraIndicators: ['block-background-hover-status'],
					},
				]}
				depth={depth}
			/>
		),
	};
};

export default blockBackground;
