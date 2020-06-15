/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const {
    Icon,
    Dropdown,
    Button,
    SelectControl,
} = wp.components;
const {
    useSelect,
    useDispatch,
} = wp.data;

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Internal dependencies
 */
import SizeControl from '../../../size-control';

/**
 * Icons
 */
import { toolbarSettings } from '../../../../icons';

/**
 * Size
 */
const Size = props => {
    const {
        clientId,
        blockName
    } = props;

    if (blockName === 'maxi-blocks/image-maxi')
        return null;

    const { fullWidth, size, isFirstOnHierarchy } = useSelect(
        select => {
            const { getBlockAttributes } = select(
                'core/block-editor',
            );
            const attributes = getBlockAttributes(clientId);
            return {
                fullWidth: attributes ? attributes.fullWidth : null,
                size: attributes ? attributes.size : null,
                isFirstOnHierarchy: attributes ? attributes.isFirstOnHierarchy : null,
            };
        },
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    const { openGeneralSidebar } = useDispatch(
        'core/edit-post'
    );

    let value = typeof size != 'object' ?
        JSON.parse(size) :
        size;

    const updateSize = () => {
        updateBlockAttributes(
            clientId,
            { size: JSON.stringify(value) }
        )
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

        if (item === 'sizing')
            updateBlockAttributes(
                clientId,
                { size: 'custom' }
            )

        if (item === 'caption')
            updateBlockAttributes(
                clientId,
                { captionType: 'custom' }
            )
    }

    return (
        <Dropdown
            className='toolbar-item toolbar-item__dropdown'
            renderToggle={({ isOpen, onToggle }) => (
                <Button
                    className='toolbar-item__size'
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    action="popup"
                >
                    <Icon
                        className='toolbar-item__icon'
                        icon={toolbarSettings}
                    />
                </Button>
            )}
            popoverProps={
                {
                    className: 'toolbar-item__popover',
                    noArrow: false,
                    position: 'center'
                }
            }
            renderContent={
                () => (
                    <Fragment>
                        {
                            isFirstOnHierarchy &&
                            <SelectControl
                                label={__('Fullwidth', 'maxi-blocks')}
                                value={fullWidth}
                                options={[
                                    { label: __('No', 'maxi-blocks'), value: 'normal' },
                                    { label: __('Yes', 'maxi-blocks'), value: 'full' }
                                ]}
                                onChange={fullWidth => updateBlockAttributes(
                                    clientId,
                                    { fullWidth }
                                )}
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
                        <div
                            className='toolbar-item__popover__dropdown-options'
                        >
                            <Button
                                className='toolbar-item__popover__dropdown-options__button'
                                onClick={() =>
                                    openGeneralSidebar('edit-post/block')
                                        .then(() => onEditImageClick('width height'))
                                }
                            >
                                Advanced Settings
                            </Button>
                        </div>
                    </Fragment>
                )
            }
        />
    )
}

export default Size;