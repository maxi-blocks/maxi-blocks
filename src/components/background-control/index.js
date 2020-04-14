/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    Fragment,
    Component
} = wp.element;
const {
    SelectControl,
    ButtonGroup,
    Button,
} = wp.components;
const {
    dispatch,
    select
} = wp.data;

/**
 * Internal dependencies
 */
import { PopoverControl } from '../popover';
import ColorControl from '../color-control';
import ImageControl from '../image-uploader';
import MiniSizeControl from '../mini-size-control/';

/**
 * External dependencies
 */
import {
    isEmpty,
    isNil,
    pullAt
} from 'lodash';

/**
 * Styles
 */
import './editor.scss'

/**
 * Attributes
 */
export const backgroundControlAttributes = {
    backgroundOptions: {
        type: 'string',
        default: '{"label":"Background","backgroundOptions":[{"imageOptions":{"mediaID":"","mediaURL":""},"sizeOptions":{"size":"auto","widthUnit":"%","width":100,"heightUnit":"%","height":100},"repeat":"repeat","positionOptions":{"position":"center center","widthUnit":"%","width":0,"heightUnit":"%","height":0},"origin":"padding-box","clip":"border-box","attachment":"scroll"}],"colorOptions":{"color":"","gradient":"","gradientAboveBackground":false},"blendMode":"normal"}'
    }
}

/**
 * Components
 */
class BackgroundOptions extends Component {

    state = {
        selector: 0
    }

