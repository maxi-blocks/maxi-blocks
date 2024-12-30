/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '@extensions/styles';
import SettingTabsControl from '@components/setting-tabs-control';
import Icon from '@components/icon';
import withRTC from '@extensions/maxi-block/withRTC';

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
} from '@maxi-icons';

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
		showLabel = false,
		breakpoint = 'general',
		type = '',
		isHover = false,
		isToolbar = false,
		prefix = '',
	} = props;
	const getOptions = () => {
		const options = [];

		!disableLeft &&
			options.push({
				icon: <Icon icon={isToolbar ? toolbarAlignLeft : alignLeft} />,
				value: 'left',
			});

		!disableCenter &&
			options.push({
				icon: (
					<Icon icon={isToolbar ? toolbarAlignCenter : alignCenter} />
				),
				value: 'center',
			});

		!disableRight &&
			options.push({
				icon: (
					<Icon icon={isToolbar ? toolbarAlignRight : alignRight} />
				),
				value: 'right',
			});

		!disableJustify &&
			options.push({
				icon: (
					<Icon
						icon={isToolbar ? toolbarAlignJustify : alignJustify}
					/>
				),
				value: 'justify',
			});

		return options;
	};

	const classes = classnames(
		'maxi-alignment-control',
		isEmpty(label) ? 'maxi-alignment-control__no-label' : '',
		className
	);

	const target = `${prefix}${type === 'text' ? 'text-' : ''}alignment`;
	return (
		<>
			{showLabel && (
				<label
					className='maxi-base-control__label'
					htmlFor={`${label}-alignment`}
				>
					{`${label} alignment`}
				</label>
			)}
			<SettingTabsControl
				type='buttons'
				fullWidthMode
				className={classes}
				hasBorder
				items={getOptions()}
				selected={
					getLastBreakpointAttribute({
						target,
						breakpoint,
						attributes: props,
						isHover,
					}) || getOptions()[0].value
				}
				onChange={val =>
					onChange({
						[`${target}-${breakpoint}${isHover ? '-hover' : ''}`]:
							val,
					})
				}
			/>
		</>
	);
};

export default withRTC(AlignmentControl);
