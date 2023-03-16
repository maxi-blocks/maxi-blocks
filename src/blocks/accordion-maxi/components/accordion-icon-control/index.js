/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	AxisPositionControl,
	SettingTabsControl,
	ToggleSwitch,
	IconControl,
} from '../../../../components';
import MaxiModal from '../../../../editor/library/modal';
import {
	getAttributeValue,
	getIconWithColor,
} from '../../../../extensions/styles';

const AccordionIconSettings = props => {
	const { onChange, blockStyle, svgTypeActive, breakpoint } = props;

	return (
		<>
			<AxisPositionControl
				label={__('Icon', 'maxi-blocks')}
				disableY
				selected={getAttributeValue({ target: 'icon-position' })}
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
				icon={getAttributeValue({ target: 'icon-content' })}
				label='Icon'
			/>
			<MaxiModal
				type='accordion-icon-active'
				style={blockStyle}
				onSelect={obj => onChange(obj)}
				onRemove={obj => onChange(obj)}
				icon={getAttributeValue({
					target: 'icon-content',
					prefix: 'active-',
				})}
				label='Active icon'
			/>
			<SettingTabsControl
				items={[
					getAttributeValue({ target: 'icon-content' }) !== '' && {
						label: __('Normal state', 'maxi-blocks'),
						content: getAttributeValue({
							target: 'icon-content',
						}) !== '' && (
							<IconControl
								{...props}
								getIconWithColor={args =>
									getIconWithColor(props, args, '')
								}
								disableHeightFitContent
							/>
						),
					},
					(getAttributeValue({
						target: 'icon-content',
						prefix: 'active-',
					}) !== '' ||
						getAttributeValue({ target: 'icon-content' }) !==
							'') && {
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable Icon Hover',
										'maxi-blocks'
									)}
									selected={getAttributeValue({
										target: 'icon-status-hover',
									})}
									onChange={val =>
										onChange({
											'icon-status-hover': val,
										})
									}
								/>
								{getAttributeValue({
									target: 'icon-status-hover',
								}) && (
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
					getAttributeValue({
						target: 'icon-content',
						prefix: 'active-',
					}) !== '' && {
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
