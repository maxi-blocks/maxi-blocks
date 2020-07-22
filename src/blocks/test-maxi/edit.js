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
    getOpacityObject
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
        }

        return response;
    }

    get getNormalObject() {
        const {
            alignment,
        } = this.props.attributes;

        const response = {
            alignment: { ...getAlignmentTextObject(JSON.parse(alignment)) },
        };

        return response;
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