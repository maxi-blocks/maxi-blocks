/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const {
    Icon,
    Dropdown,
    Button,
    SelectControl
} = wp.components;
const {
    useSelect,
    useDispatch,
} = wp.data;

/**
 * Internal dependencies
 */
import ImageCropControl from '../../../image-crop-control';
import SizeControl from '../../../size-control';

/**
 * External dependencies
 */
import { capitalize } from 'lodash';

/**
 * Icons
 */
import { toolbarSettings } from '../../../../icons';

/**
 * ImageSize
 */
const ImageSize = props => {
    const { clientId } = props;

    const {
        blockName,
        mediaID,
        size,
        cropOptions,
        widthUnit,
        width,
        maxWidthUnit,
        maxWidth,
        imageData
    } = useSelect(
        (select) => {
            const { getBlockName, getBlockAttributes } = select(
                'core/block-editor',
            );
            const { getMedia } = select(
                'core'
            )
            const mediaID = getBlockAttributes(clientId).mediaID;
            return {
                blockName: getBlockName(clientId),
                mediaID,
                size: getBlockAttributes(clientId).size,
                cropOptions: getBlockAttributes(clientId).cropOptions,
                widthUnit: getBlockAttributes(clientId).widthUnit,
                width: getBlockAttributes(clientId).width,
                maxWidth: getBlockAttributes(clientId).maxWidth,
                maxWidthUnit: getBlockAttributes(clientId).maxWidthUnit,
                imageData: getMedia(mediaID)
            };
        },
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    if (blockName.name != 'maxi-blocks/image-maxi')
        return null;

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
                            size === 'custom' &&
                            <ImageCropControl
                                mediaID={mediaID}
                                cropOptions={JSON.parse(cropOptions)}
                                onChange={cropOptions => updateBlockAttributes(
                                    clientId,
                                    {
                                        cropOptions: JSON.stringify(cropOptions)
                                    }
                                )}
                            />
                        }
                        <SizeControl
                            label={__('Width', 'maxi-blocks')}
                            unit={widthUnit}
                            onChangeUnit={widthUnit => updateBlockAttributes(
                                clientId,
                                { widthUnit }
                            )}
                            value={width}
                            onChangeValue={width => updateBlockAttributes(
                                clientId,
                                { width }
                            )}
                        />
                        <SizeControl
                            label={__('Max Width', 'maxi-blocks')}
                            unit={maxWidthUnit}
                            onChangeUnit={maxWidthUnit => updateBlockAttributes(
                                clientId,
                                { maxWidthUnit }
                            )}
                            value={maxWidth}
                            onChangeValue={maxWidth => updateBlockAttributes(
                                clientId,
                                { maxWidth }
                            )}
                        />
                    </Fragment>
                )
            }
        >
        </Dropdown>
    )
}

export default ImageSize;