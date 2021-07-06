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

	const classes = classnames('maxi-icon-control', className);

	return (
		<div className={classes}>
			<AdvancedNumberControl
				label={__('Size', 'maxi-blocks')}
				min={1}
				max={999}
				initial={1}
				step={1}
				value={props['icon-size']}
				onChangeValue={val => onChange({ 'icon-size': val })}
				onReset={() =>
					onChange({ 'icon-size': getDefaultAttribute('icon-size') })
				}
			/>
			<AdvancedNumberControl
				label={__('Spacing', 'maxi-blocks')}
				min={1}
				max={999}
				initial={1}
				step={1}
				value={props['icon-spacing']}
				onChangeValue={val => onChange({ 'icon-spacing': val })}
				onReset={() =>
					onChange({
						'icon-spacing': getDefaultAttribute('icon-spacing'),
					})
				}
			/>
			<FancyRadioControl
				label={__('Icon Position', 'maxi-block')}
				selected={props['icon-position']}
				options={[
					{ label: __('Right', 'maxi-block'), value: 'right' },
					{ label: __('Left', 'maxi-block'), value: 'left' },
				]}
				optionType='string'
				onChange={val =>
					onChange({
						'icon-position': val,
					})
				}
			/>
		</div>
	);
};

export default IconControl;
