/**
 * Wordpress dependencies
 */
const { RadioControl } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, isEmpty } from 'lodash';

/**
 * Styles and Icons
 */
import './editor.scss';
import { alignLeft, alignCenter, alignRight, alignJustify } from '../../icons';
import { Icon } from '@wordpress/icons';

/**
 * Component
 */
const AlignmentControl = props => {
	const {
		alignment,
		className,
		onChange,
		label = '',
		disableLeft = false,
		disableCenter = false,
		disableRight = false,
		disableJustify = false,
		breakpoint = 'general',
	} = props;

	const getOptions = () => {
		const options = [
			...(!disableLeft && [
				{
					label: <Icon icon={alignLeft} />,
					value: 'left',
				},
			]),
			...(!disableCenter && [
				{
					label: <Icon icon={alignCenter} />,
					value: 'center',
				},
			]),
			...(!disableRight && [
				{
					label: <Icon icon={alignRight} />,
					value: 'right',
				},
			]),
			...(!disableJustify && [
				{
					label: <Icon icon={alignJustify} />,
					value: 'justify',
				},
			]),
		];

		return options;
	};

	const value = !isObject(alignment) ? JSON.parse(alignment) : alignment;
	const classes = classnames(
		'maxi-alignment-control',
		isEmpty(label) ? 'maxi-alignment-control__no-label' : '',
		className
	);

	return (
		<RadioControl
			label={label}
			className={classes}
			selected={getLastBreakpointValue(value, 'alignment', breakpoint)}
			options={getOptions()}
			onChange={val => {
				value[breakpoint].alignment = val;
				onChange(JSON.stringify(value));
			}}
		/>
	);
};

export default AlignmentControl;
