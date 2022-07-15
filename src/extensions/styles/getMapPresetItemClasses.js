/**
 * External dependencies
 */
import classnames from 'classnames';

const getMapPresetItemClasses = (className, attrIndex, presetIndex) =>
	classnames(
		className,
		attrIndex - 1 === presetIndex && `${className}--active`
	);

export default getMapPresetItemClasses;
