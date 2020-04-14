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
    Button,
} = wp.components;
const {
    dispatch,
    select
} = wp.data;

/**
 * Internal dependencies
 */
import ColorControl from '../../color-control';
import ImageControl from '../../image-uploader';
import MiniSizeControl from '../../mini-size-control/';
import AccordionControl from '../../accordion-control/';

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
export const backgroundControlAttributesTest = {
    backgroundOptionsTest: {
        type: 'string',
        default: '{"label":"Background","backgroundOptions":[{"imageOptions":{"mediaID":"","mediaURL":""},"sizeOptions":{"size":"auto","widthUnit":"%","width":100,"heightUnit":"%","height":100},"repeat":"repeat","positionOptions":{"position":"center center","widthUnit":"%","width":0,"heightUnit":"%","height":0},"origin":"padding-box","clip":"border-box","attachment":"scroll"}],"colorOptions":{"color":"","gradient":"","gradientAboveBackground":false},"blendMode":"normal"}'
    }
}

/**
 * Components
 */
export default class BackgroundControlTest extends Component {
    state = {
        isOpen: false,
        selector: 0
    }

    render() {
        const {
            className = 'gx-background-control',
            backgroundOptions,
            onChange,
            target = ''
        } = this.props;

        const {
            isOpen,
            selector
        } = this.state;

        let value = typeof backgroundOptions === 'object' ? backgroundOptions : JSON.parse(backgroundOptions);
        const classes = className + (isOpen ? ' gx-background-control-open' : '');

        const onAddBackground = i => {
            value.backgroundOptions.push(
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
            saveAndSend();
            onDoneEdition();
        }

        const onDoneEdition = () => {
            this.setState({
                isOpen: false,
                selector: 0
            })
        }

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
                        response.general['background-image'] = `${response.general['background-image']},url('${option.imageOptions.mediaURL}')`;
                    else
                        response.general['background-image'] = `url('${option.imageOptions.mediaURL}')`;
                    if (!isEmpty(value.colorOptions.gradient))
                        response.general['background-image'] = `${response.general['background-image']}, ${value.colorOptions.gradient}`;
                }
                // Size
                if (option.sizeOptions.size != 'custom') {
                    if (!isNil(response.general['background-size']))
                        response.general['background-size'] = `${response.general['background-size']},${option.sizeOptions.size}`;
                    else
                        response.general['background-size'] = option.sizeOptions.size;
                }
                else {
                    if (!isNil(response.general['background-size']))
                        response.general['background-size'] = `${response.general['background-size']},${option.sizeOptions.width + option.sizeOptions.widthUnit} ${option.sizeOptions.height + option.sizeOptions.heightUnit}`;
                    else
                        response.general['background-size'] = `${option.sizeOptions.width + option.sizeOptions.widthUnit} ${option.sizeOptions.height + option.sizeOptions.heightUnit}`;
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

        return (
            <div className={classes}>
                {
                    !isOpen &&
                    <Fragment>
                        {
                            value.backgroundOptions.map((option, i) => {
                                return (
                                    <Fragment>
                                        <ImageControl
                                            mediaID={value.backgroundOptions[i].imageOptions.mediaID}
                                            onSelectImage={imageData => {
                                                value.backgroundOptions[i].imageOptions.mediaID = imageData.id;
                                                value.backgroundOptions[i].imageOptions.mediaURL = imageData.url;
                                                onAddBackground();
                                                saveAndSend();
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
                                        />
                                    </Fragment>
                                )
                            })
                        }
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
                    </Fragment>
                }
                {
                    isOpen &&
                    <AccordionControl
                        allowMultipleExpanded={false}
                        preExpanded={['gx-background-control-image-tab']}
                        items={[
                            {
                                label: __('Image', 'gutenberg-extra'),
                                className: 'gx-background-control-image-tab',
                                uuid: 'gx-background-control-image-tab',
                                content: (
                                    <ImageControl
                                        mediaID={value.backgroundOptions[selector].imageOptions.mediaID}
                                        onSelectImage={imageData => {
                                            value.backgroundOptions[selector].imageOptions.mediaID = imageData.id;
                                            value.backgroundOptions[selector].imageOptions.mediaURL = imageData.url;
                                            saveAndSend();
                                        }}
                                        onRemoveImage={() => {
                                            value.backgroundOptions[selector].imageOptions.mediaID = '';
                                            value.backgroundOptions[selector].imageOptions.mediaURL = '';
                                            onRemoveImage();
                                            saveAndSend();
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
                                            value={value.backgroundOptions[selector].sizeOptions.size}
                                            options={[
                                                { label: 'Auto', value: 'auto' },
                                                { label: 'Cover', value: 'cover' },
                                                { label: 'Contain', value: 'contain' },
                                                { label: 'Custom', value: 'custom' }
                                            ]}
                                            onChange={val => {
                                                value.backgroundOptions[selector].sizeOptions.size = val;
                                                saveAndSend();
                                            }}
                                        />
                                        {
                                            value.backgroundOptions[selector].sizeOptions.size === 'custom' &&
                                            <Fragment>
                                                <MiniSizeControl
                                                    unit={value.backgroundOptions[selector].sizeOptions.widthUnit}
                                                    onChangeUnit={val => {
                                                        value.backgroundOptions[selector].sizeOptions.widthUnit = val;
                                                        saveAndSend();
                                                    }}
                                                    value={value.backgroundOptions[selector].sizeOptions.width}
                                                    onChangeValue={val => {
                                                        value.backgroundOptions[selector].sizeOptions.width = val;
                                                        saveAndSend();
                                                    }}
                                                />
                                                <MiniSizeControl
                                                    unit={value.backgroundOptions[selector].sizeOptions.heightUnit}
                                                    onChangeUnit={val => {
                                                        value.backgroundOptions[selector].sizeOptions.heightUnit = val;
                                                        saveAndSend();
                                                    }}
                                                    value={value.backgroundOptions[selector].sizeOptions.height}
                                                    onChangeValue={val => {
                                                        value.backgroundOptions[selector].sizeOptions.height = val;
                                                        saveAndSend();
                                                    }}
                                                />
                                            </Fragment>
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
                                                saveAndSend();
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
                                                saveAndSend();
                                            }}
                                        />
                                        {
                                            value.backgroundOptions[selector].positionOptions.position === 'custom' &&
                                            <Fragment>
                                                <MiniSizeControl
                                                    unit={value.backgroundOptions[selector].positionOptions.widthUnit}
                                                    onChangeUnit={val => {
                                                        value.backgroundOptions[selector].positionOptions.widthUnit = val;
                                                        saveAndSend();
                                                    }}
                                                    value={value.backgroundOptions[selector].positionOptions.width}
                                                    onChangeValue={val => {
                                                        value.backgroundOptions[selector].positionOptions.width = val;
                                                        saveAndSend();
                                                    }}
                                                />
                                                <MiniSizeControl
                                                    unit={value.backgroundOptions[selector].positionOptions.heightUnit}
                                                    onChangeUnit={val => {
                                                        value.backgroundOptions[selector].positionOptions.heightUnit = val;
                                                        saveAndSend();
                                                    }}
                                                    value={value.backgroundOptions[selector].positionOptions.height}
                                                    onChangeValue={val => {
                                                        value.backgroundOptions[selector].positionOptions.height = val;
                                                        saveAndSend();
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
                                                saveAndSend();
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
                                                saveAndSend();
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
                                                saveAndSend();
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