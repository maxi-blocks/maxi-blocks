/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AxisPositionControl from '@components/axis-position-control';
import SettingTabsControl from '@components/setting-tabs-control';
import ToggleSwitch from '@components/toggle-switch';
import IconControl from '@components/icon-control';
import MaxiModal from '@editor/library/modal';
import { getIconWithColor } from '@extensions/styles';
import IconColor from '@components/icon-color';

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
			<IconColor
				{...props}
				getIconWithColor={args => getIconWithColor(props, args, '')}
			/>
			<SettingTabsControl
				disablePadding
				items={[
					props['icon-content'] !== '' && {
						label: __('Normal', 'maxi-blocks'),
						content: props['icon-content'] !== '' && (
							<IconControl
								{...props}
								getIconWithColor={args =>
									getIconWithColor(props, args, '')
								}
								disableHeightFitContent
								className='maxi-icon-background-tabs'
							/>
						),
					},
					(props['active-icon-content'] !== '' ||
						props['icon-content'] !== '') && {
						label: __('Hover', 'maxi-blocks'),
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
						label: __('Active', 'maxi-blocks'),
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
