/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TextControl from '@components/text-control';
import SelectControl from '@components/select-control';
import { setSVGAriaLabel } from '@extensions/svg';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const AriaLabelControl = ({ ariaLabels, targets, onChange, getIcon }) => {
	const [target, setTarget] = useState(targets[0]);

	const targetsOptions = targets.map(value => ({
		label: value.charAt(0).toUpperCase() + value.slice(1),
		value,
	}));

	const onChangeAriaLabel = useCallback(
		value => {
			const newAriaLabels = { ...ariaLabels };

			if (isEmpty(value)) {
				delete newAriaLabels[target];
			} else {
				newAriaLabels[target] = value;
			}

			onChange({
				obj: { ariaLabels: newAriaLabels },
				target,
				...(!!getIcon && {
					icon: setSVGAriaLabel(value, getIcon, target),
				}),
			});
		},
		[ariaLabels, onChange, target, getIcon]
	);

	return (
		<>
			<SelectControl
				__nextHasNoMarginBottom
				label={__('Target', 'maxi-blocks')}
				newStyle
				options={targetsOptions}
				value={target}
				onChange={value => {
					setTarget(value);
				}}
			/>
			<TextControl
				label={__('Aria Label', 'maxi-blocks')}
				newStyle
				value={ariaLabels?.[target] || ''}
				onChange={onChangeAriaLabel}
			/>
		</>
	);
};

export default AriaLabelControl;
