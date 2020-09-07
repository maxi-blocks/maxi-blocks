/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RadioControl } = wp.components;
const { Fragment } = wp.element;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import __experimentalDividerControl from '../../../divider-control';

/**
 * Icons
 */
import { toolbarDividersetting } from '../../../../icons';

/**
 * Divider
 */

const Divider = props => {
	const {
		blockName,
		showLine,
		divider,
		defaultDivider,
		lineOrientation,
		onChange,
	} = props;

	if (blockName !== 'maxi-blocks/divider-maxi') return null;

	const classes = classnames('toolbar-item__popover__toggle-btn');

	return (
		<ToolbarPopover
			className='toolbar-item__divider'
			tooltip={__('Divider', 'maxi-blocks')}
			icon={toolbarDividersetting}
			content={
				<Fragment>
					<RadioControl
						className={classes}
						label={__('Show Line', 'maxi-blocks')}
						selected={showLine}
						options={[
							{ label: __('No', 'maxi-blocks'), value: 'no' },
							{ label: __('Yes', 'maxi-blocks'), value: 'yes' },
						]}
						onChange={showLine => onChange(showLine, divider)}
					/>
					{!!showLine && (
						<Fragment>
							<__experimentalDividerControl
								divider={divider}
								defaultDivider={defaultDivider}
								onChange={divider => {
									onChange(showLine, divider);
								}}
								lineOrientation={lineOrientation}
								disableColor
								disableLineStyle
								disableBorderRadius
							/>
						</Fragment>
					)}
				</Fragment>
			}
		/>
	);
};

export default Divider;
