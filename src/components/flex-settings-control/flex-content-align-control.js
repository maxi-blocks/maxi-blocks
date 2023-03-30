/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SettingTabsControl from '../setting-tabs-control';
import {
	getAttributeKey,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
import Icon from '../icon';

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
	styleNone,
} from '../../icons';

const FlexContentAlignControl = props => {
	const { breakpoint, onChange } = props;

	const getOptions = () => {
		const options = [];

		options.push({
			icon: <Icon icon={styleNone} />,
			value: 'unset',
		});

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
			items={getOptions()}
			showTooltip
			value={
				getLastBreakpointAttribute({
					target: '_ac',
					breakpoint,
					attributes: props,
				}) ?? ''
			}
			selected={
				getLastBreakpointAttribute({
					target: '_ac',
					breakpoint,
					attributes: props,
				}) || getOptions()[0].value
			}
			onChange={val =>
				onChange({
					[getAttributeKey('_ac', false, false, breakpoint)]: val,
				})
			}
		/>
	);
};

export default FlexContentAlignControl;
