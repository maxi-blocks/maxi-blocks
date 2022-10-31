/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SettingTabsControl, IconControl } from '../../../../components';
import MaxiModal from '../../../../editor/library/modal';
import { getIconWithColor } from '../../../../extensions/styles';
import { submenuIndicatorPrefix as prefix } from '../../data';

const SubMenuIndicatorControl = props => {
	const { blockStyle, onChange } = props;
	const type = 'navigation-item-indicator-icon';
	const mutualProps = {
		type,
		disableIconOnly: true,
		disablePosition: true,
		disableIconInherit: true,
		disableModal: true,
	};

	return (
		<>
			<MaxiModal
				type={type}
				style={blockStyle}
				onSelect={obj => onChange(obj)}
				onRemove={obj => onChange(obj)}
				icon={props[`${prefix}icon-content`]}
				prefix={prefix}
			/>
			<SettingTabsControl
				items={[
					{
						label: __('Normal state', 'maxi-block'),
						content: (
							<IconControl
								{...props}
								{...mutualProps}
								prefix={prefix}
								getIconWithColor={args =>
									getIconWithColor(props, args, '')
								}
							/>
						),
					},
					{
						label: __('Hover state', 'maxi-block'),
						content: (
							<IconControl
								{...props}
								{...mutualProps}
								prefix={prefix}
								isHover
								getIconWithColor={args =>
									getIconWithColor(props, args, '')
								}
							/>
						),
					},
					{
						label: __('Active state', 'maxi-block'),
						content: (
							<IconControl
								{...props}
								{...mutualProps}
								prefix={`active-${prefix}`}
								getIconWithColor={args =>
									getIconWithColor(props, args, 'active-')
								}
							/>
						),
					},
				]}
			/>
		</>
	);
};

export default SubMenuIndicatorControl;
