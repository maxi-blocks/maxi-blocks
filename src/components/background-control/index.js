/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    SelectControl,
    Button,
} = wp.components;

/**
 * Internal dependencies
 */
import { GXComponent } from '../index';
import AccordionControl from '../accordion-control';
import ColorControl from '../color-control';
import ImageUploaderControl from '../image-uploader-control';
import ImageCropControl from '../image-crop-control';
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
 * Styles
 */
import './editor.scss'

/**
 * Components
 */
export default class BackgroundControl extends GXComponent {
    state = {
        isOpen: false,
        selector: 0
    }

    componentDidMount() {
        const value = typeof this.props.backgroundOptions === 'object' ? this.props.backgroundOptions : JSON.parse(this.props.backgroundOptions);
        this.saveAndSend(value)
    }

    /**
     * Creates a new object for being joined with the rest of the values on meta
     */
    get getObject() {
        const response = {
            label: this.object.label,
            general: {}
        }

        if (!isEmpty(this.object.colorOptions.color)) {
            response.general['background-color'] = this.object.colorOptions.color;
        }
        if (!isEmpty(this.object.colorOptions.gradient)) {
            response.general['background'] = this.object.colorOptions.gradient;
        }
        if (!isEmpty(this.object.blendMode)) {
            response.general['background-blend-mode'] = this.object.blendMode;
        }

        this.object.backgroundOptions.map(option => {
            if (isNil(option) || isEmpty(option.imageOptions.mediaURL))
                return;
            // Image
            if (option.sizeSettings.size === 'custom' && !isNil(option.imageOptions.cropOptions)) {
                if (!isNil(response.general['background-image']))
                    response.general['background-image'] = `${response.general['background-image']},url('${option.imageOptions.cropOptions.image.source_url}')`;
                else
                    response.general['background-image'] = `url('${option.imageOptions.cropOptions.image.source_url}')`;
                if (!isEmpty(this.object.colorOptions.gradient))
                    response.general['background-image'] = `${response.general['background-image']}, ${this.object.colorOptions.gradient}`;
            }
            else if (option.sizeSettings.size === 'custom' && isNil(option.imageOptions.cropOptions) || option.sizeSettings.size != 'custom' && !isNil(option.imageOptions.mediaURL)) {
                if (!isNil(response.general['background-image']))
                    response.general['background-image'] = `${response.general['background-image']},url('${option.imageOptions.mediaURL}')`;
                else
                    response.general['background-image'] = `url('${option.imageOptions.mediaURL}')`;
                if (!isEmpty(this.object.colorOptions.gradient))
                    response.general['background-image'] = `${response.general['background-image']}, ${this.object.colorOptions.gradient}`;
            }
            // Size
            if (option.sizeSettings.size != 'custom') {
                if (!isNil(response.general['background-size']))
                    response.general['background-size'] = `${response.general['background-size']},${option.sizeSettings.size}`;
                else
                    response.general['background-size'] = option.sizeSettings.size;
            }
            else {
                if (!isNil(response.general['background-size']))
                    response.general['background-size'] = `${response.general['background-size']},cover`;
                else
                    response.general['background-size'] = 'cover';
            }
            // Repeat
            if (option.repeat) {
                if (!isNil(response.general['background-repeat']))
                    response.general['background-repeat'] = `${response.general['background-repeat']},${option.repeat}`;
                else
                    response.general['background-repeat'] = option.repeat;
            }
            // Position
            if (option.positionOptions.position != 'custom') {
                if (!isNil(response.general['background-position']))
                    response.general['background-position'] = `${response.general['background-position']},${option.positionOptions.position}`;
                else
                    response.general['background-position'] = option.positionOptions.position;
            }
            else {
                if (!isNil(response.general['background-position']))
                    response.general['background-position'] = `
                            ${response.general['background-position']},
                            ${option.positionOptions.width + option.positionOptions.widthUnit} ${option.positionOptions.height + option.positionOptions.heightUnit}`;
                else
                    response.general['background-position'] = `${option.positionOptions.width + option.positionOptions.widthUnit} ${option.positionOptions.height + option.positionOptions.heightUnit}`;
            }
            // Origin
            if (option.origin) {
                if (!isNil(response.general['background-origin']))
                    response.general['background-origin'] = `${response.general['background-origin']},${option.origin}`;
                else
                    response.general['background-origin'] = option.origin;
            }
            // Clip
            if (option.clip) {
                if (!isNil(response.general['background-clip']))
                    response.general['background-clip'] = `${response.general['background-clip']},${option.clip}`;
                else
                    response.general['background-clip'] = option.clip;
            }
            // Attachment
            if (option.attachment) {
                if (!isNil(response.general['background-attachment']))
                    response.general['background-attachment'] = `${response.general['background-attachment']},${option.attachment}`;
                else
                    response.general['background-attachment'] = option.attachment;
            }
        })

        return response;
    }

