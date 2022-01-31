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
import {
	alignLeft,
	alignCenter,
	alignRight,
	alignJustify,
	toolbarAlignCenter,
	toolbarAlignLeft,
	toolbarAlignRight,
	toolbarAlignJustify,
} from '../../icons';

/**
 * Component
 */
const AlignmentControl = props => {
	const {
		className,
		onChange,
		label = '',
		disableIcon = false,
		disableLeft = false,
		disableCenter = false,
		disableRight = false,
		disableJustify = false,
		breakpoint = 'general',
		type = '',
		isHover = false,
		isToolbar = false,
	} = props;

	const getOptions = () => {
		const options = [];

		if (disableIcon) {
			!disableLeft &&
				options.push({
					label: 'Left',
					value: 'left',
				});

			!disableCenter &&
				options.push({
					label: 'Center',
					value: 'center',
				});

			!disableRight &&
				options.push({
					label: 'Right',
					value: 'right',
				});

			!disableJustify &&
				options.push({
					label: 'Justify',
					value: 'justify',
				});
		} else {
			!disableLeft &&
				options.push({
					icon: !isToolbar ? (
						<Icon icon={alignLeft} />
					) : (
						<Icon icon={toolbarAlignLeft} />
					),
					value: 'left',
				});

			!disableCenter &&
				options.push({
					icon: !isToolbar ? (
						<Icon icon={alignCenter} />
					) : (
						<Icon icon={toolbarAlignCenter} />
					),
					value: 'center',
				});

			!disableRight &&
				options.push({
					icon: !isToolbar ? (
						<Icon icon={alignRight} />
					) : (
						<Icon icon={toolbarAlignRight} />
					),
					value: 'right',
				});

			!disableJustify &&
				options.push({
					icon: !isToolbar ? (
						<Icon icon={alignJustify} />
					) : (
						<Icon icon={toolbarAlignJustify} />
					),
					value: 'justify',
				});
		}

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
			fullWidthMode
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
