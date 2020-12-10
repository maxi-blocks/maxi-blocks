/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { RangeControl } = wp.components;

/**
 * Internal dependencies
 */
import __experimentalFancyRadioControl from '../fancy-radio-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil } from 'lodash';

/**
 * Component
 */
const ParallaxControl = props => {
	const { className, onChange } = props;

	const motion = { ...props.motion };
	const defaultMotion = { ...props.defaultMotion };

	const { parallax: parallaxOptions } = motion;
	const { parallax: defaultParallaxOptions } = defaultMotion;

	const classes = classnames('maxi-parallax-control', className);

	return (
		<div className={classes}>
			<__experimentalFancyRadioControl
				label={__('Use Parallax Effect', 'maxi-blocks')}
				selected={parallaxOptions.status}
				options={[
					{ label: __('Yes', 'maxi-blocks'), value: 1 },
					{ label: __('No', 'maxi-blocks'), value: 0 },
				]}
				onChange={val => {
					parallaxOptions.status = Number(val);
					onChange(motion);
				}}
			/>
			{!!parallaxOptions.status && (
				<Fragment>
					<__experimentalFancyRadioControl
						label={__('Direction', 'maxi-blocks')}
						selected={parallaxOptions.direction}
						options={[
							{ label: __('Up', 'maxi-blocks'), value: 'up' },
							{
								label: __('Down', 'maxi-blocks'),
								value: 'down',
							},
						]}
						onChange={val => {
							parallaxOptions.direction = val;
							onChange(motion);
						}}
					/>
					<RangeControl
						label={__('Speed', 'maxi-blocks')}
						value={parallaxOptions.speed}
						onChange={val => {
							isNil(val)
								? (parallaxOptions.speed =
										defaultParallaxOptions.speed)
								: (parallaxOptions.speed = Number(val));

							onChange(motion);
						}}
						min={1}
						max={10}
						allowReset
						initialPosition={defaultParallaxOptions.speed}
					/>
				</Fragment>
			)}
		</div>
	);
};

export default ParallaxControl;