    render() {
        const {
            className,
            backgroundOptions,
        } = this.props;

        const {
            isOpen,
            selector
        } = this.state;

        let value = typeof backgroundOptions === 'object' ? backgroundOptions : JSON.parse(backgroundOptions);
        const classes = classnames('gx-background-control', className) + (isOpen ? ' gx-background-control-open' : '');

        const onAddBackground = i => {
            value.backgroundOptions.push(
                {
                    imageOptions: {
                        mediaID: "",
                        mediaURL: ""
                    },
                    sizeSettings: {
                        size: "cover",
                        widthUnit: "%",
                        width: 100,
                        heightUnit: "%",
                        height: 100
                    },
                    repeat: "no-repeat",
                    positionOptions: {
                        position: "center center",
                        widthUnit: "%",
                        width: 0,
                        heightUnit: "%",
                        height: 0
                    },
                    origin: "padding-box",
                    clip: "border-box",
                    attachment: "scroll"
                }
            );
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

        return (
            <div className={classes}>
                {
                    !isOpen &&
                    <Fragment>
                        {
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
                                            placeholder={value.backgroundOptions.length - 1 === 0 ? __('Set image', 'gutenberg-extra') : __('Add Another Image', 'gutenberg-extra')}
                                            extendSelector={
                                                value.backgroundOptions[i].imageOptions.mediaID &&
                                                <Button
                                                    isSecondary
                                                    onClick={(e) => onOpenOptions(e, i)}
                                                    className='gx-background-control-edit-image'
                                                >
                                                    Edit image
                                                </Button>
                                            }
                                            alternativeImage={getAlternativeImage(i)}
                                        />
                                    </Fragment>
                                )
                            })
                        }
                        <ColorControl
                            label={__('Background color', 'gutenberg-extra')}
                            color={value.colorOptions.color}
                            defaultColor={value.colorOptions.defaultColor}
                            onColorChange={val => {
                                value.colorOptions.color = val;
                                this.saveAndSend(value)
                            }}
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
                    </Fragment>
                }
                {
                    isOpen &&
                    <AccordionControl
                        isSecondary
                        preExpanded={['gx-background-control-image-tab']}
                        items={[
                            {
                                label: __('Image', 'gutenberg-extra'),
                                className: 'gx-background-control-image-tab',
                                uuid: 'gx-background-control-image-tab',
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
                                                className='gx-background-control-done-edition'
                                            >
                                                Done
                                            </Button>
                                        }
                                        replaceButton={__('Replace', 'gutenberg-extra')}
                                        removeButton={__('Delete', 'gutenberg-extra')}
                                        alternativeImage={getAlternativeImage(selector)}
                                    />
                                )
                            },
                            {
                                label: __('Background', 'gutenberg-extra'),
                                className: 'gx-background-control-background-tab',
                                content: (
                                    <Fragment>
                                        <SelectControl
                                            label={__('Background size', 'gutenberg-extra')}
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
                                                cropOptions={value.backgroundOptions[selector].imageOptions.cropOptions ? value.backgroundOptions[selector].imageOptions.cropOptions : {}}
                                                onChange={cropOptions => {
                                                    value.backgroundOptions[selector].imageOptions.cropOptions = cropOptions;
                                                    this.saveAndSend(value);
                                                }}
                                            />
                                        }
                                        <SelectControl
                                            label={__('Background repeat', 'gutenberg-extra')}
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
                                            label={__('Background position', 'gutenberg-extra')}
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
                                            label={__('Background origin', 'gutenberg-extra')}
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
                                            label={__('Background clip', 'gutenberg-extra')}
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
                                            label={__('Background attachment', 'gutenberg-extra')}
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
