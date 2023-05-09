/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import Icon from '../icon';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * Icons
 */
import { flexWrapNowrap, flexWrap, flexWrapReverse } from '../../icons';

/**
 * Component
 */

const FlexWrapControl = props => {
	const { breakpoint, onChange } = props;

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
					target: 'flex-wrap',
					breakpoint,
					attributes: props,
				}) ?? ''
			}
			selected={
				getLastBreakpointAttribute({
					target: 'flex-wrap',
					breakpoint,
					attributes: props,
				}) || getOptions()[0].value
			}
			onReset={() =>
				onChange({
					[`flex-wrap-${breakpoint}`]: getDefaultAttribute(
						`flex-wrap-${breakpoint}`
					),
					isReset: true,
				})
			}
			onChange={val =>
				onChange({
					[`flex-wrap-${breakpoint}`]: val,
				})
			}
		/>
	);
};

export default FlexWrapControl;
