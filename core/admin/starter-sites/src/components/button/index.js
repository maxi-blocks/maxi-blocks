/**
 * WordPress dependencies
 */
import deprecated from '@wordpress/deprecated';
import { forwardRef } from '@wordpress/element';
import { Tooltip } from '@wordpress/components'; // Should be replaced for the new components

/**
 * Internal dependencies
 */
import Icon from '../icon';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isArray } from 'lodash';

const disabledEventsOnDisabledButton = ['onMouseDown', 'onClick'];

export function SimpleButton(props, ref) {
	const {
		href,
		target,
		linkElement,
		isPrimary,
		isSmall,
		isTertiary,
		isPressed,
		isBusy,
		isDefault,
		isSecondary,
		isLink,
		isDestructive,
		className,
		disabled,
		icon,
		iconSize,
		showTooltip,
		tooltipPosition,
		shortcut,
		label,
		children,
		__experimentalIsFocusable: isFocusable,
		...additionalProps
	} = props;

	if (isDefault) {
		deprecated('Button isDefault prop', {
			alternative: 'isSecondary',
		});
	}

	const classes = classnames(
		'maxi-components-button',
		'components-button',
		className,
		{
			'is-secondary': isDefault || isSecondary,
			'is-primary': isPrimary,
			'is-small': isSmall,
			'is-tertiary': isTertiary,
			'is-pressed': isPressed,
			'is-busy': isBusy,
			'is-link': isLink,
			'is-destructive': isDestructive,
			'has-text': !!icon && !!children,
			'has-icon': !!icon,
		}
	);

	const trulyDisabled = disabled && !isFocusable;
	const Tag =
		href !== undefined &&
		!trulyDisabled &&
		(!linkElement || linkElement === 'button')
			? 'a'
			: 'button';
	const tagProps =
		Tag === 'a'
			? { href, target }
			: {
					type: 'button',
					disabled: trulyDisabled,
					'aria-pressed': isPressed,
			  };

	if (disabled && isFocusable) {
		// In this case, the button will be disabled, but still focusable and
		// perceivable by screen reader users.
		tagProps['aria-disabled'] = true;

		for (const disabledEvent of disabledEventsOnDisabledButton) {
			additionalProps[disabledEvent] = event => {
				event.stopPropagation();
				event.preventDefault();
			};
		}
	}

	// Should show the tooltip if...
	const shouldShowTooltip =
		!trulyDisabled &&
		// an explicit tooltip is passed or...
		((showTooltip && label) ||
			// there's a shortcut or...
			shortcut ||
			// there's a label and...
			(!!label &&
				// the children are empty and...
				(!children || (isArray(children) && !children.length)) &&
				// the tooltip is not explicitly disabled.
				showTooltip !== false));

	const element = (
		<Tag
			{...tagProps}
			{...additionalProps}
			className={classes}
			aria-label={additionalProps['aria-label'] || label}
			ref={ref}
		>
			{icon && <Icon icon={icon} size={iconSize} />}
			{children}
		</Tag>
	);

	if (!shouldShowTooltip) {
		return element;
	}

	return (
		<Tooltip text={label} shortcut={shortcut} placement={tooltipPosition}>
			{element}
		</Tooltip>
	);
}

export default forwardRef(SimpleButton);
