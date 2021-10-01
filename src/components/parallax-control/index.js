/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import FancyRadioControl from '../fancy-radio-control';
import ToggleSwitch from '../toggle-switch';
import AdvancedNumberControl from '../advanced-number-control';
import { getDefaultAttribute } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const ParallaxControl = props => {
	const { className, onChange } = props;

	const classes = classnames('maxi-parallax-control', className);

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Use Parallax Effect', 'maxi-blocks')}
				selected={props['parallax-status']}
				onChange={val =>
					onChange({
						'parallax-status': val,
						'background-image-size': val ? 'cover' : 'auto',
					})
				}
			/>
			{props['parallax-status'] && (
				<>
					<FancyRadioControl
						className='parallax-direction'
						label={__('Direction', 'maxi-blocks')}
						selected={props['parallax-direction']}
						options={[
							{ label: __('Up', 'maxi-blocks'), value: 'up' },
							{
								label: __('Down', 'maxi-blocks'),
								value: 'down',
							},
						]}
						optionType='string'
						onChange={val =>
							onChange({ 'parallax-direction': val })
						}
					/>
					<AdvancedNumberControl
						label={__('Speed', 'maxi-blocks')}
						value={props['parallax-speed']}
						onChangeValue={val => {
							onChange({
								'parallax-speed':
									val !== undefined && val !== '' ? val : '',
							});
						}}
						min={0.2}
						max={10}
						step={0.1}
						onReset={() =>
							onChange({
								'parallax-speed':
									getDefaultAttribute('parallax-speed'),
							})
						}
						initialPosition={getDefaultAttribute('parallax-speed')}
					/>
				</>
			)}
		</div>
	);
};

export default ParallaxControl;
