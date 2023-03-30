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
	getAttributeKey,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';

/**
 * Icons
 */
import {
	flexWrapNowrap,
	flexWrap,
	flexWrapReverse,
	styleNone,
} from '../../icons';

/**
 * Component
 */

const FlexWrapControl = props => {
	const { breakpoint, onChange } = props;

	const getOptions = () => {
		const options = [];

		options.push({
			icon: <Icon icon={styleNone} />,
			value: 'unset',
		});

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
					target: '_flw',
					breakpoint,
					attributes: props,
				}) ?? ''
			}
			selected={
				getLastBreakpointAttribute({
					target: '_flw',
					breakpoint,
					attributes: props,
				}) || getOptions()[0].value
			}
			onReset={() =>
				onChange({
					[getAttributeKey('_flw', false, false, breakpoint)]:
						getDefaultAttribute(
							getAttributeKey('_flw', false, false, breakpoint)
						),
					isReset: true,
				})
			}
			onChange={val =>
				onChange({
					[getAttributeKey('_flw', false, false, breakpoint)]: val,
				})
			}
		/>
	);
};

export default FlexWrapControl;
