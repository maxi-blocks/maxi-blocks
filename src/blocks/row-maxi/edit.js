/**
 * WordPress dependencies
 */
const { synchronizeBlocksWithTemplate } = wp.blocks;
const { forwardRef } = wp.element;
const {
    compose,
    withInstanceId
} = wp.compose;
const {
    withSelect,
    withDispatch
} = wp.data;
const {
    Button,
    Icon,
} = wp.components;
const {
    InnerBlocks,
    __experimentalBlock
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import {
    MaxiBlock,
    __experimentalToolbar,
    __experimentalBreadcrumbs,
    __experimentalBackgroundDisplayer
} from '../../components';
import Inspector from './inspector';
import TEMPLATES from '../../extensions/defaults/column-templates';
import {
    getBackgroundObject,
    getBoxShadowObject,
    getOpacityObject,
    getTransfromObject,
    getAlignmentTextObject,
    setBackgroundStyles
} from '../../utils'

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isEmpty,
    isNil,
    uniqueId,
} from 'lodash';

/**
 * InnerBlocks version
 */
const ContainerInnerBlocks = forwardRef((props, ref) => {
    const {
        children,
        background,
        className,
        maxiBlockClass
    } = props;

    return (
        <__experimentalBlock.div
            ref={ref}
            className={className}
            data-gx_initial_block_class={maxiBlockClass}
        >
            <__experimentalBackgroundDisplayer
                background={background}
            />
            {children}
        </__experimentalBlock.div>
    )
})

/**
 * Edit
 */
const ALLOWED_BLOCKS = ['maxi-blocks/column-maxi'];

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
        }

        response = Object.assign(
            response,
            setBackgroundStyles(uniqueID, background, backgroundHover)
        )

        return response;
    }

    get getNormalObject() {
        const {
            horizontalAlign,
            verticalAlign,
            opacity,
            border,
            size,
            boxShadow,
            margin,
            padding,
            zIndex,
            position,
            display,
            transform
        } = this.props.attributes;

        let response = {
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            border: { ...JSON.parse(border) },
            borderWidth: { ...JSON.parse(border).borderWidth },
            borderRadius: { ...JSON.parse(border).borderRadius },
            size: { ...JSON.parse(size) },
            margin: { ...JSON.parse(margin) },
            padding: { ...JSON.parse(padding) },
            opacity: { ...getOpacityObject(JSON.parse(opacity)) },
            zIndex: { ...JSON.parse(zIndex) },
            position: { ...JSON.parse(position) },
            positionOptions: { ...JSON.parse(position).options },
            display: { ...JSON.parse(display) },
            transform: { ...getTransfromObject(JSON.parse(transform)) },
            row: {
                label: "Row",
                general: {},
            },
        };

        if (!isNil(horizontalAlign))
            response.row.general['justify-content'] = horizontalAlign;
        if (!isNil(verticalAlign))
            response.row.general['align-items'] = verticalAlign;

        return response;
    }

    get getHoverObject() {
        const {
            opacityHover,
            boxShadowHover,
            borderHover,
        } = this.props.attributes;

        let response = {
            boxShadowHover: { ...getBoxShadowObject(JSON.parse(boxShadowHover)) },
            borderHover: { ...JSON.parse(borderHover) },
            borderWidthHover: { ...JSON.parse(borderHover).borderWidth },
            borderRadiusHover: { ...JSON.parse(borderHover).borderRadius },
            opacity: { ...getOpacityObject(JSON.parse(opacityHover)) },
        };

        return response;
    }

    render() {
        const {
            attributes: {
                uniqueID,
                blockStyle,
                extraClassName,
                defaultBlockStyle,
                fullWidth,
                background,
            },
            clientId,
            loadTemplate,
            selectOnClick,
            hasInnerBlock,
            className,
            setAttributes,
            instanceId
        } = this.props;

        const classes = classnames(
            'maxi-block maxi-row-block',
            uniqueID,
            blockStyle,
            extraClassName,
            className,
        );

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props} />,
            <__experimentalBreadcrumbs />,
            <InnerBlocks
                // templateLock={'insert'}
                __experimentalTagName={ContainerInnerBlocks}
                __experimentalPassedProps={{
                    className: classes,
                    maxiBlockClass: defaultBlockStyle,
                    background: background,
                }}
                allowedBlocks={ALLOWED_BLOCKS}
                orientation="horizontal"
                renderAppender={
                    !hasInnerBlock ?
                        () => (
                            <div
                                className="maxi-row-block__template"
                                onClick={() => selectOnClick(clientId)}
                                key={`maxi-row-block--${instanceId}`}
                            >
                                {
                                    TEMPLATES.map((template, i) => {
                                        return (
                                            <Button
                                                className="maxi-row-block__template__button"
                                                onClick={() => {
                                                    setAttributes({ rowPattern: i });
                                                    loadTemplate(i);
                                                }}
                                            >
                                                <Icon
                                                    className="maxi-row-block__template__icon"
                                                    icon={template.icon}
                                                />
                                            </Button>
                                        )
                                    })
                                }
                            </div>
                        ) :
                        false
                }
            />
        ];
    }
}

const editSelect = withSelect((select, ownProps) => {
    const { clientId } = ownProps

    const selectedBlockId = select('core/block-editor').getSelectedBlockClientId();
    const originalNestedBlocks = select('core/block-editor').getBlockParents(selectedBlockId);
    const hasInnerBlock = !isEmpty(select('core/block-editor').getBlockOrder(clientId));
    let deviceType = select('core/edit-post').__experimentalGetPreviewDeviceType();
    deviceType = deviceType === 'Desktop' ?
        'general' :
        deviceType;

    return {
        selectedBlockId,
        originalNestedBlocks,
        hasInnerBlock,
        deviceType
    }
})

const editDispatch = withDispatch((dispatch, ownProps) => {
    const {
        clientId,
    } = ownProps;

    /**
     * Creates uniqueID for columns on loading templates
     */
    const uniqueIdCreator = () => {
        const newID = uniqueId('maxi-column-maxi-');
        if (!isEmpty(document.getElementsByClassName(newID)) || !isNil(document.getElementById(newID)))
            uniqueIdCreator();

        return newID;
    }

    /**
     * Loads template into InnerBlocks
     *
     * @param {integer} i Element of object TEMPLATES
     * @param {function} callback
     */
    const loadTemplate = i => {
        const template = TEMPLATES[i];
        template.content.map(column => {
            column[1].uniqueID = uniqueIdCreator();
        })

        const newAttributes = template.attributes;
        dispatch('core/block-editor').updateBlockAttributes(clientId, newAttributes);

        const newTemplate = synchronizeBlocksWithTemplate([], template.content);
        dispatch('core/block-editor').replaceInnerBlocks(clientId, newTemplate);
    }

    /**
     * Block selector
     *
     * @param {string} id Block id to select
     */
    const selectOnClick = (id) => {
        dispatch('core/editor').selectBlock(id);
    }

    return {
        loadTemplate,
        selectOnClick,
    }
})

export default compose(
    editSelect,
    editDispatch,
    withInstanceId
)(edit);