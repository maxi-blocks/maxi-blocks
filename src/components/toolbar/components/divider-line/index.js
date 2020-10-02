/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import __experimentalDividerControl from '../../../divider-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

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
			advancedOptions='line'
			content={
				<Fragment>
					<__experimentalDividerControl
						divider={divider}
						defaultDivider={defaultDivider}
						onChange={divider => {
							onChange(divider);
						}}
						lineOrientation={lineOrientation}
						disableColor
						disableLineStyle
						disableBorderRadius
					/>
				</Fragment>
			}
		/>
	);
};

export default Divider;
