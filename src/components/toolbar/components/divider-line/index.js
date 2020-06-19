/**
 * WordPress dependencies
 */
const { SelectControl } = wp.components;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import SettingTabsControl from '../../../setting-tabs-control';
import __experimentalDividerControl from '../../../divider-control';

/**
 * Icons
 */
import { toolbarDropShadow } from '../../../../icons';

/**
 * Divider
 */

const Divider = props => {
    const {
        blockName,
        showLine,
        divider1,
        divider2,
        lineOrientation,
        onChange
    } = props;

    if (blockName != 'maxi-blocks/divider-maxi')
        return null;

    return (
        <ToolbarPopover
            className='toolbar-item__divider'
            icon={toolbarDropShadow}
            content={(
                <Fragment>
                    <SelectControl
                        label={__('Show Line', 'maxi-blocks')}
                        options={[
                            { label: __('No', 'maxi-blocks'), value: 'no' },
                            { label: __('Yes', 'maxi-blocks'), value: 'yes' },
                        ]}
                        value={showLine}
                        onChange={showLine => 
                            onChange(
                                showLine,
                                divider1,
                                divider2,
                            )
                        }
                    />
                    {
                        showLine === 'yes' &&
                        <Fragment>
                            <SettingTabsControl
                                disablePadding
                                items={[
                                    {
                                        label: __('Line 1', 'maxi-blocks'),
                                        content: (
                                            <__experimentalDividerControl
                                                dividerOptions={divider1}
                                                onChange={divider1 => {
                                                    onChange(
                                                        showLine,
                                                        divider1,
                                                        divider2,
                                                    )
                                                }}
                                                lineOrientation={lineOrientation}
                                            />
                                        )
                                    },
                                    {
                                        label: __('Line 2', 'maxi-blocks'),
                                        content: (
                                            <__experimentalDividerControl
                                                dividerOptions={divider2}
                                                onChange={divider2 => onChange(
                                                    showLine,
                                                    divider1,
                                                    divider2,
                                                )}
                                                lineOrientation={lineOrientation}
                                            />
                                        )
                                    },
                                ]}
                            />
                        </Fragment>
                    }
                </Fragment>
            )}
        />
    )
}

export default Divider;