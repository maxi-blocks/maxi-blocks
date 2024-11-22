// Abstracted from https://github.com/WordPress/gutenberg/blob/3cbfa27165c8089a9403985bc9ee7698c93b08a8/packages/components/src/base-control/index.js

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * renderAsRenderProps is used to wrap a component and convert
 * the passed property "as" either a string or component, to the
 * rendered tag if a string, or component.
 *
 * See VisuallyHidden hidden for example.
 *
 * @param {string|WPComponent} as A tag or component to render.
 * @return {WPComponent} The rendered component.
 */
function renderAsRenderProps({ as: Component = 'div', ...props }) {
	if (typeof props.children === 'function') {
		return props.children(props);
	}
	return <Component {...props} />;
}

/**
 * VisuallyHidden component to render text out non-visually
 * for use in devices such as a screen reader.
 *
 * @param {Object}             props             Component props.
 * @param {string|WPComponent} [props.as="div"]  A tag or component to render.
 * @param {string}             [props.className] Class to set on the container.
 */
function VisuallyHidden({ as = 'div', className, ...props }) {
	return renderAsRenderProps({
		as,
		className: classnames('components-visually-hidden', className),
		...props,
	});
}

function BaseControl({
	id,
	label,
	hideLabelFromVision,
	help,
	className,
	children,
}) {
	return (
		<div className={classnames('maxi-base-control', className)}>
			<div className='maxi-base-control__field'>
				{label &&
					id &&
					(hideLabelFromVision ? (
						<VisuallyHidden as='label' htmlFor={id}>
							{label}
						</VisuallyHidden>
					) : (
						<label
							className='maxi-base-control__label'
							htmlFor={id}
						>
							{label}
						</label>
					))}
				{label &&
					!id &&
					(hideLabelFromVision ? (
						<VisuallyHidden as='label'>{label}</VisuallyHidden>
					) : (
						<BaseControl.VisualLabel>
							{label}
						</BaseControl.VisualLabel>
					))}
				{children}
			</div>
			{!!help && (
				<p id={`${id}__help`} className='maxi-base-control__help'>
					{help}
				</p>
			)}
		</div>
	);
}

BaseControl.VisualLabel = ({ className, children }) => {
	// eslint-disable-next-line no-param-reassign
	className = classnames('maxi-base-control__label', className);
	return <span className={className}>{children}</span>;
};

export default BaseControl;
