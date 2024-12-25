/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '@components/setting-tabs-control';
import BlockBackgroundControl from '@components/background-control/blockBackgroundControl';
import ToggleSwitch from '@components/toggle-switch';
import { getGroupAttributes } from '@extensions/styles';
import ManageHoverTransitions from '@components/manage-hover-transitions';

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
		getBounds,
	} = props;

	const bgHoverStatus = attributes['block-background-status-hover'];

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
									'transition',
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
								getBounds={getBounds}
							/>
						),
						extraIndicators: ['background-layers'],
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ManageHoverTransitions />
								<ToggleSwitch
									label={__(
										'Enable background hover',
										'maxi-blocks'
									)}
									selected={bgHoverStatus}
									className='maxi-background-status-hover'
									onChange={val => {
										maxiSetAttributes({
											'block-background-status-hover':
												val,
										});
									}}
								/>
								{bgHoverStatus && (
									<BlockBackgroundControl
										{...getGroupAttributes(
											attributes,
											['blockBackground', 'transition'],
											true
										)}
										onChange={obj => maxiSetAttributes(obj)}
										isHover
										clientId={clientId}
										breakpoint={deviceType}
										getBounds={getBounds}
									/>
								)}
							</>
						),
						extraIndicators: ['block-background-status-hover'],
					},
				]}
				depth={depth}
			/>
		),
	};
};

export default blockBackground;
