/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '@components/setting-tabs-control';
import Icon from '@components/icon';
import { getLastBreakpointAttribute } from '@extensions/styles';

/**
 * Icons
 */
import {
	flexDirectionRow,
	flexDirectionColumn,
	flexDirectionRowReverse,
	flexDirectionColumnReverse,
} from '@maxi-icons';

/**
 * Component
 */

const FlexDirectionControl = props => {
	const { breakpoint, onChange, prefix = '' } = props;

	const getOptions = () => {
		const options = [];

		options.push({
			icon: <Icon icon={flexDirectionRow} />,
			value: 'row',
		});

		options.push({
			icon: <Icon icon={flexDirectionColumn} />,
			value: 'column',
		});

		options.push({
			icon: <Icon icon={flexDirectionRowReverse} />,
			value: 'row-reverse',
		});

		options.push({
			icon: <Icon icon={flexDirectionColumnReverse} />,
			value: 'column-reverse',
		});

		return options;
	};

	return (
		<SettingTabsControl
			label={__('Flex direction', 'maxi-blocks')}
			type='buttons'
			fullWidthMode
			showTooltip
			className='maxi-flex__direction'
			hasBorder
			items={getOptions()}
			value={
				getLastBreakpointAttribute({
					target: `${prefix}flex-direction`,
					breakpoint,
					attributes: props,
				}) ?? ''
			}
			selected={
				getLastBreakpointAttribute({
					target: `${prefix}flex-direction`,
					breakpoint,
					attributes: props,
				}) || getOptions()[0].value
			}
			onChange={val =>
				onChange({
					[`${prefix}flex-direction-${breakpoint}`]: val,
				})
			}
		/>
	);
};

export default FlexDirectionControl;
