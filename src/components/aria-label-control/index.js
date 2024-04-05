/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import TextControl from '../text-control';
import SelectControl from '../select-control';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const AriaLabelControl = ({ ariaLabels, targets, onChange, getIcon }) => {
	const [target, setTarget] = useState(targets[0]);

	const targetsOptions = useMemo(() => {
		return targets.map(value => ({
			label: value.charAt(0).toUpperCase() + value.slice(1),
			value,
		}));
	}, [targets]);

	const onChangeSVGAria = useCallback(
		value => {
			const { documentElement } = new DOMParser().parseFromString(
				getIcon(target),
				'text/html'
			);
			const svg = documentElement.querySelector('svg');
			svg.setAttribute('aria-label', value);
			return svg.outerHTML;
		},
		[getIcon, target]
	);

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
				icon: onChangeSVGAria(value),
			});
		},
		[ariaLabels, onChange, onChangeSVGAria, target]
	);

	return (
		<>
			<SelectControl
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
