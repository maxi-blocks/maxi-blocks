/**
 * Wordpress dependencies
 */
const { RadioControl } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../utils';

const { Icon } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Styles and Icons
 */
import './editor.scss';
import { alignLeft, alignCenter, alignRight, alignJustify } from '../../icons';

/**
 * Component
 */
const AlignmentControl = props => {
	const {
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

	const alignment = { ...props.alignment };

	const classes = classnames(
		'maxi-alignment-control',
		isEmpty(label) ? 'maxi-alignment-control__no-label' : '',
		className
	);

	return (
		<RadioControl
			label={label}
			className={classes}
			selected={getLastBreakpointValue(
				alignment,
				'alignment',
				breakpoint
			)}
			options={getOptions()}
			onChange={val => {
				alignment[breakpoint].alignment = val;
				onChange(alignment);
			}}
		/>
	);
};

export default AlignmentControl;
