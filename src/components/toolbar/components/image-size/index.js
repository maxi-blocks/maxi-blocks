/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const { __ } = wp.i18n;
const { Button, SelectControl, RangeControl } = wp.components;
const { useSelect, useDispatch } = wp.data;

/**
 * Internal dependencies
 */
import { getDefaultProp } from '../../../../utils';
import ToolbarPopover from '../toolbar-popover';
import openSidebar from '../../../../extensions/dom';

/**
 * External dependencies
 */
import { capitalize, isNil, isObject, trim } from 'lodash';

/**
 * Icons
 */
import { toolbarSizing } from '../../../../icons';

/**
 * ImageSize
 */
const ImageSize = props => {
    const {
        blockName,
        size,
        defaultSize,
        onChangeSize,
        imageSize,
        onChangeImageSize,
        mediaID,
        fullWidth,
        onChangeFullWidth,
        isFirstOnHierarchy,
    } = props;

    const sizeValue = !isObject(size) ? JSON.parse(size) : size;

    const defaultSizeValue = !isObject(defaultSize)
        ? JSON.parse(defaultSize)
        : defaultSize;

    if (blockName !== 'maxi-blocks/image-maxi') return null;

    const { imageData } = useSelect(select => {
        const { getMedia } = select('core');
        return {
            imageData: getMedia(mediaID),
        };
    });

    const { openGeneralSidebar } = useDispatch('core/edit-post');

    const getImageSizeOptions = () => {
        const response = [];
        if (imageData) {
            let { sizes } = imageData.media_details;
            sizes = Object.entries(sizes).sort((a, b) => {
                return a[1].width - b[1].width;
            });
            sizes.map(size => {
                const name = capitalize(size[0]);
                const val = size[1];
                response.push({
                    label: `${name} - ${val.width}x${val.height}`,
                    value: size[0],
                });
            });
        }
        response.push({
            label: 'Custom',
            value: 'custom',
        });
        return response;
    };

    return (
        <ToolbarPopover
            className='toolbar-item__image-size'
            tooltip={__('Image size', 'maxi-blocks')}
            icon={toolbarSizing}
            content={
                <Fragment>
                    <SelectControl
                        label={__('Image Size', 'maxi-blocks')}
                        value={
                            imageSize || imageSize == 'custom'
                                ? imageSize
                                : 'full'
                        } // is still necessary?
                        options={getImageSizeOptions()}
                        onChange={imageSize => onChangeImageSize(imageSize)}
                    />
                    {isFirstOnHierarchy && (
                        <SelectControl
                            label={__('Full Width', 'maxi-blocks')}
                            value={fullWidth}
                            options={[
                                {
                                    label: __('No', 'maxi-blocks'),
                                    value: 'normal',
                                },
                                {
                                    label: __('Yes', 'maxi-blocks'),
                                    value: 'full',
                                },
                            ]}
                            onChange={fullWidth => onChangeFullWidth(fullWidth)}
                        />
                    )}
                    <RangeControl
                        label={__('Width', 'maxi-blocks')}
                        value={Number(trim(sizeValue.general.width))}
                        onChange={width => {
                            isNil(width)
                                ? (sizeValue.general.width =
                                      defaultSizeValue.general.width)
                                : (sizeValue.general.width = width);

                            onChangeSize(JSON.stringify(sizeValue));
                        }}
                        allowReset
                        // initialPosition={}
                    />
                    <div className='toolbar-item__popover__dropdown-options'>
                        <Button
                            className='toolbar-item__popover__dropdown-options__button'
                            onClick={() =>
                                openGeneralSidebar('edit-post/block').then(() =>
                                    openSidebar('width height')
                                )
                            }
                        >
                            Edit Image
                        </Button>
                        <Button
                            className='toolbar-item__popover__dropdown-options__button'
                            onClick={() =>
                                openGeneralSidebar('edit-post/block').then(() =>
                                    openSidebar('caption')
                                )
                            }
                        >
                            Add Caption
                        </Button>
                    </div>
                </Fragment>
            }
        />
    );
};

export default ImageSize;
