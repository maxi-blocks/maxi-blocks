/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';
// import getOptions from './utils';
import SettingTabsControl from '../setting-tabs-control';
import Icon from '../icon';


/**
 * Icons
 */
import {
	alignLeft,
	alignCenter,
	alignRight,
	alignJustify,
	toolbarAlignCenter,
	toolbarAlignLeft,
	toolbarAlignRight,
	toolbarAlignJustify,
} from '../../icons';


/**
 * Component
 */

const FlexWrapControl = props => {
	const { breakpoint, onChange } = props;

	const getOptions = () => {
		const options = [];

			options.push({
				icon: <Icon icon={alignLeft} />,
				value: 'nowrap',
			});

			options.push({
				icon: (
					<Icon icon={alignCenter} />
				),
				value: 'wrap',
			});

			options.push({
				icon: (
					<Icon icon={alignRight} />
				),
				value: 'wrap-reverse',
			});

		return options;
	};

	return (
		<>
			{/* <SelectControl
				label={__('Flex wrap', 'maxi-blocks')}
				className='maxi-flex-wrap-control'
				value={
					getLastBreakpointAttribute({
						target: 'flex-wrap',
						breakpoint,
						attributes: props,
					}) ?? ''
				}
				options={getOptions(['nowrap', 'wrap', 'wrap-reverse'])}
				onChange={val =>
					onChange({
						[`flex-wrap-${breakpoint}`]: val,
					})
				}
			/> */}
			<SettingTabsControl
			label={__('Flex wrap', 'maxi-blocks')}
			type='buttons'
			fullWidthMode
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
			onChange={val =>
				onChange({
					[`flex-wrap-${breakpoint}`]: val,
				})
			}
		/>
		</>
	);
};

export default FlexWrapControl;
