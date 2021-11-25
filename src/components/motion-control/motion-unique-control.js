/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';
import { lowerCase } from 'lodash';

/**
 * Internal dependencies
 */
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import BaseControl from '../base-control';
import Button from '../button';
import SettingTabsControl from '../setting-tabs-control';
import SelectControl from '../select-control';
import AdvancedNumberControl from '../advanced-number-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Icons
 */
import { reset } from '../../icons';

/**
 * Component
 */
const MotionUniqueControl = props => {
	const {
		type,
		label,
		className,
		min = -4000,
		max = 4000,
		values,
		onChange,
		breakpoint = 'general',
	} = props;

	const classes = classnames(
		'maxi-advanced-number-control maxi-motion-unique-control',
		className
	);

	const labels = ['Start', 'Mid', 'End'];

	const viewportOptions = [
		{
			label: __('Top of screen', 'maxi-blocks'),
			value: 'top',
		},
		{
			label: __('Middle of screen', 'maxi-blocks'),
			value: 'mid',
		},
		{
			label: __('Bottom of screen', 'maxi-blocks'),
			value: 'bottom',
		},
	];

	return (
		<div className={classes}>
			<SettingTabsControl
				items={labels.map((label, key) => {
					const viewportAttrLabel = () => {
						switch (label) {
							case 'Start':
								return 'top';
							case 'Mid':
								return 'middle';
							case 'End':
								return 'bottom';
							default:
								return 'none';
						}
					};
					console.log(`viwportLabel: ${viewportAttrLabel()}`);
					console.log(
						`value ${getLastBreakpointAttribute(
							`motion-viewport-${viewportAttrLabel()}-${type}`,
							breakpoint,
							values
						)}`
					);
					const specialAttrLabel = lowerCase(label);
					return {
						label: __(`${label} zone`, 'maxi-blocks'),
						content: (
							<>
								<SelectControl
									label={__('Viewport entry', 'maxi-blocks')}
									value={getLastBreakpointAttribute(
										`motion-viewport-${viewportAttrLabel()}-${type}`,
										breakpoint,
										values
									)}
									onChange={val =>
										onChange({
											[`motion-viewport-${viewportAttrLabel()}-${type}-${breakpoint}`]:
												val,
										})
									}
									options={viewportOptions}
								/>
								{type === 'rotate' && (
									<AdvancedNumberControl
										label={__(
											`${label} angle`,
											'maxi-blocks'
										)}
										value={getLastBreakpointAttribute(
											`motion-rotate-${specialAttrLabel}-${type}`,
											breakpoint,
											values
										)}
										onChangeValue={val => {
											onChange({
												[`motion-rotate-${specialAttrLabel}-${type}-${breakpoint}`]:
													val !== undefined &&
													val !== ''
														? val
														: '',
											});
										}}
										min={0}
										step={1}
										max={360}
										onReset={() =>
											onChange({
												[`motion-rotate-${specialAttrLabel}-${type}-${breakpoint}`]:
													getDefaultAttribute(
														`motion-rotate-${lowerCase(
															label
														)}-${type}-general`
													),
											})
										}
										initialPosition={getDefaultAttribute(
											`motion-rotate-${specialAttrLabel}-${type}-general`
										)}
									/>
								)}
								{type === 'fade' && (
									<AdvancedNumberControl
										label={__(
											`${label} opacity`,
											'maxi-blocks'
										)}
										value={getLastBreakpointAttribute(
											`motion-opacity-${specialAttrLabel}-${type}`,
											breakpoint,
											values
										)}
										onChangeValue={val => {
											onChange({
												[`motion-opacity-${specialAttrLabel}-${type}-${breakpoint}`]:
													val !== undefined &&
													val !== ''
														? val
														: '',
											});
										}}
										min={0}
										step={1}
										max={100}
										onReset={() =>
											onChange({
												[`motion-opacity-${specialAttrLabel}-${type}-${breakpoint}`]:
													getDefaultAttribute(
														`motion-opacity-${lowerCase(
															label
														)}-${type}-general`
													),
											})
										}
										initialPosition={getDefaultAttribute(
											`motion-opacity-${specialAttrLabel}-${type}-general`
										)}
									/>
								)}
							</>
						),
					};
				})}
			/>
		</div>
	);
};

export default MotionUniqueControl;
