/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const AxisPositionControl = loadable(() =>
	import('../../../../components/axis-position-control')
);
const SettingTabsControl = loadable(() =>
	import('../../../../components/setting-tabs-control')
);
const ToggleSwitch = loadable(() =>
	import('../../../../components/toggle-switch')
);
const IconControl = loadable(() =>
	import('../../../../components/icon-control')
);
const MaxiModal = loadable(() => import('../../../../editor/library/modal'));
import { getIconWithColor } from '../../../../extensions/styles';

const AccordionIconSettings = props => {
	const { onChange, blockStyle, svgTypeActive, breakpoint } = props;

	return (
		<>
			<AxisPositionControl
				label={__('Icon', 'maxi-blocks')}
				disableY
				selected={props['icon-position']}
				breakpoint={breakpoint}
				onChange={val =>
					onChange({
						'icon-position': val,
					})
				}
			/>
			<MaxiModal
				type='accordion-icon'
				style={blockStyle}
				onSelect={obj => onChange(obj)}
				onRemove={obj => onChange(obj)}
				icon={props['icon-content']}
				label='Icon'
			/>
			<MaxiModal
				type='accordion-icon-active'
				style={blockStyle}
				onSelect={obj => onChange(obj)}
				onRemove={obj => onChange(obj)}
				icon={props['active-icon-content']}
				label='Active icon'
			/>
			<SettingTabsControl
				items={[
					props['icon-content'] !== '' && {
						label: __('Normal state', 'maxi-blocks'),
						content: props['icon-content'] !== '' && (
							<IconControl
								{...props}
								getIconWithColor={args =>
									getIconWithColor(props, args, '')
								}
								disableHeightFitContent
							/>
						),
					},
					(props['active-icon-content'] !== '' ||
						props['icon-content'] !== '') && {
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable Icon Hover',
										'maxi-blocks'
									)}
									selected={props['icon-status-hover']}
									onChange={val =>
										onChange({
											'icon-status-hover': val,
										})
									}
								/>
								{props['icon-status-hover'] && (
									<IconControl
										{...props}
										getIconWithColor={args =>
											getIconWithColor(props, args, '')
										}
										disableHeightFitContent
										isHover
									/>
								)}
							</>
						),
					},
					props['active-icon-content'] !== '' && {
						label: __('Active state', 'maxi-blocks'),
						content: (
							<IconControl
								{...props}
								getIconWithColor={args =>
									getIconWithColor(props, args, 'active-')
								}
								prefix='active-'
								svgType={svgTypeActive}
								disableHeightFitContent
							/>
						),
					},
				]}
			/>
		</>
	);
};
export default AccordionIconSettings;
