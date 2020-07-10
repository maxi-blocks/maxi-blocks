/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { useDispatch } = wp.data;
const {
    RadioControl,
    IconButton,
} = wp.components;

/**
 * Internal dependencies
 */
import SizeControl from '../../../size-control';
import ToolbarPopover from '../toolbar-popover';
import openSidebar from '../../../../extensions/dom';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Icons
 */
import {
    toolbarSizing,
    toolbarAdvancedSettings,
} from '../../../../icons';

/**
 * Size
 */
const Size = props => {
    const {
        blockName,
        fullWidth,
        onChangeFullWidth,
        size,
        onChangeSize,
        isFirstOnHierarchy,
        breakpoint
    } = props;

    if (blockName === 'maxi-blocks/image-maxi')
        return null;

    const { openGeneralSidebar } = useDispatch(
        'core/edit-post'
    );

    let value = !isObject(size) ?
        JSON.parse(size) :
        size;

    return (
        <ToolbarPopover
            className='toolbar-item__size'
            icon={ toolbarSizing }
            content={(
                <Fragment>
                    <div
                        className='toolbar-item__popover__dropdown-options'
                    >
                        <IconButton
                            className='toolbar-item__popover__dropdown-options__advanced-button'
                            icon={toolbarAdvancedSettings}
                            onClick={() =>
                                openGeneralSidebar('edit-post/block')
                                    .then(() => openSidebar('width height'))
                            }
                        />
                    </div>
                    {
                        isFirstOnHierarchy &&
                        <RadioControl
                            className='toolbar-item__popover__toggle-btn'
                            label={__('Full Width', 'maxi-blocks')}
                            selected={fullWidth}
                            options={[
                                { label: __('No', 'maxi-blocks'), value: 'normal' },
                                { label: __('Yes', 'maxi-blocks'), value: 'full' }
                            ]}
                            onChange={fullWidth => onChangeFullWidth( fullWidth )}
                        />
                    }
                    <SizeControl
                        label={__('Width', 'maxi-blocks')}
                        unit={value[breakpoint].widthUnit}
                        onChangeUnit={val => {
                            value[breakpoint].widthUnit = val;
                            onChangeSize(JSON.stringify(value));
                        }}
                        value={value[breakpoint].width}
                        onChangeValue={val => {
                            value[breakpoint].width = val;
                            onChangeSize(JSON.stringify(value));
                        }}
                    />
                    <SizeControl
                        label={__('Max Width', 'maxi-blocks')}
                        unit={value[breakpoint]['max-widthUnit']}
                        onChangeUnit={val => {
                            value[breakpoint]['max-widthUnit'] = val;
                            onChangeSize(JSON.stringify(value));
                        }}
                        value={value[breakpoint]['max-width']}
                        onChangeValue={val => {
                            value[breakpoint]['max-width'] = val;
                            onChangeSize(JSON.stringify(value));
                        }}
                    />
                </Fragment>
            )}
        />
    )
}

export default Size;