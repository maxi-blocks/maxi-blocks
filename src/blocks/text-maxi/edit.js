/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { select } = wp.data;
const {
    __unstableIndentListItems,
    __unstableOutdentListItems,
} = wp.richText;
const {
    __experimentalBlock,
    RichText,
    RichTextShortcut
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
    getBackgroundObject,
    getBoxShadowObject,
    getAlignmentTextObject,
    getOpacityObject,
    getTransfromObject
} from '../../extensions/styles/utils';
import {
    MaxiBlock,
    __experimentalToolbar
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Content
 */
class edit extends MaxiBlock {
    componentDidUpdate() {
        this.fullWidthSetter();
        this.displayStyles();

        if (!select('core/editor').isSavingPost() && this.state.updating) {
            this.setState({
                updating: false
            })
            this.saveProps();
        }
    }

    fullWidthSetter() {
        if (!!document.getElementById(`block-${this.props.clientId}`))
            document.getElementById(`block-${this.props.clientId}`).setAttribute('data-align', this.props.attributes.fullWidth);
    }

    get getObject() {
        let response = {
            [this.props.attributes.uniqueID]: this.getNormalObject,
            [`${this.props.attributes.uniqueID}:hover`]: this.getHoverObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover .maxi-block-text-hover__content`]: this.getHoverAnimationTextContentObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover .maxi-block-text-hover__title`]: this.getHoverAnimationTextTitleObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover`]: this.getHoverAnimationMainObject,
            [`${this.props.attributes.uniqueID}.hover-animation-basic.hover-animation-type-opacity:hover .hover_el`]: this.getHoverAnimationTypeOpacityObject,
            [`${this.props.attributes.uniqueID}.hover-animation-basic.hover-animation-type-opacity-with-colour:hover .hover_el:before`]: this.getHoverAnimationTypeOpacityColorObject,
        }

        return response;
    }

    get getNormalObject() {
        const {
            alignment,
            typography,
            background,
            opacity,
            boxShadow,
            border,
            size,
            margin,
            padding,
            hoverPadding,
            zIndex,
            position,
            display,
            transform
        } = this.props.attributes;

        const response = {
            typography: { ...JSON.parse(typography) },
            alignment: { ...getAlignmentTextObject(JSON.parse(alignment)) },
            background: { ...getBackgroundObject(JSON.parse(background)) },
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            border: { ...JSON.parse(border) },
            borderWidth: { ...JSON.parse(border).borderWidth },
            borderRadius: { ...JSON.parse(border).borderRadius },
            size: { ...JSON.parse(size) },
            margin: { ...JSON.parse(margin) },
            padding: { ...JSON.parse(padding) },
            opacity: { ...getOpacityObject(JSON.parse(opacity)) },
            zindex: { ...JSON.parse(zIndex) },
            position: { ...JSON.parse(position) },
            positionOptions: { ...JSON.parse(position).options },
            display: { ...JSON.parse(display) },
            transform: { ...getTransfromObject(JSON.parse(transform)) }
        };

        return response;
    }

    get getHoverObject() {
        const {
            typographyHover,
            backgroundHover,
            opacityHover,
            boxShadowHover,
            borderHover,
        } = this.props.attributes;

        const response = {
            typographyHover: { ...JSON.parse(typographyHover) },
            backgroundHover: { ...getBackgroundObject(JSON.parse(backgroundHover)) },
            boxShadowHover: { ...getBoxShadowObject(JSON.parse(boxShadowHover)) },
            borderHover: { ...JSON.parse(borderHover) },
            borderWidth: { ...JSON.parse(borderHover).borderWidth },
            borderRadius: { ...JSON.parse(borderHover).borderRadius },
            opacity: { ...getOpacityObject(JSON.parse(opacityHover)) },
        };

        return response;
    }

    get getHoverAnimationMainObject() {
        const {
            hoverOpacity,
            hoverBackground,
            hoverBorder,
            hoverPadding,
        } = this.props.attributes;

        const response = {
            background: { ...getBackgroundObject(JSON.parse(hoverBackground)) },
            border: { ...JSON.parse(hoverBorder) },
            borderWidth: { ...JSON.parse(hoverBorder).borderWidth },
            borderRadius: { ...JSON.parse(hoverBorder).borderRadius },
            padding: { ...JSON.parse(hoverPadding) },
            opacity: { ...getOpacityObject(hoverOpacity) },
        };

        return response
    }

    get getHoverAnimationTypeOpacityObject() {
        const {
            hoverAnimationTypeOpacity,
        } = this.props.attributes;

        const response = {
            animationTypeOpacityHover: {
                label: 'Animation Type Opacity Hover',
                general: {}
            }
        };

        if (hoverAnimationTypeOpacity)
            response.animationTypeOpacityHover.general['opacity'] = hoverAnimationTypeOpacity;

        return response
    }

    get getHoverAnimationTypeOpacityColorObject() {
        const {
            hoverAnimationTypeOpacityColor,
            hoverAnimationTypeOpacityColorBackground,
        } = this.props.attributes;

        const response = {
            background: { ...getBackgroundObject(JSON.parse(hoverAnimationTypeOpacityColorBackground)) },
            animationTypeOpacityHoverColor: {
                label: 'Animation Type Opacity Color Hover',
                general: {}
            }
        };

        if (hoverAnimationTypeOpacityColor)
            response.animationTypeOpacityHoverColor.general['opacity'] = hoverAnimationTypeOpacityColor;

        return response
    }


    get getHoverAnimationTextTitleObject() {
        const {
            hoverAnimationTitleTypography
        } = this.props.attributes;

        const response = {
            hoverAnimationTitleTypography: { ...JSON.parse(hoverAnimationTitleTypography) },
            hoverAnimationTitleAlignmentTypography: { ...getAlignmentTextObject(JSON.parse(hoverAnimationTitleTypography).textAlign) }
        };

        return response
    }

    get getHoverAnimationTextContentObject() {
        const {
            hoverAnimationContentTypography
        } = this.props.attributes;

        const response = {
            hoverAnimationContentTypography: { ...JSON.parse(hoverAnimationContentTypography) },
            hoverAnimationContentAlignmentTypography: { ...getAlignmentTextObject(JSON.parse(hoverAnimationContentTypography).textAlign) }
        };

        return response
    }

    render() {
        const {
            className,
            attributes: {
                uniqueID,
                blockStyle,
                extraClassName,
                hoverAnimation,
                hoverAnimationDuration,
                hoverAnimationType,
                hoverAnimationTypeText,
                textLevel,
                content,
                isList,
                typeOfList,
                listStart,
                listReversed,
            },
            isSelected,
            setAttributes,
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-text-block',
            blockStyle,
            extraClassName,
            'hover-animation-' + hoverAnimation,
            'hover-animation-type-' + hoverAnimationType,
            'hover-animation-type-text-' + hoverAnimationTypeText,
            'hover-animation-duration-' + hoverAnimationDuration,
            uniqueID,
            className
        );

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props} />,
            <Fragment>
                {
                    !isList &&
                    <RichText
                        value={content}
                        onChange={content => setAttributes({ content })}
                        tagName={__experimentalBlock[textLevel]}
                        className={classes}
                        placeholder={__('Set your Maxi Text here...', 'maxi-blocks')}
                        keepPlaceholderOnFocus
                        __unstableEmbedURLOnPaste
                        __unstableAllowPrefixTransformations
                    />
                }
                {
                    isList &&
                    <RichText
                        className={classes}
                        identifier="values"
                        multiline="li"
                        __unstableMultilineRootTag={typeOfList}
                        tagName={__experimentalBlock[typeOfList]}
                        onChange={content => setAttributes({ content })}
                        value={content}
                        placeholder={__('Write list…')}
                        // onMerge={mergeBlocks}
                        onSplit={(value) =>
                            createBlock(name, { ...attributes, values: value })
                        }
                        __unstableOnSplitMiddle={() =>
                            createBlock('core/paragraph')
                        }
                        // onReplace={onReplace}
                        // onRemove={() => onReplace([])}
                        start={listStart}
                        reversed={!!listReversed}
                        type={typeOfList}
                    >
                        {
                            ({ value, onChange, onFocus }) => {
                                if (isSelected)
                                    return (
                                        <Fragment>
                                            <RichTextShortcut
                                                type="primary"
                                                character="["
                                                onUse={() => {
                                                    onChange(__unstableOutdentListItems(value));
                                                }}
                                            />
                                            <RichTextShortcut
                                                type="primary"
                                                character="]"
                                                onUse={() => {
                                                    onChange(
                                                        __unstableIndentListItems(value, { type: typeOfList })
                                                    );
                                                }}
                                            />
                                            <RichTextShortcut
                                                type="primary"
                                                character="m"
                                                onUse={() => {
                                                    onChange(
                                                        __unstableIndentListItems(value, { type: typeOfList })
                                                    );
                                                }}
                                            />
                                            <RichTextShortcut
                                                type="primaryShift"
                                                character="m"
                                                onUse={() => {
                                                    onChange(__unstableOutdentListItems(value));
                                                }}
                                            />
                                        </Fragment>
                                    )
                            }
                        }
                    </RichText>
                }
            </Fragment>
        ];
    }
}

export default edit;