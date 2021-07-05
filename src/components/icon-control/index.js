/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import FancyRadioControl from '../fancy-radio-control';
import { getDefaultAttribute } from '../../extensions/styles';

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
const IconControl = props => {
	const { className, onChange } = props;

	const classes = classnames('maxi-map-control', className);

	return (
		<div className={classes}>
			<AdvancedNumberControl
				label={__('Size', 'maxi-blocks')}
				min={1}
				max={999}
				initial={1}
				step={1}
				// value={props['map-zoom']}
				// onChangeValue={val => onChange({ 'map-zoom': val })}
				// onReset={() =>}
			/>
			<AdvancedNumberControl
				label={__('Spacing', 'maxi-blocks')}
				min={1}
				max={999}
				initial={1}
				step={1}
				// value={props['map-zoom']}
				// onChangeValue={val => onChange({ 'map-zoom': val })}
				// onReset={() =>}
			/>
			<FancyRadioControl
				label={__('Icon Position', 'maxi-block')}
				// selected={props['map-marker-custom-color-status']}
				options={[
					{ label: __('Right', 'maxi-block'), value: 'right' },
					{ label: __('Left', 'maxi-block'), value: 'left' },
				]}
				// onChange={val =>}
			/>
		</div>
	);
};

export default IconControl;
