/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '@components/setting-tabs-control';
import Icon from '@components/icon';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';

/**
 * Icons
 */
import { flexWrapNowrap, flexWrap, flexWrapReverse } from '@maxi-icons';

/**
 * Component
 */

const FlexWrapControl = props => {
	const { breakpoint, onChange, prefix = '' } = props;

	const getOptions = () => {
		const options = [];

		options.push({
			icon: <Icon icon={flexWrapNowrap} />,
			value: 'nowrap',
		});

		options.push({
			icon: <Icon icon={flexWrap} />,
			value: 'wrap',
		});

		options.push({
			icon: <Icon icon={flexWrapReverse} />,
			value: 'wrap-reverse',
		});

		return options;
	};

	return (
		<SettingTabsControl
			label={__('Flex wrap', 'maxi-blocks')}
			type='buttons'
			fullWidthMode
			showTooltip
			className='maxi-flex-wrap-control'
			hasBorder
			items={getOptions()}
			value={
				getLastBreakpointAttribute({
					target: `${prefix}flex-wrap`,
					breakpoint,
					attributes: props,
				}) ?? ''
			}
			selected={
				getLastBreakpointAttribute({
					target: `${prefix}flex-wrap`,
					breakpoint,
					attributes: props,
				}) || getOptions()[0].value
			}
			onReset={() =>
				onChange({
					[`${prefix}flex-wrap-${breakpoint}`]: getDefaultAttribute(
						`${prefix}flex-wrap-${breakpoint}`
					),
					isReset: true,
				})
			}
			onChange={val =>
				onChange({
					[`${prefix}flex-wrap-${breakpoint}`]: val,
				})
			}
		/>
	);
};

export default FlexWrapControl;
