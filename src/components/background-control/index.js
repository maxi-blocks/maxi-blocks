/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, useState } = wp.element;
const { SelectControl, RadioControl, Button, Icon } = wp.components;

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import GradientControl from '../gradient-control';
import MediaUploaderControl from '../media-uploader-control';
import ImageCropControl from '../image-crop-control';
import SettingTabsControl from '../setting-tabs-control';
import SizeControl from '../size-control';
import __experimentalClipPath from '../clip-path-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNil, isObject, isNumber, pullAt } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import {
    backgroundColor,
    backgroundImage,
    backgroundVideo,
    backgroundGradient,
} from '../../icons';

/**
 * Components
 */
const BackgroundControl = props => {
    const {
        className,
        background,
        defaultBackground,
        disableImage = false,
        disableVideo = false,
        disableGradient = false,
        disableColor = false,
        disableClipPath = false,
        onChange,
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const [selector, setSelector] = useState(0);
    const [backgroundItems, setBackgroundItems] = useState('color');

    const value = !isObject(background) ? JSON.parse(background) : background;

    const defaultValue = !isObject(defaultBackground)
        ? JSON.parse(defaultBackground)
        : defaultBackground;

    const classes = classnames(
        'maxi-background-control',
        className,
        isOpen ? 'maxi-background-control__open' : null
    );

    const onAddBackground = () => {
        value.backgroundOptions.push(defaultValue.backgroundOptions[0]);
    };

    const onOpenOptions = (e, i) => {
        e.stopPropagation();
        setIsOpen(true);
        setSelector(i);
    };

    const onRemoveImage = () => {
        pullAt(value.backgroundOptions, selector);
        onChange(JSON.stringify(value));
        onDoneEdition();
    };

    const onDoneEdition = () => {
        setIsOpen(false);
        setSelector(0);
    };

    const getAlternativeImage = i => {
        if (isNil(value.backgroundOptions[i].imageOptions.cropOptions)) return;
        if (
            isEmpty(
                value.backgroundOptions[i].imageOptions.cropOptions.image
                    .source_url
            )
        )
            return;
        return {
            source_url:
                value.backgroundOptions[i].imageOptions.cropOptions.image
                    .source_url,
            width:
                value.backgroundOptions[i].imageOptions.cropOptions.image.width,
            height:
                value.backgroundOptions[i].imageOptions.cropOptions.image
                    .height,
        };
    };

    const getOptions = () => {
        const options = [];
        !disableColor &&
            options.push({
                label: <Icon icon={backgroundColor} />,
                value: 'color',
            });
        !disableImage &&
            options.push({
                label: <Icon icon={backgroundImage} />,
                value: 'image',
            });
        !disableVideo &&
            options.push({
                label: <Icon icon={backgroundVideo} />,
                value: 'video',
            });
        !disableGradient &&
            options.push({
                label: <Icon icon={backgroundGradient()} />,
                value: 'gradient',
            });

        return options;
    };

    return (
        <div className={classes}>
            {getOptions().length > 1 && (
                <div className='maxi-fancy-radio-control'>
                    <RadioControl
                        label={__('Background')}
                        selected={backgroundItems}
                        options={getOptions()}
                        onChange={value => setBackgroundItems(value)}
                    />
                </div>
            )}
            {!isOpen && (
                <Fragment>
                    {!disableVideo && backgroundItems === 'video' && (
                        <div className='maxi-background-control__video'>
                            <MediaUploaderControl
                                allowedTypes={['video']}
                                mediaType='video'
                                mediaID={value.videoOptions.mediaID}
                                onSelectImage={videoData => {
                                    value.videoOptions.mediaID = videoData.id;
                                    value.videoOptions.mediaURL = videoData.url;
                                    onChange(JSON.stringify(value));
                                }}
                                onRemoveImage={() => {
                                    value.videoOptions.mediaID = '';
                                    value.videoOptions.mediaURL = '';
                                    onChange(JSON.stringify(value));
                                }}
                                placeholder={__('Set Video', 'maxi-blocks')}
                                replaceButton={__(
                                    'Replace Video',
                                    'maxi-blocks'
                                )}
                                removeButton={__('Remove Video', 'maxi-blocks')}
                            />
                            {value.videoOptions.mediaURL && (
                                <Fragment>
                                    <SizeControl
                                        label={__('Width', 'maxi-blocks')}
                                        unit={value.videoOptions.widthUnit}
                                        defaultUnit={
                                            defaultValue.videoOptions.widthUnit
                                        }
                                        onChangeUnit={val => {
                                            value.videoOptions.widthUnit = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                        value={value.videoOptions.width}
                                        defaultValue={
                                            defaultValue.videoOptions.width
                                        }
                                        onChangeValue={val => {
                                            value.videoOptions.width = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                    />
                                    <SizeControl
                                        label={__('Height', 'maxi-blocks')}
                                        unit={value.videoOptions.heightUnit}
                                        defaultUnit={
                                            defaultValue.videoOptions.heightUnit
                                        }
                                        onChangeUnit={val => {
                                            value.videoOptions.heightUnit = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                        value={value.videoOptions.height}
                                        defaultValue={
                                            defaultValue.videoOptions.height
                                        }
                                        onChangeValue={val => {
                                            value.videoOptions.height = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                    />
                                    <SelectControl
                                        label={__('Fill', 'maxi-blocks')}
                                        value={value.videoOptions.fill}
                                        options={[
                                            { label: 'Cover', value: 'cover' },
                                            {
                                                label: 'Contain',
                                                value: 'contain',
                                            },
                                            { label: 'Fill', value: 'fill' },
                                            {
                                                label: 'Scale-down',
                                                value: 'scale-down',
                                            },
                                            { label: 'None', value: 'none' },
                                        ]}
                                        onChange={val => {
                                            value.videoOptions.fill = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                    />
                                    <SelectControl
                                        label={__('Position', 'maxi-blocks')}
                                        value={value.videoOptions.position}
                                        options={[
                                            { label: 'Unset', value: 'unset' },
                                            { label: 'Top', value: 'top' },
                                            { label: 'Right', value: 'right' },
                                            {
                                                label: 'Bottom',
                                                value: 'bottom',
                                            },
                                            { label: 'Left', value: 'left' },
                                            {
                                                label: 'Center',
                                                value: 'center',
                                            },
                                        ]}
                                        onChange={val => {
                                            value.videoOptions.position = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                    />
                                    <SelectControl
                                        label={__('Autoplay', 'maxi-blocks')}
                                        value={value.videoOptions.autoplay}
                                        options={[
                                            { label: 'No', value: 0 },
                                            { label: 'Yes', value: 1 },
                                        ]}
                                        onChange={val => {
                                            value.videoOptions.autoplay = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                    />
                                    <SelectControl
                                        label={__(
                                            'Playback Controls',
                                            'maxi-blocks'
                                        )}
                                        value={value.videoOptions.controls}
                                        options={[
                                            { label: 'No', value: 0 },
                                            { label: 'Yes', value: 1 },
                                        ]}
                                        onChange={val => {
                                            value.videoOptions.controls = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                    />
                                    <SelectControl
                                        label={__('Loop', 'maxi-blocks')}
                                        value={value.videoOptions.loop}
                                        options={[
                                            { label: 'No', value: 0 },
                                            { label: 'Yes', value: 1 },
                                        ]}
                                        onChange={val => {
                                            value.videoOptions.loop = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                    />
                                    <SelectControl
                                        label={__('Muted', 'maxi-blocks')}
                                        value={value.videoOptions.muted}
                                        options={[
                                            { label: 'No', value: 0 },
                                            { label: 'Yes', value: 1 },
                                        ]}
                                        onChange={val => {
                                            value.videoOptions.muted = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                    />
                                    <SelectControl
                                        label={__('Preload', 'maxi-blocks')}
                                        value={value.videoOptions.muted}
                                        options={[
                                            {
                                                label: 'MetaData',
                                                value: 'metadata',
                                            },
                                            { label: 'Auto', value: 'auto' },
                                            { label: 'None', value: 'none' },
                                        ]}
                                        onChange={val => {
                                            value.videoOptions.muted = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                    />
                                </Fragment>
                            )}
                        </div>
                    )}
                    {!disableGradient && backgroundItems === 'gradient' && (
                        <GradientControl
                            label={__('Background', 'maxi-blocks')}
                            gradient={value.colorOptions.gradient}
                            defaultGradient={defaultValue.colorOptions.gradient}
                            onChange={val => {
                                value.colorOptions.gradient = val;
                                onChange(JSON.stringify(value));
                            }}
                            gradientAboveBackground={
                                value.colorOptions.gradientAboveBackground
                            }
                            onGradientAboveBackgroundChange={val => {
                                value.colorOptions.gradientAboveBackground = val;
                                onChange(JSON.stringify(value));
                            }}
                        />
                    )}
                    {!disableColor && backgroundItems === 'color' && (
                        <ColorControl
                            label={__('Background', 'maxi-blocks')}
                            color={value.colorOptions.color}
                            defaultColor={defaultValue.colorOptions.color}
                            onChange={val => {
                                value.colorOptions.color = val;
                                onChange(JSON.stringify(value));
                            }}
                        />
                    )}
                    {!disableImage &&
                        backgroundItems === 'image' &&
                        value.backgroundOptions.map((option, i) => {
                            return (
                                <Fragment>
                                    <MediaUploaderControl
                                        mediaID={option.imageOptions.mediaID}
                                        onSelectImage={imageData => {
                                            if (
                                                !isNumber(
                                                    option.imageOptions.mediaID
                                                )
                                            )
                                                onAddBackground();
                                            option.imageOptions.mediaID =
                                                imageData.id;
                                            option.imageOptions.mediaURL =
                                                imageData.url;
                                            onChange(JSON.stringify(value));
                                        }}
                                        onRemoveImage={() => {
                                            option.imageOptions.mediaID = '';
                                            option.imageOptions.mediaURL = '';
                                            onRemoveImage();
                                            onChange(JSON.stringify(value));
                                        }}
                                        placeholder={
                                            value.backgroundOptions.length -
                                                1 ===
                                            0
                                                ? __('Set image', 'maxi-blocks')
                                                : __(
                                                      'Add Another Image',
                                                      'maxi-blocks'
                                                  )
                                        }
                                        extendSelector={
                                            option.imageOptions.mediaID && (
                                                <Button
                                                    isSecondary
                                                    onClick={e =>
                                                        onOpenOptions(e, i)
                                                    }
                                                    className='maxi-background-control__image-edit'
                                                >
                                                    {__(
                                                        'Edit image',
                                                        'maxi-blocks'
                                                    )}
                                                </Button>
                                            )
                                        }
                                        alternativeImage={getAlternativeImage(
                                            i
                                        )}
                                        removeButton={__(
                                            'Remove',
                                            'maxi-blocks'
                                        )}
                                    />
                                </Fragment>
                            );
                        })}
                </Fragment>
            )}
            ,
            {isOpen && backgroundItems === 'image' && (
                <SettingTabsControl
                    items={[
                        {
                            label: __('Image', 'maxi-blocks'),
                            className: 'maxi-background-control__image-tab',
                            uuid: 'maxi-background-control__image-tab',
                            content: (
                                <MediaUploaderControl
                                    mediaID={
                                        value.backgroundOptions[selector]
                                            .imageOptions.mediaID
                                    }
                                    onSelectImage={imageData => {
                                        value.backgroundOptions[
                                            selector
                                        ].imageOptions.mediaID = imageData.id;
                                        value.backgroundOptions[
                                            selector
                                        ].imageOptions.mediaURL = imageData.url;
                                        onChange(JSON.stringify(value));
                                    }}
                                    onRemoveImage={() => {
                                        value.backgroundOptions[
                                            selector
                                        ].imageOptions.mediaID = '';
                                        value.backgroundOptions[
                                            selector
                                        ].imageOptions.mediaURL = '';
                                        onRemoveImage();
                                        onChange(JSON.stringify(value));
                                    }}
                                    extendSelector={
                                        <Button
                                            isSecondary
                                            onClick={onDoneEdition}
                                            className='maxi-background-control__done-edition'
                                        >
                                            {__('Done', 'maxi-blocks')}
                                        </Button>
                                    }
                                    replaceButton={__('Replace', 'maxi-blocks')}
                                    removeButton={__('Delete', 'maxi-blocks')}
                                    alternativeImage={getAlternativeImage(
                                        selector
                                    )}
                                />
                            ),
                        },
                        {
                            label: __('Background', 'maxi-blocks'),
                            className:
                                'maxi-background-control__background-tab',
                            content: (
                                <Fragment>
                                    <SelectControl
                                        label={__(
                                            'Background size',
                                            'maxi-blocks'
                                        )}
                                        value={
                                            value.backgroundOptions[selector]
                                                .sizeSettings.size
                                        }
                                        options={[
                                            { label: 'Auto', value: 'auto' },
                                            { label: 'Cover', value: 'cover' },
                                            {
                                                label: 'Contain',
                                                value: 'contain',
                                            },
                                            {
                                                label: 'Custom',
                                                value: 'custom',
                                            },
                                        ]}
                                        onChange={val => {
                                            value.backgroundOptions[
                                                selector
                                            ].sizeSettings.size = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                    />
                                    {value.backgroundOptions[selector]
                                        .sizeSettings.size === 'custom' && (
                                        <ImageCropControl
                                            mediaID={
                                                value.backgroundOptions[
                                                    selector
                                                ].imageOptions.mediaID
                                            }
                                            cropOptions={
                                                value.backgroundOptions[
                                                    selector
                                                ].imageOptions.cropOptions
                                                    ? value.backgroundOptions[
                                                          selector
                                                      ].imageOptions.cropOptions
                                                    : {}
                                            }
                                            onChange={cropOptions => {
                                                value.backgroundOptions[
                                                    selector
                                                ].imageOptions.cropOptions = cropOptions;
                                                onChange(JSON.stringify(value));
                                            }}
                                        />
                                    )}
                                    <SelectControl
                                        label={__(
                                            'Background repeat',
                                            'maxi-blocks'
                                        )}
                                        value={
                                            value.backgroundOptions[selector]
                                                .repeat
                                        }
                                        options={[
                                            {
                                                label: 'Repeat',
                                                value: 'repeat',
                                            },
                                            {
                                                label: 'No repeat',
                                                value: 'no-repeat',
                                            },
                                            {
                                                label: 'Repeat X',
                                                value: 'repeat-x',
                                            },
                                            {
                                                label: 'Repeat Y',
                                                value: 'repeat-y',
                                            },
                                            { label: 'Space', value: 'space' },
                                            { label: 'Round', value: 'round' },
                                        ]}
                                        onChange={val => {
                                            value.backgroundOptions[
                                                selector
                                            ].repeat = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                    />
                                    <SelectControl
                                        label={__(
                                            'Background position',
                                            'maxi-blocks'
                                        )}
                                        value={
                                            value.backgroundOptions[selector]
                                                .positionOptions.position
                                        }
                                        options={[
                                            {
                                                label: 'Left top',
                                                value: 'left top',
                                            },
                                            {
                                                label: 'Left center',
                                                value: 'left center',
                                            },
                                            {
                                                label: 'Left bottom',
                                                value: 'left bottom',
                                            },
                                            {
                                                label: 'Right top',
                                                value: 'right top',
                                            },
                                            {
                                                label: 'Right center',
                                                value: 'right center',
                                            },
                                            {
                                                label: 'Right bottom',
                                                value: 'right bottom',
                                            },
                                            {
                                                label: 'Center top',
                                                value: 'center top',
                                            },
                                            {
                                                label: 'Center center',
                                                value: 'center center',
                                            },
                                            {
                                                label: 'Center bottom',
                                                value: 'center bottom',
                                            },
                                            {
                                                label: 'Custom',
                                                value: 'custom',
                                            },
                                        ]}
                                        onChange={val => {
                                            value.backgroundOptions[
                                                selector
                                            ].positionOptions.position = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                    />
                                    {value.backgroundOptions[selector]
                                        .positionOptions.position ===
                                        'custom' && (
                                        <Fragment>
                                            <SizeControl
                                                label={__(
                                                    'Y-axis',
                                                    'maxi-blocks'
                                                )}
                                                unit={
                                                    value.backgroundOptions[
                                                        selector
                                                    ].positionOptions.widthUnit
                                                }
                                                defaultUnit={
                                                    defaultValue
                                                        .backgroundOptions[0]
                                                        .positionOptions
                                                        .widthUnit
                                                }
                                                onChangeUnit={val => {
                                                    value.backgroundOptions[
                                                        selector
                                                    ].positionOptions.widthUnit = val;
                                                    onChange(
                                                        JSON.stringify(value)
                                                    );
                                                }}
                                                value={
                                                    value.backgroundOptions[
                                                        selector
                                                    ].positionOptions.width
                                                }
                                                defaultValue={
                                                    defaultValue
                                                        .backgroundOptions[0]
                                                        .positionOptions.width
                                                }
                                                onChangeValue={val => {
                                                    value.backgroundOptions[
                                                        selector
                                                    ].positionOptions.width = val;
                                                    onChange(
                                                        JSON.stringify(value)
                                                    );
                                                }}
                                            />
                                            <SizeControl
                                                label={__(
                                                    'X-axis',
                                                    'maxi-blocks'
                                                )}
                                                unit={
                                                    value.backgroundOptions[
                                                        selector
                                                    ].positionOptions.heightUnit
                                                }
                                                defaultUnit={
                                                    defaultValue
                                                        .backgroundOptions[0]
                                                        .positionOptions
                                                        .heightUnit
                                                }
                                                onChangeUnit={val => {
                                                    value.backgroundOptions[
                                                        selector
                                                    ].positionOptions.heightUnit = val;
                                                    onChange(
                                                        JSON.stringify(value)
                                                    );
                                                }}
                                                value={
                                                    value.backgroundOptions[
                                                        selector
                                                    ].positionOptions.height
                                                }
                                                defaultValue={
                                                    defaultValue
                                                        .backgroundOptions[0]
                                                        .positionOptions.height
                                                }
                                                onChangeValue={val => {
                                                    value.backgroundOptions[
                                                        selector
                                                    ].positionOptions.height = val;
                                                    onChange(
                                                        JSON.stringify(value)
                                                    );
                                                }}
                                            />
                                        </Fragment>
                                    )}
                                    <SelectControl
                                        label={__(
                                            'Background origin',
                                            'maxi-blocks'
                                        )}
                                        value={
                                            value.backgroundOptions[selector]
                                                .origin
                                        }
                                        options={[
                                            {
                                                label: 'Padding',
                                                value: 'padding-box',
                                            },
                                            {
                                                label: 'Border',
                                                value: 'border-box',
                                            },
                                            {
                                                label: 'Content',
                                                value: 'content-box',
                                            },
                                        ]}
                                        onChange={val => {
                                            value.backgroundOptions[
                                                selector
                                            ].origin = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                    />
                                    <SelectControl
                                        label={__(
                                            'Background clip',
                                            'maxi-blocks'
                                        )}
                                        value={
                                            value.backgroundOptions[selector]
                                                .clip
                                        }
                                        options={[
                                            {
                                                label: 'Border',
                                                value: 'border-box',
                                            },
                                            {
                                                label: 'Padding',
                                                value: 'padding-box',
                                            },
                                            {
                                                label: 'Content',
                                                value: 'content-box',
                                            },
                                        ]}
                                        onChange={val => {
                                            value.backgroundOptions[
                                                selector
                                            ].clip = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                    />
                                    <SelectControl
                                        label={__(
                                            'Background attachment',
                                            'maxi-blocks'
                                        )}
                                        value={
                                            value.backgroundOptions[selector]
                                                .attachment
                                        }
                                        options={[
                                            {
                                                label: 'Scroll',
                                                value: 'scroll',
                                            },
                                            { label: 'Fixed', value: 'fixed' },
                                            { label: 'Local', value: 'local' },
                                        ]}
                                        onChange={val => {
                                            value.backgroundOptions[
                                                selector
                                            ].attachment = val;
                                            onChange(JSON.stringify(value));
                                        }}
                                    />
                                </Fragment>
                            ),
                        },
                    ]}
                />
            )}
            {!disableClipPath && (
                <__experimentalClipPath
                    clipPath={value.clipPath}
                    onChange={val => {
                        value.clipPath = val;
                        onChange(JSON.stringify(value));
                    }}
                />
            )}
        </div>
    );
};

export default BackgroundControl;
