import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import AdvancedNumberControl from '../advanced-number-control';
import ToggleSwitch from '../toggle-switch';

const SliderControl = props => {
	const { className, attributes, maxiSetAttributes } = props;

	const { numberOfSlides, isVertical } = attributes;

	const classes = classnames('maxi-slider-control', className);

	return (
		<div className={classes}>
			<ToggleSwitch
				label={__('Vertical view', 'maxi-blocks')}
				selected={isVertical}
				onChange={val => {
					maxiSetAttributes({ isVertical: val });
				}}
			/>
			<AdvancedNumberControl
				label='Number of slides'
				value={numberOfSlides}
				onChangeValue={val =>
					maxiSetAttributes({ numberOfSlides: val })
				}
				onReset={() => maxiSetAttributes({ numberOfSlides: 6 })}
				min={0}
				max={10}
				className={classes}
			/>
		</div>
	);
};

export default SliderControl;
