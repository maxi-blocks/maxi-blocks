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
import { applyEffect } from './scroll-effect-preview';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const ScrollEffectsUniqueControl = props => {
	const {
		type,
		className,
		values,
		onChange,
		breakpoint = 'general',
		uniqueID,
		isPreviewEnabled,
	} = props;

	const classes = classnames(
		'maxi-advanced-number-control maxi-scroll-unique-control',
		className
	);

	const labels = ['Start', 'Mid', 'End'];

	const getSpecialLabels = (type, label) => {
		const labelLowCase = lowerCase(label);
		const response = {};
		switch (type) {
			case 'vertical':
				response.label = `${label} position (px)`;
				response.attr = `vertical-${labelLowCase}`;
				response.min = -4000;
				response.max = 4000;
				break;
			case 'horizontal':
				response.label = `${label} position (px)`;
				response.attr = `horizontal-${labelLowCase}`;
				response.min = -4000;
				response.max = 4000;
				break;
			case 'rotate':
				response.label = `${label} angle (degrees)`;
				response.attr = `rotate-${labelLowCase}`;
				response.min = -360;
				response.max = 360;
				break;
			case 'scale':
				response.label = `${label} scale (%)`;
				response.attr = `scale-${labelLowCase}`;
				response.min = 0;
				response.max = 1000;
				break;
			case 'fade':
				response.label = `${label} opacity (%)`;
				response.attr = `opacity-${labelLowCase}`;
				response.min = 0;
				response.max = 100;
				break;
			case 'blur':
				response.label = `${label} blur (px)`;
				response.attr = `blur-${labelLowCase}`;
				response.min = 0;
				response.max = 20;
				break;

			default:
				break;
		}
		return response;
	};

	return (
		<div className={classes}>
			<SettingTabsControl
				items={labels.map(label => {
					const special = getSpecialLabels(type, label);
					return {
						label: __(`${label} zone`, 'maxi-blocks'),
						content: (
							<AdvancedNumberControl
								label={__(special?.label, 'maxi-blocks')}
								value={getLastBreakpointAttribute({
									target: `scroll-${type}-${special?.attr}`,
									breakpoint,
									attributes: values,
								})}
								onChangeValue={val => {
									onChange({
										[`scroll-${type}-${special?.attr}-${breakpoint}`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
									isPreviewEnabled &&
										applyEffect(type, uniqueID, val);
								}}
								min={special?.min}
								step={1}
								max={special?.max}
								onReset={() => {
									onChange({
										[`scroll-${type}-${special?.attr}-${breakpoint}`]:
											getDefaultAttribute(
												`scroll-${type}-${special?.attr}-general`
											),
										isReset: true,
									});
									isPreviewEnabled &&
										applyEffect(
											type,
											uniqueID,
											getDefaultAttribute(
												`scroll-${type}-${special?.attr}-general`
											)
										);
								}}
								initialPosition={getDefaultAttribute(
									`scroll-${type}-${special?.attr}-general`
								)}
							/>
						),
					};
				})}
			/>
		</div>
	);
};

export default ScrollEffectsUniqueControl;
