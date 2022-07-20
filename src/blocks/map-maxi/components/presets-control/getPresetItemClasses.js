/**
 * External dependencies
 */
import classnames from 'classnames';

const getPresetItemClasses = (className, attrIndex, presetIndex) =>
	classnames(
		className,
		attrIndex - 1 === presetIndex && `${className}--active`
	);

export default getPresetItemClasses;
