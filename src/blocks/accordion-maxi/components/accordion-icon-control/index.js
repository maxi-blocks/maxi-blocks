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
	getAttributeKey,
	getAttributesValue,
} from '../../../../extensions/attributes';
import { getIconWithColor } from '../../../../extensions/styles';

const AccordionIconSettings = props => {
	const { onChange, blockStyle, a_st: svgTypeActive, breakpoint } = props;

	return (
		<>
			<AxisPositionControl
				label={__('Icon', 'maxi-blocks')}
				disableY
				selected={getAttributesValue({ target: 'i_pos', props })}
				breakpoint={breakpoint}
				onChange={val =>
					onChange({
						i_pos: val,
					})
				}
			/>
			<MaxiModal
				type='accordion-icon'
				style={blockStyle}
				onSelect={obj => {
					const newSvgType = obj[getAttributeKey('_st', false, '')];

					const icon = getIconWithColor(props, {
						rawIcon: obj[getAttributeKey('i_c', false, '')],
						type: [
							newSvgType !== 'Shape' && 'stroke',
							newSvgType !== 'Line' && 'fill',
						].filter(Boolean),
					});

					onChange({
						[getAttributeKey('_st', false, '')]: newSvgType,
						[getAttributeKey('i_c', false, '')]: icon,
					});
				}}
				onRemove={obj => onChange(obj)}
				icon={getAttributesValue({ target: 'i_c', props })}
				label='Icon'
			/>
			<MaxiModal
				type='accordion-icon-active'
				style={blockStyle}
				onSelect={obj => {
					const newSvgType = obj[getAttributeKey('_st', false, 'a-')];

					const icon = getIconWithColor(
						props,
						{
							rawIcon: obj[getAttributeKey('i_c', false, 'a-')],
							type: [
								newSvgType !== 'Shape' && 'stroke',
								newSvgType !== 'Line' && 'fill',
							].filter(Boolean),
						},
						'a-'
					);

					onChange({
						[getAttributeKey('_st', false, 'a-')]: newSvgType,
						[getAttributeKey('i_c', false, 'a-')]: icon,
					});
				}}
				onRemove={obj => onChange(obj)}
				icon={getAttributesValue({
					target: 'i_c',
					prefix: 'a-',
					props,
				})}
				label='Active icon'
			/>
			<SettingTabsControl
				items={[
					getAttributesValue({ target: 'icon-content' }) !== '' && {
						label: __('Normal state', 'maxi-blocks'),
						content: getAttributesValue({
							target: 'i_c',
							props,
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
						target: 'i_c',
						prefix: 'a-',
						props,
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
										target: 'i.sh',
										props,
									})}
									onChange={val =>
										onChange({
											'i.sh': val,
										})
									}
								/>
								{getAttributesValue({
									target: 'i.sh',
									props,
								}) && (
									<IconControl
										{...props}
										getIconWithColor={args =>
											getIconWithColor(
												{ ...props, _bs: blockStyle },
												args,
												''
											)
										}
										disableHeightFitContent
										isHover
									/>
								)}
							</>
						),
					},
					getAttributesValue({
						target: 'i_c',
						prefix: 'a-',
						props,
					}) !== '' && {
						label: __('Active state', 'maxi-blocks'),
						content: (
							<IconControl
								{...props}
								getIconWithColor={args =>
									getIconWithColor(props, args, 'a-')
								}
								prefix='a-'
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