    render() {
        const {
            backgroundOptions,
            onChange,
            onModalChange
        } = this.props;

        const {
            selector
        } = this.state;

        const onChangeBackground = i => {
            this.setState({ selector: i })
        }

        const onAddBackground = () => {
            backgroundOptions.push(
                {
                    imageOptions: {
                        mediaID: "",
                        mediaURL: ""
                    },
                    sizeOptions: {
                        size: "auto",
                        widthUnit: "%",
                        width: 100,
                        heightUnit: "%",
                        height: 100
                    },
                    repeat: "repeat",
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
            saveAndSend();
            onChangeBackground(backgroundOptions.length - 1)
        }

        const onRemove = () => {
            pullAt(backgroundOptions, selector);
            onChangeBackground(0);
            saveAndSend();
        }

        const saveAndSend = () => {
            onChange(backgroundOptions)
        }

        return (
            <Fragment>
                <div className="gx-backgroundoptions-tabs">
                    <ButtonGroup>
                        {backgroundOptions.map((option, i) => {
                            return (
                                <Button
                                    isSecondary
                                    onClick={() => onChangeBackground(i)}
                                >
                                    {i + 1}
                                </Button>
                            )
                        })}
                        <Button
                            isSecondary
                            onClick={onAddBackground}
                        >
                            +
                        </Button>
                    </ButtonGroup>
                </div>
                <Fragment>
                    <ImageControl
                        label={__('Image Background', 'gutenberg-extra')}
                        mediaID={backgroundOptions[selector].imageOptions.mediaID}
                        onSelectImage={imageData => {
                            backgroundOptions[selector].imageOptions.mediaID = imageData.id;
                            backgroundOptions[selector].imageOptions.mediaURL = imageData.url;
                            saveAndSend();
                        }}
                        onRemoveImage={() => {
                            backgroundOptions[selector].imageOptions.mediaID = '';
                            backgroundOptions[selector].imageOptions.mediaURL = '';
                            saveAndSend();
                        }}
                        onOpen={onModalChange}
                        onClose={onModalChange}
                    />
                    {
                        backgroundOptions[selector].imageOptions.mediaID &&
                        <Fragment>
                            <SelectControl
                                label={__('Background size', 'gutenberg-extra')}
                                value={backgroundOptions[selector].sizeOptions.size}
                                options={[
                                    { label: 'Auto', value: 'auto' },
                                    { label: 'Cover', value: 'cover' },
                                    { label: 'Contain', value: 'contain' },
                                    { label: 'Custom', value: 'custom' }
                                ]}
                                onChange={val => {
                                    backgroundOptions[selector].sizeOptions.size = val;
                                    saveAndSend();
                                }}
                            />
                            {
                                backgroundOptions[selector].sizeOptions.size === 'custom' &&
                                <Fragment>
                                    <MiniSizeControl
                                        unit={backgroundOptions[selector].sizeOptions.widthUnit}
                                        onChangeUnit={val => {
                                            backgroundOptions[selector].sizeOptions.widthUnit = val;
                                            saveAndSend();
                                        }}
                                        value={backgroundOptions[selector].sizeOptions.width}
                                        onChangeValue={val => {
                                            backgroundOptions[selector].sizeOptions.width = val;
                                            saveAndSend();
                                        }}
                                    />
                                    <MiniSizeControl
                                        unit={backgroundOptions[selector].sizeOptions.heightUnit}
                                        onChangeUnit={val => {
                                            backgroundOptions[selector].sizeOptions.heightUnit = val;
                                            saveAndSend();
                                        }}
                                        value={backgroundOptions[selector].sizeOptions.height}
                                        onChangeValue={val => {
                                            backgroundOptions[selector].sizeOptions.height = val;
                                            saveAndSend();
                                        }}
                                    />
                                </Fragment>
                            }
                            <SelectControl
                                label={__('Background repeat', 'gutenberg-extra')}
                                value={backgroundOptions[selector].repeat}
                                options={[
                                    { label: 'Repeat', value: 'repeat' },
                                    { label: 'No repeat', value: 'no-repeat' },
                                    { label: 'Repeat X', value: 'repeat-x' },
                                    { label: 'Repeat Y', value: 'repeat-y' },
                                    { label: 'Space', value: 'space' },
                                    { label: 'Round', value: 'round' },
                                ]}
                                onChange={val => {
                                    backgroundOptions[selector].repeat = val;
                                    saveAndSend();
                                }}
                            />
                            <SelectControl
                                label={__('Background position', 'gutenberg-extra')}
                                value={backgroundOptions[selector].positionOptions.position}
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
                                    backgroundOptions[selector].positionOptions.position = val;
                                    saveAndSend();
                                }}
                            />
                            {
                                backgroundOptions[selector].positionOptions.position === 'custom' &&
                                <Fragment>
                                    <MiniSizeControl
                                        unit={backgroundOptions[selector].positionOptions.widthUnit}
                                        onChangeUnit={val => {
                                            backgroundOptions[selector].positionOptions.widthUnit = val;
                                            saveAndSend();
                                        }}
                                        value={backgroundOptions[selector].positionOptions.width}
                                        onChangeValue={val => {
                                            backgroundOptions[selector].positionOptions.width = val;
                                            saveAndSend();
                                        }}
                                    />
                                    <MiniSizeControl
                                        unit={backgroundOptions[selector].positionOptions.heightUnit}
                                        onChangeUnit={val => {
                                            backgroundOptions[selector].positionOptions.heightUnit = val;
                                            saveAndSend();
                                        }}
                                        value={backgroundOptions[selector].positionOptions.height}
                                        onChangeValue={val => {
                                            backgroundOptions[selector].positionOptions.height = val;
                                            saveAndSend();
                                        }}
                                    />
                                </Fragment>
                            }
                            <SelectControl
                                label={__('Background origin', 'gutenberg-extra')}
                                value={backgroundOptions[selector].origin}
                                options={[
                                    { label: 'Padding', value: 'padding-box' },
                                    { label: 'Border', value: 'border-box' },
                                    { label: 'Content', value: 'content-box' },
                                ]}
                                onChange={val => {
                                    backgroundOptions[selector].origin = val;
                                    saveAndSend();
                                }}
                            />
                            <SelectControl
                                label={__('Background clip', 'gutenberg-extra')}
                                value={backgroundOptions[selector].clip}
                                options={[
                                    { label: 'Border', value: 'border-box' },
                                    { label: 'Padding', value: 'padding-box' },
                                    { label: 'Content', value: 'content-box' },
                                ]}
                                onChange={val => {
                                    backgroundOptions[selector].clip = val;
                                    saveAndSend();
                                }}
                            />
                            <SelectControl
                                label={__('Background attachment', 'gutenberg-extra')}
                                value={backgroundOptions[selector].attachment}
                                options={[
                                    { label: 'Scroll', value: 'scroll' },
                                    { label: 'Fixed', value: 'fixed' },
                                    { label: 'Local', value: 'local' },
                                ]}
                                onChange={val => {
                                    backgroundOptions[selector].attachment = val;
                                    saveAndSend();
                                }}
                            />
                        </Fragment>
                    }
                    {
                        backgroundOptions.length > 1 &&
                        <Button
                            className="gx-backgroundoptions-remove-button"
                            isSecondary
                            onClick={onRemove}
                        >
                            {__('Remove', 'gutenberg-extra')}
                        </Button>
                    }
                </Fragment>
            </Fragment>
        )
    }
}

