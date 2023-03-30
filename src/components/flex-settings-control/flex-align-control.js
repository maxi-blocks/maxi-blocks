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
	flexJustifyStart,
	flexJustifyEnd,
	flexJustifyCenter,
	flexJustifySpaceBetween,
	flexJustifySpaceArround,
	flexJustifySpaceEvenly,
	flexAlignVerticallyStart,
	flexAlignVerticallyEnd,
	flexAlignVerticallyCenter,
	flexAlignVerticallyStretch,
	flexAlignVerticallyBaseline,
	styleNone,
} from '../../icons';

const FlexAlignControl = props => {
	const { breakpoint, onChange } = props;

	const getOptions = () => {
		const options = [];

		options.push({
			icon: <Icon icon={styleNone} />,
			value: 'unset',
		});

		options.push({
			icon: <Icon icon={flexJustifyStart} />,
			value: 'flex-start',
		});

		options.push({
			icon: <Icon icon={flexJustifyEnd} />,
			value: 'flex-end',
		});

		options.push({
			icon: <Icon icon={flexJustifyCenter} />,
			value: 'center',
		});

		options.push({
			icon: <Icon icon={flexJustifySpaceBetween} />,
			value: 'space-between',
		});

		options.push({
			icon: <Icon icon={flexJustifySpaceArround} />,
			value: 'space-around',
		});

		options.push({
			icon: <Icon icon={flexJustifySpaceEvenly} />,
			value: 'space-evenly',
		});

		return options;
	};

	const getOptionsVertical = () => {
		const options = [];

		options.push({
			icon: <Icon icon={styleNone} />,
			value: 'unset',
		});

		options.push({
			icon: <Icon icon={flexAlignVerticallyStart} />,
			value: 'flex-start',
		});

		options.push({
			icon: <Icon icon={flexAlignVerticallyEnd} />,
			value: 'flex-end',
		});

		options.push({
			icon: <Icon icon={flexAlignVerticallyCenter} />,
			value: 'center',
		});

		options.push({
			icon: <Icon icon={flexAlignVerticallyStretch} />,
			value: 'stretch',
		});

		options.push({
			icon: <Icon icon={flexAlignVerticallyBaseline} />,
			value: 'baseline',
		});

		return options;
	};

	return (
		<>
			<SettingTabsControl
				label={__('Justify content horizontally', 'maxi-blocks')}
				type='buttons'
				fullWidthMode
				showTooltip
				className='maxi-flex-align-control__justify-content'
				hasBorder
				items={getOptions()}
				value={
					getLastBreakpointAttribute({
						target: '_jc',
						breakpoint,
						attributes: props,
					}) ?? ''
				}
				selected={
					getLastBreakpointAttribute({
						target: '_jc',
						breakpoint,
						attributes: props,
					}) || getOptions()[0].value
				}
				onReset={() =>
					onChange({
						[getAttributeKey('_jc', false, false, breakpoint)]:
							getDefaultAttribute(
								getAttributeKey('_jc', false, false, breakpoint)
							),
						isReset: true,
					})
				}
				onChange={val =>
					onChange({
						[getAttributeKey('_jc', false, false, breakpoint)]: val,
					})
				}
			/>
			<SettingTabsControl
				label={__('Align items vertically', 'maxi-blocks')}
				type='buttons'
				fullWidthMode
				showTooltip
				className='maxi-flex-align-control__align-items'
				hasBorder
				items={getOptionsVertical()}
				value={
					getLastBreakpointAttribute({
						target: '_ai',
						breakpoint,
						attributes: props,
					}) ?? ''
				}
				selected={
					getLastBreakpointAttribute({
						target: '_ai',
						breakpoint,
						attributes: props,
					}) || getOptions()[0].value
				}
				onReset={() =>
					onChange({
						[getAttributeKey('_ai', false, false, breakpoint)]:
							getDefaultAttribute(
								getAttributeKey('_ai', false, false, breakpoint)
							),
						isReset: true,
					})
				}
				onChange={val =>
					onChange({
						[getAttributeKey('_ai', false, false, breakpoint)]: val,
					})
				}
			/>
		</>
	);
};

export default FlexAlignControl;
