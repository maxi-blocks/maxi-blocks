/**
 * External dependencies
 */
import classnames from 'classnames';
import { isArray, isString } from 'lodash';

/**
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Tooltip from '@wordpress/components/src/tooltip';
import Button from '@wordpress/components/src/button';
import Dashicon from '@wordpress/components/src/dashicon';

function IconButton(props, ref) {
	const {
		icon,
		children,
		label,
		className,
		tooltip,
		shortcut,
		labelPosition,
		...additionalProps
	} = props;
	const { 'aria-pressed': ariaPressed } = additionalProps;
	const classes = classnames('components-icon-button', className, {
		'has-text': children,
	});
	const tooltipText = tooltip || label;

	// Should show the tooltip if...
	const showTooltip =
		!additionalProps.disabled &&
		// an explicit tooltip is passed or...
		(tooltip ||
			// there's a shortcut or...
			shortcut ||
			// there's a label and...
			(!!label &&
				// the children are empty and...
				(!children || (isArray(children) && !children.length)) &&
				// the tooltip is not explicitly disabled.
				tooltip !== false));

	let element = (
		<Button
			aria-label={label}
			{...additionalProps}
			className={classes}
			ref={ref}
		>
			{isString(icon) ? (
				<Dashicon icon={icon} ariaPressed={ariaPressed} />
			) : (
				icon
			)}
			{children}
		</Button>
	);

	if (showTooltip) {
		element = (
			<Tooltip
				text={tooltipText}
				shortcut={shortcut}
				position={labelPosition}
			>
				{element}
			</Tooltip>
		);
	}

	return element;
}

export default forwardRef(IconButton);
