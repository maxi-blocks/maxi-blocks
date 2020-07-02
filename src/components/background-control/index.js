/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    SelectControl,
    RadioControl,
    Button,
    Icon,
} = wp.components;
const { select } = wp.data;

/**
 * Internal dependencies
 */
import { GXComponent } from '../index';
import { background } from '../../extensions/styles/defaults';
import ColorControl from '../color-control';
import GradientControl from '../gradient-control';
import ImageUploaderControl from '../image-uploader-control';
import ImageCropControl from '../image-crop-control';
import VideoUploaderControl from '../video-uploader-control';
import SettingTabsControl from '../setting-tabs-control';
import SizeControl from '../size-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isEmpty,
    isNil,
    isNumber,
    pullAt
} from 'lodash';

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
export default class BackgroundControl extends GXComponent {
    state = {
        isOpen: false,
        selector: 0,
        backgroundItems: 'color',
    }

    render() {
        const {
            className,
            backgroundOptions,
            disableImage = false,
        } = this.props;

        const {
            isOpen,
            selector,
            backgroundItems,
        } = this.state;

        let value = typeof backgroundOptions === 'object' ?
            backgroundOptions :
            JSON.parse(backgroundOptions);

        const classes = classnames(
            'maxi-background-control',
            className,
            isOpen ?
                'maxi-background-control__open' :
                ''
        );

        const allowedBlocks = [
            'maxi-blocks/column-maxi',
            'maxi-blocks/row-maxi',
            'maxi-blocks/container-maxi',
        ]
        const backgroundVideoAllowedBlocks = [...allowedBlocks]
        const backgroundImageAllowedBlocks = [...allowedBlocks]
        const backgroundGradientAllowedBlocks = [
            ...allowedBlocks,
            'maxi-blocks/button-maxi',
        ]

        const currentBlockName = select('core/block-editor').getSelectedBlock().name;

        const onAddBackground = () => {
            value.backgroundOptions.push(background.backgroundOptions[0])
        }

        const onOpenOptions = (e, i) => {
            e.stopPropagation();
            this.setState({
                isOpen: true,
                selector: i
            })
        }

        const onRemoveImage = () => {
            pullAt(value.backgroundOptions, selector);
            this.saveAndSend(value);
            onDoneEdition();
        }


        const onDoneEdition = () => {
            this.setState({
                isOpen: false,
                selector: 0
            })
        }

        const getAlternativeImage = i => {
            if (isNil(value.backgroundOptions[i].imageOptions.cropOptions))
                return;
            if (isEmpty(value.backgroundOptions[i].imageOptions.cropOptions.image.source_url))
                return;
            return {
                source_url: value.backgroundOptions[i].imageOptions.cropOptions.image.source_url,
                width: value.backgroundOptions[i].imageOptions.cropOptions.image.width,
                height: value.backgroundOptions[i].imageOptions.cropOptions.image.height
            }
        }

        const getOptions = () => {
            let options = [];
            options.push({ label: <Icon icon={backgroundColor} />, value: 'color' });
            backgroundImageAllowedBlocks.includes(currentBlockName) &&
                options.push({ label: <Icon icon={backgroundImage} />, value: 'image' });
            backgroundVideoAllowedBlocks.includes(currentBlockName) &&
                options.push({ label: <Icon icon={backgroundVideo} />, value: 'video' });
            backgroundGradientAllowedBlocks.includes(currentBlockName) &&
                options.push({ label: <Icon icon={backgroundGradient()} />, value: 'gradient' })

            return options;
        }

        return (
            <div className={classes}>
                {
                    getOptions().length > 1 &&
                    <div className='maxi-background-control__background-items'>
                        <RadioControl
                            label={__('Background')}
                            selected={backgroundItems}
                            options={getOptions()}
                            onChange={value => this.setState({backgroundItems: value})}
                        />
                    </div>
                }
                {
                    !isOpen &&
                    <Fragment>
                        {
                            backgroundItems === 'video' &&
                            <div className="maxi-background-control__video">
                                <VideoUploaderControl
                                    mediaID={value.videoOptions.mediaID}
                                    onSelectImage={videoData => {
                                        value.videoOptions.mediaID = videoData.id;
                                        value.videoOptions.mediaURL = videoData.url;
                                        this.saveAndSend(value);
                                    }}
                                    onRemoveImage={() => {
                                        value.videoOptions.mediaID = '';
                                        value.videoOptions.mediaURL = '';
                                        this.saveAndSend(value);
                                    }}
                                    placeholder={__('Set Video', 'maxi-blocks')}
                                />
                                <SizeControl
                                    label={__('Width', 'maxi-blocks')}
                                    unit={value.videoOptions.widthUnit}
                                    onChangeUnit={val => {
                                       value.videoOptions.widthUnit = val;
                                        this.saveAndSend(value);
                                    }}
                                    value={value.videoOptions.width}
                                    onChangeValue={val => {
                                       value.videoOptions.width = val;
                                       this.saveAndSend(value);
                                    }}
                                />
                                <SizeControl
                                    label={__('Height', 'maxi-blocks')}
                                    unit={value.videoOptions.heightUnit}
                                    onChangeUnit={val => {
                                       value.videoOptions.heightUnit = val;
                                        this.saveAndSend(value);
                                    }}
                                    value={value.videoOptions.height}
                                    onChangeValue={val => {
                                       value.videoOptions.height = val;
                                       this.saveAndSend(value);
                                    }}
                                />
                                <SelectControl
                                    label={__('Fill', 'maxi-blocks')}
                                    value={value.videoOptions.fill}
                                    options={[
                                        { label: 'Cover', value: 'cover' },
                                        { label: 'Contain', value: 'contain' },
                                        { label: 'Fill', value: 'fill' },
                                        { label: 'Scale-down', value: 'scale-down' },
                                        { label: 'None', value: 'none' },
                                    ]}
                                    onChange={val => {
                                        value.videoOptions.fill = val;
                                        this.saveAndSend(value);
                                    }}
                                />
                                <SelectControl
                                    label={__('Position', 'maxi-blocks')}
                                    value={value.videoOptions.position}
                                    options={[
                                        { label: 'Unset', value: 'unset' },
                                        { label: 'Top', value: 'top' },
                                        { label: 'Right', value: 'right' },
                                        { label: 'Bottom', value: 'bottom' },
                                        { label: 'Left', value: 'left' },
                                        { label: 'Center', value: 'center' },
                                    ]}
                                    onChange={val => {
                                        value.videoOptions.position = val;
                                        this.saveAndSend(value);
                                    }}
                                />
                                <SelectControl
                                    label={__('Autoplay', 'maxi-blocks')}
                                    value={value.videoOptions.autoplay}
                                    options={[
                                        { label: 'No', value: 'no' },
                                        { label: 'Yes', value: 'yes' },
                                    ]}
                                    onChange={val => {
                                        value.videoOptions.autoplay = val;
                                        this.saveAndSend(value);
                                    }}
                                />
                                <SelectControl
                                    label={__('Playback Controls', 'maxi-blocks')}
                                    value={value.videoOptions.controls}
                                    options={[
                                        { label: 'No', value: 'no' },
                                        { label: 'Yes', value: 'yes' },
                                    ]}
                                    onChange={val => {
                                        value.videoOptions.controls = val;
                                        this.saveAndSend(value);
                                    }}
                                />
                                <SelectControl
                                    label={__('Loop', 'maxi-blocks')}
                                    value={value.videoOptions.loop}
                                    options={[
                                        { label: 'No', value: 'no' },
                                        { label: 'Yes', value: 'yes' },
                                    ]}
                                    onChange={val => {
                                        value.videoOptions.loop = val;
                                        this.saveAndSend(value);
                                    }}
                                />
                                <SelectControl
                                    label={__('Muted', 'maxi-blocks')}
                                    value={value.videoOptions.muted}
                                    options={[
                                        { label: 'No', value: 'no' },
                                        { label: 'Yes', value: 'yes' },
                                    ]}
                                    onChange={val => {
                                        value.videoOptions.muted = val;
                                        this.saveAndSend(value);
                                    }}
                                />
                                <SelectControl
                                    label={__('Preload', 'maxi-blocks')}
                                    value={value.videoOptions.muted}
                                    options={[
                                        { label: 'MetaData', value: 'metadata' },
                                        { label: 'Auto', value: 'auto' },
                                        { label: 'None', value: 'none' },
                                    ]}
                                    onChange={val => {
                                        value.videoOptions.muted = val;
                                        this.saveAndSend(value);
                                    }}
                                />
                            </div>
                        }
                        {
                            backgroundItems === 'gradient' &&
                            <GradientControl
                                label={__('Background', 'maxi-blocks')}
                                gradient={value.colorOptions.gradient}
                                defaultGradient={value.colorOptions.defaultGradient}
                                onGradientChange={val => {
                                    value.colorOptions.gradient = val;
                                    this.saveAndSend(value)
                                }}
                                gradientAboveBackground={value.colorOptions.gradientAboveBackground}
                                onGradientAboveBackgroundChange={val => {
                                    value.colorOptions.gradientAboveBackground = val;
                                    this.saveAndSend(value)
                                }}
                            />
                        }
                        {
                            backgroundItems === 'color' &&
                            <ColorControl
                                label={__('Background', 'maxi-blocks')}
                                color={value.colorOptions.color}
                                defaultColor={value.colorOptions.defaultColor}
                                onColorChange={val => {
                                    value.colorOptions.color = val;
                                    this.saveAndSend(value)
                                }}
                            />
                        }
                        {
                            !disableImage &&
                            backgroundItems === 'image' &&
                            value.backgroundOptions.map((option, i) => {
                                return (
                                    <Fragment>
                                        <ImageUploaderControl
                                            mediaID={value.backgroundOptions[i].imageOptions.mediaID}
                                            onSelectImage={imageData => {
                                                if (!isNumber(value.backgroundOptions[i].imageOptions.mediaID))
                                                    onAddBackground()
                                                value.backgroundOptions[i].imageOptions.mediaID = imageData.id;
                                                value.backgroundOptions[i].imageOptions.mediaURL = imageData.url;
                                                this.saveAndSend(value);
                                            }}
                                            onRemoveImage={() => {
                                                value.backgroundOptions[selector].imageOptions.mediaID = '';
                                                value.backgroundOptions[selector].imageOptions.mediaURL = '';
                                                onRemoveImage();
                                                this.saveAndSend(value);
                                            }}
                                            placeholder={
                                                value.backgroundOptions.length - 1 === 0 ?
                                                    __('Set image', 'maxi-blocks') :
                                                    __('Add Another Image', 'maxi-blocks')
                                            }
                                            extendSelector={
                                                value.backgroundOptions[i].imageOptions.mediaID &&
                                                <Button
                                                    isSecondary
                                                    onClick={(e) => onOpenOptions(e, i)}
                                                    className='maxi-background-control__image-edit'
                                                >
                                                    {__('Edit image', 'maxi-blocks')}
                                                </Button>
                                            }
                                            alternativeImage={getAlternativeImage(i)}
                                            removeButton={__('Remove', 'maxi-blocks')}
                                        />
                                    </Fragment>
                                )
                            })
                        }
                    </Fragment>
                }
                {
                    isOpen &&
                    backgroundItems === 'image' &&
                    <SettingTabsControl
                        items={[
                            {
                                label: __('Image', 'maxi-blocks'),
                                className: 'maxi-background-control__image-tab',
                                uuid: 'maxi-background-control__image-tab',
                                content: (
                                    <ImageUploaderControl
                                        mediaID={value.backgroundOptions[selector].imageOptions.mediaID}
                                        onSelectImage={imageData => {
                                            value.backgroundOptions[selector].imageOptions.mediaID = imageData.id;
                                            value.backgroundOptions[selector].imageOptions.mediaURL = imageData.url;
                                            this.saveAndSend(value);
                                        }}
                                        onRemoveImage={() => {
                                            value.backgroundOptions[selector].imageOptions.mediaID = '';
                                            value.backgroundOptions[selector].imageOptions.mediaURL = '';
                                            onRemoveImage();
                                            this.saveAndSend(value);
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
                                        alternativeImage={getAlternativeImage(selector)}
                                    />
                                )
                            },
                            {
                                label: __('Background', 'maxi-blocks'),
                                className: 'maxi-background-control__background-tab',
                                content: (
                                    <Fragment>
                                        <SelectControl
                                            label={__('Background size', 'maxi-blocks')}
                                            value={value.backgroundOptions[selector].sizeSettings.size}
                                            options={[
                                                { label: 'Auto', value: 'auto' },
                                                { label: 'Cover', value: 'cover' },
                                                { label: 'Contain', value: 'contain' },
                                                { label: 'Custom', value: 'custom' }
                                            ]}
                                            onChange={val => {
                                                value.backgroundOptions[selector].sizeSettings.size = val;
                                                this.saveAndSend(value);
                                            }}
                                        />
                                        {
                                            value.backgroundOptions[selector].sizeSettings.size === 'custom' &&
                                            <ImageCropControl
                                                mediaID={value.backgroundOptions[selector].imageOptions.mediaID}
                                                cropOptions={
                                                    value.backgroundOptions[selector].imageOptions.cropOptions ?
                                                        value.backgroundOptions[selector].imageOptions.cropOptions :
                                                        {}
                                                }
                                                onChange={cropOptions => {
                                                    value.backgroundOptions[selector].imageOptions.cropOptions = cropOptions;
                                                    this.saveAndSend(value);
                                                }}
                                            />
                                        }
                                        <SelectControl
                                            label={__('Background repeat', 'maxi-blocks')}
                                            value={value.backgroundOptions[selector].repeat}
                                            options={[
                                                { label: 'Repeat', value: 'repeat' },
                                                { label: 'No repeat', value: 'no-repeat' },
                                                { label: 'Repeat X', value: 'repeat-x' },
                                                { label: 'Repeat Y', value: 'repeat-y' },
                                                { label: 'Space', value: 'space' },
                                                { label: 'Round', value: 'round' },
                                            ]}
                                            onChange={val => {
                                                value.backgroundOptions[selector].repeat = val;
                                                this.saveAndSend(value);
                                            }}
                                        />
                                        <SelectControl
                                            label={__('Background position', 'maxi-blocks')}
                                            value={value.backgroundOptions[selector].positionOptions.position}
                                            options={[
                                                { label: 'Left top', value: 'left top' },
                                                { label: 'Left center', value: 'left center' },
                                                { label: 'Left bottom', value: 'left bottom' },
                                                { label: 'Right top', value: 'right top' },
                                                { label: 'Right center', value: 'right center' },
                                                { label: 'Right bottom', value: 'right bottom' },
                                                { label: 'Center top', value: 'center top' },
                                                { label: 'Center center', value: 'center center' },
                                                { label: 'Center bottom', value: 'center bottom' },
                                                { label: 'Custom', value: 'custom' }
                                            ]}
                                            onChange={val => {
                                                value.backgroundOptions[selector].positionOptions.position = val;
                                                this.saveAndSend(value);
                                            }}
                                        />
                                        {
                                            value.backgroundOptions[selector].positionOptions.position === 'custom' &&
                                            <Fragment>
                                                <SizeControl
                                                    label={__('Y-axis', 'maxi-blocks')}
                                                    unit={value.backgroundOptions[selector].positionOptions.widthUnit}
                                                    onChangeUnit={val => {
                                                        value.backgroundOptions[selector].positionOptions.widthUnit = val;
                                                        this.saveAndSend(value);
                                                    }}
                                                    value={value.backgroundOptions[selector].positionOptions.width}
                                                    onChangeValue={val => {
                                                        value.backgroundOptions[selector].positionOptions.width = val;
                                                        this.saveAndSend(value);
                                                    }}
                                                />
                                                <SizeControl
                                                    label={__('X-axis', 'maxi-blocks')}
                                                    unit={value.backgroundOptions[selector].positionOptions.heightUnit}
                                                    onChangeUnit={val => {
                                                        value.backgroundOptions[selector].positionOptions.heightUnit = val;
                                                        this.saveAndSend(value);
                                                    }}
                                                    value={value.backgroundOptions[selector].positionOptions.height}
                                                    onChangeValue={val => {
                                                        value.backgroundOptions[selector].positionOptions.height = val;
                                                        this.saveAndSend(value);
                                                    }}
                                                />
                                            </Fragment>
                                        }
                                        <SelectControl
                                            label={__('Background origin', 'maxi-blocks')}
                                            value={value.backgroundOptions[selector].origin}
                                            options={[
                                                { label: 'Padding', value: 'padding-box' },
                                                { label: 'Border', value: 'border-box' },
                                                { label: 'Content', value: 'content-box' },
                                            ]}
                                            onChange={val => {
                                                value.backgroundOptions[selector].origin = val;
                                                this.saveAndSend(value);
                                            }}
                                        />
                                        <SelectControl
                                            label={__('Background clip', 'maxi-blocks')}
                                            value={value.backgroundOptions[selector].clip}
                                            options={[
                                                { label: 'Border', value: 'border-box' },
                                                { label: 'Padding', value: 'padding-box' },
                                                { label: 'Content', value: 'content-box' },
                                            ]}
                                            onChange={val => {
                                                value.backgroundOptions[selector].clip = val;
                                                this.saveAndSend(value);
                                            }}
                                        />
                                        <SelectControl
                                            label={__('Background attachment', 'maxi-blocks')}
                                            value={value.backgroundOptions[selector].attachment}
                                            options={[
                                                { label: 'Scroll', value: 'scroll' },
                                                { label: 'Fixed', value: 'fixed' },
                                                { label: 'Local', value: 'local' },
                                            ]}
                                            onChange={val => {
                                                value.backgroundOptions[selector].attachment = val;
                                                this.saveAndSend(value);
                                            }}
                                        />
                                    </Fragment>
                                )
                            }
                        ]}
                    />
                }
            </div>
        )
    }
}
