/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	SelectControl,
	SettingTabsControl,
	ToggleSwitch,
	IconControl,
} from '../../../../components';
import MaxiModal from '../../../../editor/library/modal';
import { getIconWithColor } from '../../../../extensions/styles';

const AccordionIconSettings = props => {
	const { onChange, blockStyle, svgTypeActive } = props;

	return (
		<>
			<SelectControl
				label={__('Icon position', 'maxi-blocks')}
				options={[
					{
						label: 'Right',
						value: 'right',
					},
					{
						label: 'Left',
						value: 'left',
					},
				]}
				value={props['icon-position']}
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
								disableIconOnly
								disableSpacing
								disablePosition
								disableIconInherit
								disableModal
								getIconWithColor={args =>
									getIconWithColor(props, args, '')
								}
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
										disableIconOnly
										disableSpacing
										disablePosition
										disableModal
										disableIconInherit
										getIconWithColor={args =>
											getIconWithColor(props, args, '')
										}
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
								disableIconOnly
								disableSpacing
								disablePosition
								disableModal
								disableIconInherit
								getIconWithColor={args =>
									getIconWithColor(props, args, '')
								}
								prefix='active-'
								svgType={svgTypeActive}
							/>
						),
					},
				]}
			/>
		</>
	);
};
export default AccordionIconSettings;
