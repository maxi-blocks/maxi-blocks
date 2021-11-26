/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { lowerCase } from 'lodash';

/**
 * Internal dependencies
 */
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import SettingTabsControl from '../setting-tabs-control';
import AdvancedNumberControl from '../advanced-number-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const MotionUniqueControl = props => {
	const { type, className, values, onChange, breakpoint = 'general' } = props;

	const classes = classnames(
		'maxi-advanced-number-control maxi-motion-unique-control',
		className
	);

	const labels = ['Start', 'Mid', 'End'];

	return (
		<div className={classes}>
			<SettingTabsControl
				items={labels.map((label, key) => {
					const specialAttrLabel = lowerCase(label);
					return {
						label: __(`${label} zone`, 'maxi-blocks'),
						content: (
							<>
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
