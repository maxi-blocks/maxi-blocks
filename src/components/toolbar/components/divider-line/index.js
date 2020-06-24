/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { RadioControl } = wp.components;
const { Fragment } = wp.element;

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
        lineOrientation,
        onChange
    } = props;

    if (blockName != 'maxi-blocks/divider-maxi')
        return null;

    const classes = classnames(
        'toolbar-item__popover__toggle-btn',
    );

    return (
        <ToolbarPopover
            className='toolbar-item__divider'
            icon={toolbarDividersetting}
            content={(
                <Fragment>
                    <RadioControl
                        className={classes}
                        label={__('Show Line', 'maxi-blocks')}
                        selected={showLine}
                        options={[
                            { label: __('No', 'maxi-blocks'), value: 'no' },
                            { label: __('Yes', 'maxi-blocks'), value: 'yes' },
                        ]}
                        onChange={showLine =>
                            onChange(
                                showLine,
                                divider,
                            )
                        }
                    />
                    {
                        showLine === 'yes' &&
                        <Fragment>
                            <__experimentalDividerControl
                                disableColor
                                disableLineStyle
                                disableBorderRadius
                                dividerOptions={divider}
                                onChange={divider => {
                                    onChange(
                                        showLine,
                                        divider,
                                    )
                                }}
                                lineOrientation={lineOrientation}
                            />
                        </Fragment>
                    }
                </Fragment>
            )}
        />
    )
}

export default Divider;