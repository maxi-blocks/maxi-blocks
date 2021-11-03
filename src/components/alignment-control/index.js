/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../../extensions/styles';
import ButtonGroupControl from '../button-group-control';
import Icon from '../icon';

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
		const options = [];

		!disableLeft &&
			options.push({
				label: <Icon icon={alignLeft} />,
				value: 'left',
			});

		!disableCenter &&
			options.push({
				label: <Icon icon={alignCenter} />,
				value: 'center',
			});

		!disableRight &&
			options.push({
				label: <Icon icon={alignRight} />,
				value: 'right',
			});

		!disableJustify &&
			options.push({
				label: <Icon icon={alignJustify} />,
				value: 'justify',
			});

		return options;
	};

	const classes = classnames(
		'maxi-alignment-control',
		isEmpty(label) ? 'maxi-alignment-control__no-label' : '',
		className
	);

	return (
		<ButtonGroupControl
			label={label}
			className={classes}
			selected={
				getLastBreakpointAttribute(
					type === 'text' ? 'text-alignment' : 'alignment',
					breakpoint,
					props,
					isHover
				) || getOptions()[0].value
			}
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
