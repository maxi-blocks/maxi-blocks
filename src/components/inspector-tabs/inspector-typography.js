/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import TypographyControl from '../typography-control';
import ToggleSwitch from '../toggle-switch';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const typography = ({
	props,
	styleCardPrefix = '',
	hideAlignment = false,
	disableCustomFormats = false,
	allowLink = false,
}) => {
	const { attributes, clientId, deviceType, setAttributes } = props;
	const {
		parentBlockStyle,
		textLevel,
		isList,
		'typography-status-hover': typographyHoverStatus,
	} = attributes;

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { globalHoverStatus } = useSelect(select => {
		const { receiveStyleCardValue } = select('maxiBlocks/style-cards');
		const { getBlockName } = select('core/block-editor');

		const type =
			getBlockName(clientId) === 'maxi-blocks/button-maxi'
				? 'button'
				: textLevel;

		const isActive = receiveStyleCardValue(
			'hover-color-global',
			parentBlockStyle,
			type
		);
		const affectAll = receiveStyleCardValue(
			'hover-color-all',
			parentBlockStyle,
			type
		);

		const globalHoverStatus = isActive && affectAll;

		return { globalHoverStatus };
	});

	const hoverStatus = typographyHoverStatus || globalHoverStatus;

	const typographyTarget = allowLink ? ['typography', 'link'] : 'typography';

	return {
		label: __('Typography', 'maxi-blocks'),
		disablePadding: true,
		content: (
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-blocks'),
						content: (
							<TypographyControl
								{...getGroupAttributes(
									attributes,
									typographyTarget
								)}
								onChange={obj => setAttributes(obj)}
								hideAlignment={hideAlignment}
								breakpoint={deviceType}
								clientId={clientId}
								disableCustomFormats={disableCustomFormats}
								blockStyle={parentBlockStyle}
								styleCardPrefix={styleCardPrefix}
								textLevel={textLevel}
								isList={isList}
								allowLink={allowLink}
							/>
						),
					},
					{
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable Typography Hover',
										'maxi-blocks'
									)}
									selected={hoverStatus}
									onChange={val =>
										setAttributes({
											'typography-status-hover': val,
										})
									}
								/>
								{hoverStatus && (
									<TypographyControl
										{...getGroupAttributes(
											attributes,
											'typography',
											true
										)}
										onChange={obj => setAttributes(obj)}
										hideAlignment={hideAlignment}
										breakpoint={deviceType}
										isHover
										clientId={clientId}
										disableCustomFormats={
											disableCustomFormats
										}
										blockStyle={parentBlockStyle}
										styleCardPrefix={styleCardPrefix}
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

export default typography;
