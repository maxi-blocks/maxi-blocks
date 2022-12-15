/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import SettingTabsControl from '../setting-tabs-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import getOptions from './utils';
import Icon from '../icon';

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
	flexAlignVerticalityStart,
	flexAlignVerticalityEnd,
	flexAlignVerticalityCenter,
	flexAlignVerticalityStretch,
	flexAlignVerticalityBaseline,
} from '../../icons';

const FlexAlignControl = props => {
	const { breakpoint, onChange } = props;

	const getOptions = () => {
		const options = [];

			options.push({
				icon: <Icon icon={flexJustifyStart} />,
				value: 'flex-start',
			});

			options.push({
				icon: (
					<Icon icon={flexJustifyEnd} />
				),
				value: 'flex-end',
			});

			options.push({
				icon: (
					<Icon icon={flexJustifyCenter} />
				),
                value: 'center',
			});

			options.push({
				icon: (
					<Icon icon={flexJustifySpaceBetween} />
				),
				value: 'space-between',
			});

			options.push({
				icon: (
					<Icon icon={flexJustifySpaceArround} />
				),
				value: 'space-around',
			});

			options.push({
				icon: (
					<Icon icon={flexJustifySpaceEvenly} />
				),
				value: 'space-evenly',
			});

		return options;
	};

	const getOptionsVertical = () => {
		const options = [];

			options.push({
				icon: <Icon icon={flexAlignVerticalityStart} />,
				value: 'flex-start',
			});

			options.push({
				icon: (
					<Icon icon={flexAlignVerticalityEnd} />
				),
				value: 'flex-end',
			});

			options.push({
				icon: (
					<Icon icon={flexAlignVerticalityCenter} />
				),
				value: 'center',
			});

			options.push({
				icon: (
					<Icon icon={flexAlignVerticalityStretch} />
				),
				value: 'stretch',
			});

			options.push({
				icon: (
					<Icon icon={flexAlignVerticalityBaseline} />
				),
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
			className='maxi-flex-align-control__justify-content'
			hasBorder
			items={getOptions()}
			value={
				getLastBreakpointAttribute({
					target: 'justify-content',
					breakpoint,
					attributes: props,
				}) ?? ''
			}
			selected={
				getLastBreakpointAttribute({
					target: 'justify-content',
					breakpoint,
					attributes: props,
				}) || getOptions()[0].value
			}
			onChange={val =>
				onChange({
					[`justify-content-${breakpoint}`]: val,
				})
			}
		/>
		<SettingTabsControl
			label={__('Align items vertically', 'maxi-blocks')}
			type='buttons'
			fullWidthMode
			className='maxi-flex-align-control__align-items'
			hasBorder
			items={getOptionsVertical()}
			value={
				getLastBreakpointAttribute({
					target: 'align-items',
					breakpoint,
					attributes: props,
				}) ?? ''
			}
			selected={
				getLastBreakpointAttribute({
					target: 'align-items',
					breakpoint,
					attributes: props,
				}) || getOptions()[0].value
			}
			onChange={val =>
				onChange({
					[`align-items-${breakpoint}`]: val,
				})
			}
		/>
			{/* <SelectControl
				label={__('Justify content horizontally', 'maxi-blocks')}
				className='maxi-flex-align-control__justify-content'
				value={
					getLastBreakpointAttribute({
						target: 'justify-content',
						breakpoint,
						attributes: props,
					}) ?? ''
				}
				options={getOptions([
					'flex-start',
					'flex-end',
					'center',
					'space-between',
					'space-around',
					'space-evenly',
				])}
				onChange={val =>
					onChange({
						[`justify-content-${breakpoint}`]: val,
					})
				}
			/> */}
			{/* <SelectControl
				label={__('Align items vertically', 'maxi-blocks')}
				className='maxi-flex-align-control__align-items'
				value={
					getLastBreakpointAttribute({
						target: 'align-items',
						breakpoint,
						attributes: props,
					}) ?? ''
				}
				options={getOptions([
					'flex-start',
					'flex-end',
					'center',
					'stretch',
					'baseline',
				])}
				onChange={val =>
					onChange({
						[`align-items-${breakpoint}`]: val,
					})
				}
			/> */}
		</>
	);
};

export default FlexAlignControl;
