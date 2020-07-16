/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { useDispatch } = wp.data;
const { RadioControl } = wp.components;

/**
 * Internal dependencies
 */
import SizeControl from '../../../size-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Icons
 */
import { toolbarSizing } from '../../../../icons';

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

    if (blockName === 'maxi-blocks/image-maxi' || blockName === 'maxi-blocks/divider-maxi')
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
            tooltip={__('Size', 'maxi-blocks')}
            icon={toolbarSizing}
            advancedoptions='width height'
            content={(
                <Fragment>
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
                            onChange={fullWidth => onChangeFullWidth(fullWidth)}
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