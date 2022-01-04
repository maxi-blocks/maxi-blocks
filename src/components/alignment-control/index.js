/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../../extensions/styles';
import SettingTabsControl from '../setting-tabs-control';
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
				icon: <Icon icon={alignLeft} />,
				value: 'left',
			});

		!disableCenter &&
			options.push({
				icon: <Icon icon={alignCenter} />,
				value: 'center',
			});

		!disableRight &&
			options.push({
				icon: <Icon icon={alignRight} />,
				value: 'right',
			});

		!disableJustify &&
			options.push({
				icon: <Icon icon={alignJustify} />,
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
		<SettingTabsControl
			type='buttons'
			disablePadding
			className={classes}
			items={getOptions()}
			selected={
				getLastBreakpointAttribute(
					type === 'text' ? 'text-alignment' : 'alignment',
					breakpoint,
					props,
					isHover
				) || getOptions()[0].value
			}
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
