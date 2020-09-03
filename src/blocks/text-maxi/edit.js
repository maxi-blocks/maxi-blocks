/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { createBlock, getBlockAttributes } = wp.blocks;
const { dispatch, select } = wp.data;
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
import defaultTypography from '../../extensions/defaults/typography';
import Inspector from './inspector';
import {
    getBoxShadowObject,
    getAlignmentTextObject,
    getOpacityObject,
    getTransfromObject,
    setBackgroundStyles,
} from '../../utils';
import {
    MaxiBlock,
    __experimentalToolbar,
    __experimentalBackgroundDisplayer
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlock {
    get getObject() {
        const {
            uniqueID,
            background,
            backgroundHover
        } = this.props.attributes;

        let response = {
            [uniqueID]: this.getNormalObject,
            [`${uniqueID}:hover`]: this.getHoverObject,
            [`${uniqueID} .maxi-text-block__content`]: this.getTypographyObject,
            [`${uniqueID} .maxi-text-block__content:hover`]: this.getTypographyHoverObject,
            [`${uniqueID} .maxi-text-block__content li`]: this.getTypographyObject,
            [`${uniqueID} .maxi-text-block__content li:hover`]: this.getTypographyHoverObject,
        }

        response = Object.assign(
            response,
            setBackgroundStyles(uniqueID, background, backgroundHover)
        )

        return response;
    }

    get getNormalObject() {
        const {
            alignment,
            opacity,
            boxShadow,
            border,
            size,
            zIndex,
            position,
            display,
            transform
        } = this.props.attributes;

        const response = {
            alignment: { ...getAlignmentTextObject(JSON.parse(alignment)) },
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            border: { ...JSON.parse(border) },
            borderWidth: { ...JSON.parse(border).borderWidth },
            borderRadius: { ...JSON.parse(border).borderRadius },
            size: { ...JSON.parse(size) },
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
            opacityHover,
            boxShadowHover,
            borderHover,
        } = this.props.attributes;

        const response = {
            boxShadowHover: { ...getBoxShadowObject(JSON.parse(boxShadowHover)) },
            borderHover: { ...JSON.parse(borderHover) },
            borderWidth: { ...JSON.parse(borderHover).borderWidth },
            borderRadius: { ...JSON.parse(borderHover).borderRadius },
            opacity: { ...getOpacityObject(JSON.parse(opacityHover)) },
        };

        return response;
    }

    get getTypographyObject() {
        const {
            typography,
            margin,
            padding
        } = this.props.attributes;

        const response = {
            typography: { ...JSON.parse(typography) },
            margin: { ...JSON.parse(margin) },
            padding: { ...JSON.parse(padding) },
        }

        return response;
    }

    get getTypographyHoverObject() {
        const { typographyHover } = this.props.attributes;

        const response = {
            typographyHover: { ...JSON.parse(typographyHover) },
        }

        return response;
    }

    render() {
        const {
            attributes: {
                uniqueID,
                blockStyle,
                defaultBlockStyle,
                extraClassName,
                background,
                textLevel,
                content,
                isList,
                typeOfList,
                listStart,
                listReversed,
                fullWidth,
                typography,
            },
            className,
            isSelected,
            setAttributes,
            onRemove,
            onReplace,
            clientId
        } = this.props;

        const name = 'maxi-blocks/text-maxi';

        const classes = classnames(
            'maxi-block maxi-text-block',
            blockStyle,
            extraClassName,
            uniqueID,
            className
        );

        const {
            getBlockIndex,
            getBlockRootClientId,
            getNextBlockClientId,
            getPreviousBlockClientId,
            getBlockAttributes
        } = select('core/block-editor');

        const {
            insertBlock,
            removeBlock,
            selectBlock,
            updateBlockAttributes,
        } = dispatch('core/block-editor');

        const onReplaceTest = (blocks) => {
            const currentBlocks = blocks.filter(item => !!item);

            if (isEmpty(currentBlocks)) {
                insertBlock(createBlock(
                    name,
                    getBlockAttributes(name)
                ));
                return;
            }

            currentBlocks.map((block, i) => {
                let newBlock = {};
                if (block.name === 'core/list') {
                    newBlock = createBlock(
                        name,
                        {
                            ...this.props.attributes,
                            textLevel: 'ul',
                            content: block.attributes.values,
                            isList: true,
                        }
                    );
                }
                else if (block.attributes.isList) {
                    newBlock = createBlock(
                        name,
                        {
                            ...block.attributes
                        }
                    );
                }
                else {
                    newBlock = createBlock(
                        name,
                        {
                            ...this.props.attributes,
                            textLevel: (block.name === 'core/heading') ?
                                `h${block.attributes.level}` :
                                'p',
                            content: block.attributes.content,
                            typography: (block.name === 'core/heading') ?
                                JSON.stringify(Object.assign(JSON.parse(typography), defaultTypography[`h${block.attributes.level}`])) :
                                typography,
                            isList: false
                        }
                    )
                }

                insertBlock(newBlock, getBlockIndex(clientId), getBlockRootClientId(clientId))

                i === currentBlocks.length - 1 &&
                    selectBlock(block.clientId);
            })

            removeBlock(clientId);
        }

        const onMerge = forward => {
            if (forward) {
                const nextBlockClientId = getNextBlockClientId(
                    clientId
                );

                if (!!nextBlockClientId) {
                    const nextBlockAttributes = getBlockAttributes(
                        nextBlockClientId
                    )
                    const nextBlockContent = nextBlockAttributes.content;

                    setAttributes(
                        {
                            content: content.concat(nextBlockContent)
                        }
                    )

                    removeBlock(nextBlockClientId)
                }
            }
            else {
                const previousBlockClientId = getPreviousBlockClientId(
                    clientId
                );

                if (!previousBlockClientId) {
                    removeBlock(clientId)
                }
                else {
                    const previousBlockAttributes = getBlockAttributes(
                        previousBlockClientId
                    )
                    const previousBlockContent = previousBlockAttributes.content;

                    updateBlockAttributes(
                        previousBlockClientId,
                        {
                            content: previousBlockContent.concat(content)
                        }
                    )

                    removeBlock(clientId)
                }
            }
        }

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props} />,
            <__experimentalBlock
                className={classes}
                data-maxi_initial_block_class={defaultBlockStyle}
                data-align={fullWidth}
            >
                <__experimentalBackgroundDisplayer
                    backgroundOptions={background}
                />
                {
                    !isList &&
                    <RichText
                        className='maxi-text-block__content'
                        value={content}
                        onChange={content => setAttributes({ content })}
                        tagName={textLevel}
                        onSplit={value => {
                            if (!value) {
                                return createBlock(name);
                            }

                            return createBlock(name, {
                                ...this.props.attributes,
                                content: value,
                            });
                        }}
                        onReplace={onReplaceTest}
                        onMerge={onMerge}
                        onRemove={onRemove}
                        placeholder={__('Set your Maxi Text here...', 'maxi-blocks')}
                        keepPlaceholderOnFocus
                        __unstableEmbedURLOnPaste
                        __unstableAllowPrefixTransformations
                    />
                }
                {
                    isList &&
                    <RichText
                        className='maxi-text-block__content'
                        identifier="content"
                        multiline="li"
                        __unstableMultilineRootTag={typeOfList}
                        tagName={typeOfList}
                        onChange={content => setAttributes({ content })}
                        value={content}
                        placeholder={__('Write list…', 'maxi-blocks')}
                        onMerge={onMerge}
                        onSplit={value => {
                            if (!value) {
                                return createBlock(name, {
                                    ...this.props.attributes,
                                    isList: false
                                });
                            }

                            return createBlock(name, {
                                ...this.props.attributes,
                                content: value,
                            });
                        }}
                        __unstableOnSplitMiddle={() => createBlock('maxi-blocks/text-maxi')}
                        onReplace={onReplaceTest}
                        onRemove={onRemove}
                        start={listStart}
                        reversed={!!listReversed}
                        type={typeOfList}
                    >
                        {
                            ({ value, onChange }) => {
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
            </__experimentalBlock>
        ];
    }
}

export default edit;