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
import { getAttributesValue } from '../../../../extensions/attributes';
import { getIconWithColor } from '../../../../extensions/styles';

const AccordionIconSettings = props => {
	const { onChange, blockStyle, svgTypeActive, breakpoint } = props;

	return (
		<>
			<AxisPositionControl
				label={__('Icon', 'maxi-blocks')}
				disableY
				selected={getAttributesValue({ target: 'icon-position' })}
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
				icon={getAttributesValue({ target: 'icon-content' })}
				label='Icon'
			/>
			<MaxiModal
				type='accordion-icon-active'
				style={blockStyle}
				onSelect={obj => onChange(obj)}
				onRemove={obj => onChange(obj)}
				icon={getAttributesValue({
					target: 'icon-content',
					prefix: 'active-',
				})}
				label='Active icon'
			/>
			<SettingTabsControl
				items={[
					getAttributesValue({ target: 'icon-content' }) !== '' && {
						label: __('Normal state', 'maxi-blocks'),
						content: getAttributesValue({
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
					(getAttributesValue({
						target: 'icon-content',
						prefix: 'active-',
					}) !== '' ||
						getAttributesValue({ target: 'icon-content' }) !==
							'') && {
						label: __('Hover state', 'maxi-blocks'),
						content: (
							<>
								<ToggleSwitch
									label={__(
										'Enable Icon Hover',
										'maxi-blocks'
									)}
									selected={getAttributesValue({
										target: 'icon-status-hover',
									})}
									onChange={val =>
										onChange({
											'icon-status-hover': val,
										})
									}
								/>
								{getAttributesValue({
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
					getAttributesValue({
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
