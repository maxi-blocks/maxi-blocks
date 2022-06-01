/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import TransitionControl from '../transition-control';
import { getGroupAttributes } from '../../extensions/styles';
import ResponsiveTabsControl from '../responsive-tabs-control';
import SettingTabsControl from '../setting-tabs-control';
import SelectControl from '../select-control';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep } from 'lodash';

/**
 * Component
 */
const TransitionControlWrapper = props => {
	const { attributes, deviceType, maxiSetAttributes, type } = props;
	const { transition: rawTransition } = attributes;

	const transition = cloneDeep(rawTransition);

	Object.keys(transition[type]).forEach(key => {
		if (
			transition[type][key]?.hoverProp &&
			!attributes[transition[type][key].hoverProp]
		)
			delete transition[type][key];
	});

	return (
		<>
			<SelectControl
				label={__('Settings', 'maxi-blocks')}
				value={attributes[`transition-${type}-selected`]}
				options={[
					{
						label: __('Select setting', 'maxi-blocks'),
						value: 'none',
					},
					...(transition[type] &&
						Object.keys(transition[type]).map(name => ({
							label: __(
								name.charAt(0).toUpperCase() + name.slice(1),
								'maxi-blocks'
							),
							value: name,
						}))),
				]}
				onChange={val => {
					maxiSetAttributes({
						[`transition-${type}-selected`]: val,
					});
				}}
			/>
			{attributes[`transition-${type}-selected`] &&
				attributes[`transition-${type}-selected`] !== 'none' && (
					<ResponsiveTabsControl breakpoint={deviceType}>
						<TransitionControl
							{...getGroupAttributes(attributes, 'transition')}
							onChange={obj => maxiSetAttributes(obj)}
							breakpoint={deviceType}
							type={type}
						/>
					</ResponsiveTabsControl>
				)}
		</>
	);
};

const transition = ({
	props,
	label = __('Hover transition', 'maxi-blocks'),
}) => {
	const { attributes, deviceType } = props;
	const { transition } = attributes;

	const ignoreIndicator = [
		'transition-block-selected',
		'transition-canvas-selected',
	];

	return {
		label,
		content:
			!isEmpty(transition.block) && !isEmpty(transition.canvas) ? (
				<SettingTabsControl
					breakpoint={deviceType}
					items={[
						{
							label: __('Block', 'maxi-blocks'),
							content: (
								<TransitionControlWrapper
									type='block'
									{...props}
								/>
							),
							ignoreIndicator,
						},
						{
							label: __('Canvas', 'maxi-blocks'),
							content: (
								<TransitionControlWrapper
									type='canvas'
									{...props}
								/>
							),
							ignoreIndicator,
						},
					]}
				/>
			) : (
				<TransitionControlWrapper type='canvas' {...props} />
			),
		ignoreIndicator,
	};
};

export default transition;
