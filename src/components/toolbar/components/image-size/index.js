/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const {
    Icon,
    Dropdown,
    Button,
    SelectControl,
    RangeControl
} = wp.components;
const {
    useSelect,
    useDispatch,
} = wp.data;

/**
 * Internal dependencies
 */
import { getDefaultProp } from '../../../../extensions/styles/utils';

/**
 * External dependencies
 */
import {
    capitalize,
    isNil
} from 'lodash';

/**
 * Icons
 */
import { toolbarSettings } from '../../../../icons';

/**
 * ImageSize
 */
const ImageSize = props => {
    const {
        clientId,
        blockName
    } = props;

    if (blockName != 'maxi-blocks/image-maxi')
        return null;

    const { size, width, imageData, fullWidth, isFirstOnHierarchy } = useSelect(
        select => {
            const { getBlockAttributes } = select(
                'core/block-editor',
            );
            const { getMedia } = select(
                'core'
            )
            const attributes = getBlockAttributes(clientId);
            const mediaID = attributes ? attributes.mediaID : null;
            return {
                size: attributes ? attributes.size : null,
                width: attributes ? attributes.width : null,
                imageData: mediaID ? getMedia(mediaID) : null,
                fullWidth: attributes ? attributes.fullWidth : null,
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

    const getSizeOptions = () => {
        let response = [];
        if (imageData) {
            let sizes = imageData.media_details.sizes;
            sizes = Object.entries(sizes).sort((a, b) => {
                return a[1].width - b[1].width;
            })
            sizes.map(size => {
                const name = capitalize(size[0]);
                const val = size[1];
                response.push({
                    label: `${name} - ${val.width}x${val.height}`,
                    value: size[0]
                })
            })
        }
        response.push({
            label: 'Custom', value: 'custom'
        });
        return response;
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
                    className='toolbar-item__text-options'
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
                        <SelectControl
                            label={__('Image Size', 'maxi-blocks')}
                            value={size || size == 'custom' ? size : 'full'} // is still necessary?
                            options={getSizeOptions()}
                            onChange={size => updateBlockAttributes(
                                clientId,
                                { size }
                            )}
                        />
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
                        <RangeControl
                            label={__('Width', 'maxi-blocks')}
                            value={width}
                            onChange={width => {
                                if (isNil(width))
                                    updateBlockAttributes(
                                        clientId,
                                        { width: getDefaultProp(clientId, 'width') }
                                    )
                                else
                                    updateBlockAttributes(
                                        clientId,
                                        { width }
                                    )
                            }}
                            allowReset
                        />
                        <div
                            className='toolbar-item__popover__dropdown-options'
                        >
                            <Button
                                className='toolbar-item__popover__dropdown-options__button'
                                onClick={() =>
                                    openGeneralSidebar('edit-post/block')
                                        .then(() => onEditImageClick('sizing'))
                                }
                            >
                                Edit Image
                            </Button>
                            <Button
                                className='toolbar-item__popover__dropdown-options__button'
                                onClick={() =>
                                    openGeneralSidebar('edit-post/block')
                                        .then(() => onEditImageClick('caption'))
                                }
                            >
                                Add Caption
                            </Button>
                        </div>
                    </Fragment>
                )
            }
        />
    )
}

export default ImageSize;