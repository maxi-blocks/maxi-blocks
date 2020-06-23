/**
 * External dependencies
 */
import classnames from 'classnames';

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

    const onEditImageClick = item => {
        const sidebar = document.querySelector('.maxi-sidebar');
        const wrapperElement = document.querySelector(`.maxi-accordion-control__item[data-name="${item}"]`);
        const button = wrapperElement.querySelector('.maxi-accordion-control__item__button');
        const content = wrapperElement.querySelector('.maxi-accordion-control__item__panel');

        Array.from(document.getElementsByClassName('maxi-accordion-control__item__button')).map(el => {
            if (el.getAttribute('aria-expanded'))
                el.setAttribute('aria-expanded', false)
        })
        Array.from(document.getElementsByClassName('maxi-accordion-control__item__panel')).map(el => {
            if (!el.getAttribute('hidden'))
                el.setAttribute('hidden', '')
        })

        button.setAttribute('aria-expanded', true)
        content.removeAttribute('hidden');

        sidebar.scroll({
            top: wrapperElement.getBoundingClientRect().top,
            behavior: 'smooth'
        })
    }

    const classes = classnames(
        'toolbar-item__popover__toggle-btn',
    );

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
                                    .then(() => onEditImageClick('width height'))
                            }
                        />
                    </div>
                    {
                        isFirstOnHierarchy &&
                        <RadioControl
                            className={classes}
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
                        unit={value.general.widthUnit}
                        onChangeUnit={val => {
                            value.general.widthUnit = val;
                            updateSize();
                        }}
                        value={value.general.width}
                        onChangeValue={val => {
                            value.general.width = val;
                            updateSize();
                        }}
                    />
                    <SizeControl
                        label={__('Max Width', 'maxi-blocks')}
                        unit={value.general['max-widthUnit']}
                        onChangeUnit={val => {
                            value.general['max-widthUnit'] = val;
                            updateSize();
                        }}
                        value={value.general['max-width']}
                        onChangeValue={val => {
                            value.general['max-width'] = val;
                            updateSize();
                        }}
                    />
                </Fragment>
            )}
        />
    )
}

export default Size;