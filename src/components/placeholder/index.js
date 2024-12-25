/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useResizeObserver } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import Icon from '@components/icon';

/**
 * Styles and Icons
 */
import './editor.scss';

function Placeholder({
	icon,
	children,
	label = '',
	instructions,
	className,
	notices,
	preview,
	isColumnLayout,
	...additionalProps
}) {
	const [resizeListener, { width }] = useResizeObserver();

	// Since `useResizeObserver` will report a width of `null` until after the
	// first render, avoid applying any modifier classes until width is known.
	let modifierClassNames;
	if (typeof width === 'number') {
		modifierClassNames = {
			'is-large': width >= 480,
			'is-medium': width >= 160 && width < 480,
			'is-small': width < 160,
		};
	}

	const classes = classnames(
		'maxi-placeholder',
		className,
		modifierClassNames
	);
	const fieldsetClasses = classnames('maxi-placeholder__fieldset', {
		'is-column-layout': isColumnLayout,
	});
	return (
		<div {...additionalProps} className={classes}>
			{resizeListener}
			{notices}
			{preview && (
				<div className='maxi-placeholder__preview'>{preview}</div>
			)}
			<div className='maxi-placeholder__label'>
				<Icon icon={icon} />
				{label}
			</div>
			{!!instructions && (
				<div className='maxi-placeholder__instructions'>
					{instructions}
				</div>
			)}
			<div className={fieldsetClasses}>{children}</div>
		</div>
	);
}

export default Placeholder;
