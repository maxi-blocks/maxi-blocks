/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '@components/setting-tabs-control';
import { getLastBreakpointAttribute } from '@extensions/styles';
import Icon from '@components/icon';

/**
 * Icons
 */
import {
	flexAlignStart,
	flexAlignEnd,
	flexAlignCenter,
	flexAlignBetween,
	flexAlignEvenly,
	flexAlignAround,
	flexAlignStretch,
	flexAlignBaseline,
} from '@maxi-icons';

const FlexContentAlignControl = props => {
	const { breakpoint, onChange, prefix = '' } = props;

	const getOptions = () => {
		const options = [];

		options.push({
			icon: <Icon icon={flexAlignStart} />,
			value: 'flex-start',
		});

		options.push({
			icon: <Icon icon={flexAlignEnd} />,
			value: 'flex-end',
		});

		options.push({
			icon: <Icon icon={flexAlignCenter} />,
			value: 'center',
		});

		options.push({
			icon: <Icon icon={flexAlignBetween} />,
			value: 'space-between',
		});

		options.push({
			icon: <Icon icon={flexAlignAround} />,
			value: 'space-around',
		});

		options.push({
			icon: <Icon icon={flexAlignEvenly} />,
			value: 'space-evenly',
		});

		options.push({
			icon: <Icon icon={flexAlignStretch} />,
			value: 'stretch',
		});

		options.push({
			icon: <Icon icon={flexAlignBaseline} />,
			value: 'baseline',
		});

		return options;
	};

	return (
		<SettingTabsControl
			label={__('Align content', 'maxi-blocks')}
			type='buttons'
			fullWidthMode
			className='maxi-flex__align-content'
			hasBorder
			testIdPrefix={`maxi-control-align-content-${breakpoint}`}
			items={getOptions()}
			showTooltip
			value={
				getLastBreakpointAttribute({
					target: `${prefix}align-content`,
					breakpoint,
					attributes: props,
				}) ?? ''
			}
			selected={
				getLastBreakpointAttribute({
					target: `${prefix}align-content`,
					breakpoint,
					attributes: props,
				}) || getOptions()[6].value
			}
			onChange={val =>
				onChange({
					[`${prefix}align-content-${breakpoint}`]: val,
				})
			}
		/>
	);
};

export default FlexContentAlignControl;
