/**
 * Wordpress dependencies
 */
const { RadioControl } = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../../extensions/styles';

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
		type,
		isHover = false,
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

	const classes = classnames(
		'maxi-alignment-control',
		isEmpty(label) ? 'maxi-alignment-control__no-label' : '',
		className
	);

	return (
		<RadioControl
			label={label}
			className={classes}
			selected={getLastBreakpointAttribute(
				type === 'text' ? 'text-alignment' : 'alignment',
				breakpoint,
				props,
				isHover
			)}
			options={getOptions()}
			onChange={val =>
				onChange(
					type === 'text'
						? {
								[`text-alignment-${breakpoint}${
									isHover ? '-hover' : ''
								}`]: val,
						  }
						: {
								[`alignment-${breakpoint}${
									isHover ? '-hover' : ''
								}`]: val,
						  }
				)
			}
		/>
	);
};

export default AlignmentControl;
