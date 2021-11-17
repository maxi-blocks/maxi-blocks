/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import BackgroundControl from '../background-control';
import ToggleSwitch from '../toggle-switch';
import {
	getGroupAttributes,
	setHoverAttributes,
} from '../../extensions/styles';

/**
 * Component
 */
const background = ({
	label = '',
	props,
	prefix = '',
	disableImage = false,
	disableVideo = false,
	disableGradient = false,
	disableColor = false,
	disableSVG = false,
	disableClipPath = false,
	isButton = false,
	groupAttributes = ['background', 'backgroundColor', 'backgroundGradient'],
}) => {
	const { attributes, clientId, deviceType, setAttributes } = props;
	const { parentBlockStyle } = attributes;

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { globalHoverStatus } = useSelect(select => {
		const { receiveStyleCardValue } = select('maxiBlocks/style-cards');

		const isActive = isButton
			? receiveStyleCardValue(
					'hover-background-color-global',
					parentBlockStyle,
					'button'
			  )
			: false;
		const affectAll = isButton
			? receiveStyleCardValue(
					'hover-background-color-all',
					parentBlockStyle,
					'button'
			  )
			: false;

		const globalHoverStatus = isActive && affectAll;

		return { globalHoverStatus };
	});

	const hoverStatus =
		attributes[`${prefix}background-hover-status`] || globalHoverStatus;

	return {
		label: __(`${label} background`, 'maxi-blocks'),
		disablePadding: true,
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<>
								<BackgroundControl
									{...getGroupAttributes(
										attributes,
										groupAttributes,
										false,
										prefix
									)}
									prefix={prefix}
									onChange={obj => setAttributes(obj)}
									disableColor={disableColor}
									disableImage={disableImage}
									disableGradient={disableGradient}
									disableVideo={disableVideo}
									disableSVG={disableSVG}
									disableClipPath={disableClipPath}
									clientId={clientId}
									isButton={isButton}
									breakpoint={deviceType}
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
									selected={hoverStatus}
									className='maxi-background-status-hover'
									onChange={val =>
										setAttributes({
											...(val &&
												setHoverAttributes(
													{
														...getGroupAttributes(
															attributes,
															[
																'background',
																'backgroundColor',
																'backgroundGradient',
															],
															false,
															prefix
														),
													},
													{
														...getGroupAttributes(
															attributes,
															[
																'background',
																'backgroundColor',
																'backgroundGradient',
															],
															true,
															prefix
														),
													}
												)),
											[`${prefix}background-hover-status`]:
												val,
										})
									}
								/>
								{hoverStatus && (
									<BackgroundControl
										{...getGroupAttributes(
											attributes,
											[
												'background',
												'backgroundColor',
												'backgroundGradient',
											],
											true,
											prefix
										)}
										prefix={prefix}
										onChange={obj => setAttributes(obj)}
										disableImage
										disableVideo
										disableClipPath
										disableSVG
										isHover
										clientId={clientId}
										isButton={isButton}
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
