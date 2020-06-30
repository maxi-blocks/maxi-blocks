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
import { MaxiComponent } from '../index';
import AccordionControl from '../accordion-control';
import ColorControl from '../color-control';
import ImageUploaderControl from '../image-uploader-control';
import ImageCropControl from '../image-crop-control';
import SettingTabsControl from '../setting-tabs-control';
import SizeControl from '../size-control';
import { background } from '../../extensions/styles/defaults';

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
import './editor.scss';

/**
 * Components
 */
export default class BackgroundControl extends MaxiComponent {
    state = {
        isOpen: false,
        selector: 0
    }

    render() {
        const {
            className,
            backgroundOptions,
            disableImage = false
        } = this.props;

        const {
            isOpen,
            selector
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

        return (
            <div className={classes}>
                {
                    !isOpen &&
                    <Fragment>
                        {
                            !disableImage &&
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
                                                    Edit image
                                                </Button>
                                            }
                                            alternativeImage={getAlternativeImage(i)}
                                            removeButton={__('Remove', 'maxi-blocks')}
                                        />
                                    </Fragment>
                                )
                            })
                        }
                        <ColorControl
                            label={__('Background color', 'maxi-blocks')}
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
                                                Done
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
