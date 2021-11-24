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

	console.log('MotionUniqueControl is loaded');

	console.log(values);

	const classes = classnames(
		'maxi-advanced-number-control maxi-motion-unique-control',
		className
	);

	const motionUniqueControlId = `maxi-advanced-number-control__${useInstanceId(
		MotionUniqueControl
	)}`;

	const inputLabel = type === 'fade' ? 'opacity' : label;
	const minimum = type === 'fade' ? 0 : min;
	const maximum = type === 'fade' ? 100 : max;

	const labels = ['Start', 'Mid', 'End'];

	const viewportOptions = [
		{
			label: __('Top of screen', 'maxi-blocks'),
			value: 'sun-effect',
		},
		{
			label: __('Middle of screen', 'maxi-blocks'),
			value: 'clockwise',
		},
		{
			label: __('Bottom of screen', 'maxi-blocks'),
			value: 'counterclockwise',
		},
	];

	return (
		<div className={classes}>
			<SettingTabsControl
				items={labels.map((label, key) => {
					return {
						label: __(`${label} zone`, 'maxi-blocks'),
						content: (
							<>
								<SelectControl
									label={__('Viewport entry', 'maxi-blocks')}
									value={getLastBreakpointAttribute(
										`motion-viewport-bottom-${type}`,
										breakpoint,
										values
									)}
									onChange={val =>
										onChange({
											[`motion-viewport-bottom-${type}-${breakpoint}`]:
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
											`motion-rotate-${lowerCase(
												label
											)}-${type}`,
											breakpoint,
											values
										)}
										onChangeValue={val => {
											onChange({
												[`motion-rotate-${lowerCase(
													label
												)}-${type}-${breakpoint}`]:
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
												[`motion-rotate-${lowerCase(
													label
												)}-${type}-${breakpoint}`]:
													getDefaultAttribute(
														`motion-rotate-${lowerCase(
															label
														)}-${type}-general`
													),
											})
										}
										initialPosition={getDefaultAttribute(
											`motion-rotate-${lowerCase(
												label
											)}-${type}-general`
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
