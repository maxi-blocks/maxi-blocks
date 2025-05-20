/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { GradientPicker } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BaseControl from '@components/base-control';
import OpacityControl from '@components/opacity-control';
import {
	getAttributeKey,
	getLastBreakpointAttribute,
} from '@extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const GradientControl = props => {
	const {
		label,
		className,
		breakpoint,
		prefix = '',
		isHover = false,
		onChange,
	} = props;

	const gradient = getLastBreakpointAttribute({
		target: `${prefix}gradient`,
		breakpoint,
		attributes: props,
		isHover,
	});

	const gradientOpacity = getLastBreakpointAttribute({
		target: `${prefix}gradient-opacity`,
		breakpoint,
		attributes: props,
		isHover,
	});

	const classes = classnames('maxi-gradient-control', className);

	return (
		<div className={classes}>
			<BaseControl
				className='maxi-gradient-control__display'
				label={`${label} ${__('colour', 'maxi-blocks')}`}
			>
				<div className='maxi-gradient-control__display__color'>
					<span style={{ background: gradient }} />
				</div>
			</BaseControl>
			<OpacityControl
				label={__('Gradient opacity', 'maxi-blocks')}
				opacity={gradientOpacity}
				onChange={onChange}
				breakpoint={breakpoint}
				prefix={`${prefix}gradient-`}
				isHover={isHover}
				disableRTC
			/>
			<div className='maxi-gradient-control__gradient'>
				<GradientPicker
					value={gradient}
					onChange={gradient =>
						onChange({
							[getAttributeKey(
								'gradient',
								isHover,
								prefix,
								breakpoint
							)]: gradient,
						})
					}
					gradients={[]}
					// Should be removed after deprecation period will end, approximately in WP 6.4
					__nextHasNoMargin
				/>
			</div>
		</div>
	);
};

export default GradientControl;
