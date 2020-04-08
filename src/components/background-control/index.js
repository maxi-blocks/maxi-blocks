/**
 * - Background-blend-mode affects the global, not all the options
 * Leave it in the next situation
 * On opening the image uploader, the popover stays over it. For this incovenient, I was checking if it's 
 * possible to change the popover class while is open. For trying, I linked the action to '+' tab, but now needs
 * to be update on image-uploader component to have the trigger and so on :)
 */

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
    Button
} = wp.components;

/**
 * External dependencies
 */
import { PopoverControl } from '../popover';
import ColorControl from '../color-control';
import ImageControl from '../image-uploader';
import MiniSizeControl from '../mini-size-control/';

/**
 * Styles
 */
import'./editor.scss'

/**
 * Attributes
 */
export const backgroundControlAttributes = {
    backgroundOptions: {
        type: 'array',
        default: [
            {
                colorOptions: {
                    color: '',
                    gradient: '',
                    gradientAboveBackground: false
                },
                imageOptions: {
                    mediaID: ''
                },
                sizeOptions: {
                    size: 'auto',
                    widthUnit: '%',
                    width: '',
                    heightUnit: '%',
                    height: ''
                },
                clip: 'border-box',
                repeat: 'repeat',
                attachment: 'scroll',
                origin: 'padding-box',
                poisitionOptions: {
                    positon: 'center center',
                    widthUnit: '%',
                    width: '',
                    heightUnit: '%',
                    height: ''
                }
            }
        ]
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
            onChangeZIndex
        } = this.props;

        const {
            selector
        } = this.state;

        const onAddBackground = () => {
            backgroundOptions.push(
                {
                    colorOptions: {
                        color: '',
                        gradient: '',
                        gradientAboveBackground: false
                    },
                    imageOptions: {
                        mediaID: '',
                        mediaURL: ''
                    },
                    sizeOptions: {
                        size: 'auto',
                        widthUnit: '%',
                        width: '',
                        heightUnit: '%',
                        height: ''
                    },
                    clip: 'border-box',
                    repeat: 'repeat',
                    attachment: 'scroll',
                    origin: 'padding-box',
                    poisitionOptions: {
                        positon: 'center center',
                        widthUnit: '%',
                        width: '',
                        heightUnit: '%',
                        height: ''
                    }
                }
            );
            this.setState({ selector: backgroundOptions.length - 1})
            onChangeZIndex();
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
                                >
                                    {i}
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
                    <ColorControl
                        color={backgroundOptions[selector].colorOptions.color}
                        onColorChange={e => console.log(e)}
                        gradient={backgroundOptions[selector].colorOptions.gradient}
                        onGradientChange={e => console.log(e)}
                        gradientAboveBackground={backgroundOptions[selector].colorOptions.onGradientAboveBackground}
                        onChangeGradientAboveBackground={e => console.log(e)}
                    />
                    <ImageControl
                        label={__('Image Background', 'gutenberg-extra')}
                        mediaID={backgroundOptions[selector].imageOptions.mediaID}
                        onSelectImage={imageData => {
                            backgroundOptions[selector].imageOptions.mediaID = imadeData.id;
                            backgroundOptions[selector].imageOptions.mediaURL = imageData.url;
                            saveAndSend();
                        }}
                        onRemoveImage={() => {
                            backgroundOptions[selector].imageOptions.mediaID = '';
                            backgroundOptions[selector].imageOptions.mediaURL = '';
                            saveAndSend();
                        }}
                        modalClass="gx-backgroundoptions-mediauploader"
                    />
                    <SelectControl
                        label={__('Background size', 'gutenberg-extra')}
                        value={backgroundOptions[selector].sizeOptions.size}
                        options={[
                            { label: 'Auto', value: 'auto' },
                            { label: 'Cover', value: 'cover' },
                            { label: 'Contain', value: 'contain' },
                            { label: 'Custom', value: 'custom' }
                        ]}
                    />
                    {
                        backgroundOptions[selector].sizeOptions.size === 'custom' &&
                        <Fragment>
                            <MiniSizeControl
                                unit={backgroundOptions[selector].sizeOptions.widthUnit}
                                onChangeUnit={e => console.log(e)}
                                value={backgroundOptions[selector].sizeOptions.width}
                                onChangeValue={e => console.log(e)}
                            />
                            <MiniSizeControl
                                unit={backgroundOptions[selector].sizeOptions.heightUnit}
                                onChangeUnit={e => console.log(e)}
                                value={backgroundOptions[selector].sizeOptions.height}
                                onChangeValue={e => console.log(e)}
                            />
                        </Fragment>
                    }
                    <SelectControl
                        label={__('Background clip', 'gutenberg-extra')}
                        value={backgroundOptions[selector].clip}
                        options={[
                            { label: 'Border', value: 'border-box' },
                            { label: 'Padding', value: 'padding-box' },
                            { label: 'Content', value: 'content-box' },
                        ]}
                    />
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
                    />
                    <SelectControl
                        label={__('Background attachment', 'gutenberg-extra')}
                        value={backgroundOptions[selector].attachment}
                        options={[
                            { label: 'Scroll', value: 'scroll' },
                            { label: 'Fixed', value: 'fixed' },
                            { label: 'Local', value: 'local' },
                        ]}
                    />
                    <SelectControl
                        label={__('Background origin', 'gutenberg-extra')}
                        value={backgroundOptions[selector].origin}
                        options={[
                            { label: 'Padding', value: 'padding-box' },
                            { label: 'Border', value: 'border-box' },
                            { label: 'Content', value: 'content-box' },
                        ]}
                    />
                    <SelectControl
                        label={__('Background poisiton', 'gutenberg-extra')}
                        value={backgroundOptions[selector].poisitionOptions.poisition}
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
                    />
                    {
                        backgroundOptions[selector].poisitionOptions.poisition === 'custom' &&
                        <Fragment>
                            <MiniSizeControl
                                unit={backgroundOptions[selector].positionOptions.widthUnit}
                                onChangeUnit={e => console.log(e)}
                                value={backgroundOptions[selector].positionOptions.width}
                                onChangeValue={e => console.log(e)}
                            />
                            <MiniSizeControl
                                unit={backgroundOptions[selector].positionOptions.heightUnit}
                                onChangeUnit={e => console.log(e)}
                                value={backgroundOptions[selector].positionOptions.height}
                                onChangeValue={e => console.log(e)}
                            />
                        </Fragment>
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
            onChange
        } = this.props;

        const {
            modalIsOpen
        } = this.state;

        const classNamePopover = `gz-background-popover gx-popover ${modalIsOpen ? ' zm-1' : ''}`;
        console.log(classNamePopover)

        const onChangeZIndex = () => {
            this.setState({ modalIsOpen: !this.state.modalIsOpen})
        }
    
        return (
            <div className={className}>
                <PopoverControl
                    label={label}
                    className
                    showReset
                    onReset={e => console.log(e)}
                    popovers={[
                        {
                            content: (
                                <Fragment>
                                    <BackgroundOptions
                                        backgroundOptions={backgroundOptions}
                                        onChange={value => onChange(value)}
                                        onChangeZIndex={onChangeZIndex}
                                    />
                                    {/* <SelectControl
                                        label={__('Background blend mode', 'gutenberg-extra')}
                                        value={option.blendMode}
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
                                    /> */}
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