/**
 * Block
 */
class BackgroundControl extends Component {
    state = {
        modalIsOpen: false
    }

    render() {
        const {
            label = __('Background', 'gutenberg-extra'),
            className = 'gx-background-control',
            backgroundOptions,
            onChange,
            target = ''
        } = this.props;

        const {
            modalIsOpen
        } = this.state;

        let value = typeof backgroundOptions === 'object' ? backgroundOptions : JSON.parse(backgroundOptions);

        const popoverBox = document.querySelector('.gx-background-popover .components-popover__content');
        let classNamePopover = `gx-background-popover gx-popover ${modalIsOpen ? ' gx-background-popover-hide' : ''}`;
        if (!isNil(popoverBox) && isEmpty(popoverBox.style.maxHeight))
            classNamePopover = classNamePopover + ' gx-background-popover-reduce';

        /**
		* Retrieves the old meta data
		*/
        const getMeta = () => {
            let meta = select('core/editor').getEditedPostAttribute('meta')._gutenberg_extra_responsive_styles;
            return meta ? JSON.parse(meta) : {};
        }

		/**
		 * Retrieve the target for responsive CSS
		 */
        const getTarget = () => {
            let styleTarget = select('core/block-editor').getBlockAttributes(select('core/block-editor').getSelectedBlockClientId()).uniqueID;
            styleTarget = `${styleTarget}${target.length > 0 ? `__$${target}` : ''}`;
            return styleTarget;
        }

        /**
         * Creates a new object for being joined with the rest of the values on meta
         */
        const getBackgroundObject = () => {
            const response = {
                label: value.label,
                general: {}
            }

            if (!isEmpty(value.colorOptions.color)) {
                response.general['background-color'] = value.colorOptions.color;
            }
            if (!isEmpty(value.colorOptions.gradient)) {
                response.general['background'] = value.colorOptions.gradient;
            }
            if (!isEmpty(value.blendMode)) {
                response.general['background-blend-mode'] = value.blendMode;
            }

            value.backgroundOptions.map(option => {
                if (isNil(option))
                    return;
                // Image
                if (!isNil(option.imageOptions.mediaURL)) {
                    if (!isNil(response.general['background-image']))
                        response.general['background-image'] = `${response.general['background-image']}, url('${option.imageOptions.mediaURL}')`;
                    else
                        response.general['background-image'] = `url('${option.imageOptions.mediaURL}')`;
                }
                // Size
                if (option.sizeOptions.size != 'custom') {
                    if (!isNil(response.general['background-size']))
                        response.general['background-size'] = `${response.general['background-size']}, ${option.sizeOptions.size}`;
                    else
                        response.general['background-size'] = option.sizeOptions.size;
                }
                else {
                    if (!isNil(response.general['background-size']))
                        response.general['background-size'] = `${response.general['background-size']}, ${option.sizeOptions.width + option.sizeOptions.widthUnit} ${option.sizeOptions.height + option.sizeOptions.heightUnit}`;
                    else
                        response.general['background-size'] = `${option.sizeOptions.width + option.sizeOptions.widthUnit} ${option.sizeOptions.height + option.sizeOptions.heightUnit}`;
                }
                // Repeat
                if (option.repeat) {
                    if (!isNil(response.general['background-repeat']))
                        response.general['background-repeat'] = `${response.general['background-repeat']}, ${option.repeat}`;
                    else
                        response.general['background-repeat'] = option.repeat;
                }
                // Position
                if (option.positionOptions.position != 'custom') {
                    if (!isNil(response.general['background-position']))
                        response.general['background-position'] = `${response.general['background-position']}, ${option.positionOptions.position}`;
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
                        response.general['background-origin'] = `${response.general['background-origin']}, ${option.origin}`;
                    else
                        response.general['background-origin'] = option.origin;
                }
                // Clip
                if (option.clip) {
                    if (!isNil(response.general['background-clip']))
                        response.general['background-clip'] = `${response.general['background-clip']}, ${option.clip}`;
                    else
                        response.general['background-clip'] = option.clip;
                }
                // Attachment
                if (option.attachment) {
                    if (!isNil(response.general['background-attachment']))
                        response.general['background-attachment'] = `${response.general['background-attachment']}, ${option.attachment}`;
                    else
                        response.general['background-attachment'] = option.attachment;
                }
            })

            return response;
        }

		/**
		* Creates a new object that
		*
		* @param {string} target	Block attribute: uniqueID
		* @param {obj} meta		Old and saved metadate
		* @param {obj} value	New values to add
		*/
        const metaValue = () => {
            const meta = getMeta();
            let styleTarget = styleTarget = getTarget();
            let obj = getBackgroundObject();
            const responsiveStyle = new ResponsiveStylesResolver(styleTarget, meta, obj);
            const response = JSON.stringify(responsiveStyle.getNewValue);
            return response;
        }

		/**
		* Saves and send the data. Also refresh the styles on Editor
		*/
        const saveAndSend = () => {
            onChange(JSON.stringify(value));
            dispatch('core/editor').editPost({
                meta: {
                    _gutenberg_extra_responsive_styles: metaValue(),
                },
            });
            new BackEndResponsiveStyles(getMeta());
        }

        const onReset = () => {
            value = JSON.parse('{"label":"Background","backgroundOptions":[{"imageOptions":{"mediaID":"","mediaURL":""},"sizeOptions":{"size":"auto","widthUnit":"%","width":100,"heightUnit":"%","height":100},"repeat":"repeat","positionOptions":{"position":"center center","widthUnit":"%","width":0,"heightUnit":"%","height":0},"origin":"padding-box","clip":"border-box","attachment":"scroll"}],"colorOptions":{"color":"","gradient":"","gradientAboveBackground":false},"blendMode":"normal"}')
            saveAndSend()
        }

        return (
            <div className={className}>
                <PopoverControl
                    label={label}
                    className
                    showReset
                    onReset={onReset}
                    popovers={[
                        {
                            content: (
                                <Fragment>
                                    <BackgroundOptions
                                        backgroundOptions={value.backgroundOptions}
                                        onChange={val => {
                                            value.backgroundOptions = val;
                                            saveAndSend();
                                        }}
                                        onModalChange={() => this.setState({ modalIsOpen: !modalIsOpen })}
                                    />
                                    <hr style={{ borderTop: '1px solid #ddd' }} />
                                    <ColorControl
                                        label={__('Background color', 'gutenberg-extra')}
                                        color={value.colorOptions.color}
                                        onColorChange={val => {
                                            value.colorOptions.color = val;
                                            saveAndSend()
                                        }}
                                        gradient={value.colorOptions.gradient}
                                        onGradientChange={val => {
                                            value.colorOptions.gradient = val;
                                            saveAndSend()
                                        }}
                                        gradientAboveBackground={value.colorOptions.gradientAboveBackground}
                                        onGradientAboveBackgroundChange={val => {
                                            value.colorOptions.gradientAboveBackground = val;
                                            saveAndSend()
                                        }}
                                    />
                                    <SelectControl
                                        label={__('Background blend mode', 'gutenberg-extra')}
                                        value={value.blendMode}
                                        options={[
                                            { label: 'Normal', value: 'normal' },
                                            { label: 'Multiply', value: 'multiply' },
                                            { label: 'Screen', value: 'screen' },
                                            { label: 'Overlay', value: 'overlay' },
                                            { label: 'Darken', value: 'darken' },
                                            { label: 'Lighten', value: 'lighten' },
                                            { label: 'Color dodge', value: 'color-dodge' },
                                            { label: 'Saturation', value: 'saturation' },
                                            { label: 'Color', value: 'color' },
                                            { label: 'Luminosity', value: 'luminosity' },
                                        ]}
                                        onChange={val => {
                                            value.blendMode = val;
                                            saveAndSend();
                                        }}
                                    />
                                </Fragment>
                            ),
                            classNamePopover: classNamePopover
                        }
                    ]}
                />
            </div>
        )
    }
}

export default BackgroundControl;