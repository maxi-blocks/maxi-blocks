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
	flexAlignStretch,
} from '@maxi-icons';

const FlexAlignControl = props => {
	const { breakpoint, onChange, prefix = '' } = props;

	const getOptions = () => {
		const options = [];

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
			icon: <Icon icon={flexAlignStretch} />,
			value: 'normal',
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
						target: `${prefix}justify-content`,
						breakpoint,
						attributes: props,
					}) ?? ''
				}
				selected={
					getLastBreakpointAttribute({
						target: `${prefix}justify-content`,
						breakpoint,
						attributes: props,
					}) || getOptions()[0].value
				}
				onReset={() =>
					onChange({
						[`${prefix}justify-content-${breakpoint}`]:
							getDefaultAttribute(
								`${prefix}justify-content-${breakpoint}`
							),
						isReset: true,
					})
				}
				onChange={val =>
					onChange({
						[`${prefix}justify-content-${breakpoint}`]: val,
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
						target: `${prefix}align-items`,
						breakpoint,
						attributes: props,
					}) ?? ''
				}
				selected={
					getLastBreakpointAttribute({
						target: `${prefix}align-items`,
						breakpoint,
						attributes: props,
					}) || getOptions()[0].value
				}
				onReset={() =>
					onChange({
						[`${prefix}align-items-${breakpoint}`]:
							getDefaultAttribute(
								`${prefix}align-items-${breakpoint}`
							),
						isReset: true,
					})
				}
				onChange={val =>
					onChange({
						[`${prefix}align-items-${breakpoint}`]: val,
					})
				}
			/>
		</>
	);
};

export default FlexAlignControl;
