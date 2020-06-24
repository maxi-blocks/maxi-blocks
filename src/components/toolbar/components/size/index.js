/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    RadioControl,
    IconButton,
} = wp.components;
const { useDispatch } = wp.data;
import openSidebar from '../../../../extensions/dom';

/**
 * Internal dependencies
 */
import SizeControl from '../../../size-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * Icons
 */
import {
    toolbarSettings,
    toolbarDividerWidth,
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
    } = props;

    if (blockName === 'maxi-blocks/image-maxi')
        return null;

    const { openGeneralSidebar } = useDispatch(
        'core/edit-post'
    );

    let value = typeof size != 'object' ?
        JSON.parse(size) :
        size;

    if(!value)
        return null;

    const updateSize = () => {
        onChangeSize(JSON.stringify(value))
    }

    return (
        <ToolbarPopover
            className='toolbar-item__size'
            icon={ ( (blockName === 'maxi-blocks/divider-maxi') ) ? toolbarDividerWidth : toolbarSettings }
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
                            label={__('Fullwidth', 'maxi-blocks')}
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
                        unit={value.desktop.widthUnit}
                        onChangeUnit={val => {
                            value.desktop.widthUnit = val;
                            updateSize();
                        }}
                        value={value.desktop.width}
                        onChangeValue={val => {
                            value.desktop.width = val;
                            updateSize();
                        }}
                    />
                    <SizeControl
                        label={__('Max Width', 'maxi-blocks')}
                        unit={value.desktop['max-widthUnit']}
                        onChangeUnit={val => {
                            value.desktop['max-widthUnit'] = val;
                            updateSize();
                        }}
                        value={value.desktop['max-width']}
                        onChangeValue={val => {
                            value.desktop['max-width'] = val;
                            updateSize();
                        }}
                    />
                </Fragment>
            )}
        />
    )
}

export default Size;