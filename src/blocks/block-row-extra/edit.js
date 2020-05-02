/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { synchronizeBlocksWithTemplate } = wp.blocks;
const { compose } = wp.compose;
const {
    select,
    dispatch,
    withSelect,
    withDispatch
} = wp.data;
const {
    PanelBody,
    BaseControl,
    Button,
    Icon,
    SelectControl,
    RangeControl,
} = wp.components;
const {
    InspectorControls,
    InnerBlocks
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import {
    GXBlock,
    AccordionControl,
    BackgroundControl,
    BlockStylesControl,
    BorderControl,
    BoxShadowControl,
    CheckBoxControl,
    DimensionsControl,
    CustomCSSControl,
    FullSizeControl,
    HoverAnimationControl,
} from '../../components';
import TEMPLATES from './templates';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isEmpty,
    isNil,
    uniqueId,
    uniqBy,
    isEqual
} from 'lodash';

/**
 * Edit
 */
const ALLOWED_BLOCKS = ['gutenberg-extra/block-column-extra'];

class edit extends GXBlock {
    state = {
        selectorBlocks: [],
    }

    componentDidMount() {
        this.uniqueIDChecker(this.props.attributes.uniqueID);
        this.setStyles();
    }

    componentDidUpdate() {
        this.setStyles();
        this.setSelectorBlocks()
    }

    setSelectorBlocks() {
        const {
            originalNestedBlocks,
            selectedBlockId
        } = this.props;

        if (isNil(originalNestedBlocks))
            return

        let selectorBlockList = [];
        if (!isNil(selectedBlockId)) {
            selectorBlockList = [...originalNestedBlocks, selectedBlockId]
        }

        if (
            !isEqual(this.state.selectorBlocks, selectorBlockList)
        )
            setTimeout(() => {          // Should find an alternative       
                this.setState({ selectorBlocks: selectorBlockList });
            }, 10);
    }

    /**
     * Retrieve the target for responsive CSS
     */
    get getTarget() {
        return this.target;
    }

    get getObject() {
        if (this.type === 'columns')
            return this.getColumnObject
        if (this.type === 'row')
            return this.getRowObject
    }

    get getColumnObject() {
        const { columnGap } = this.props.attributes;

        return {
            label: "Columns margin",
            general: {
                margin: `0 ${columnGap}%`
            }
        };
    }

    get getRowObject() {
        const {
            horizontalAlign,
            verticalAlign
        } = this.props.attributes;

        return {
            label: "Row align",
            general: {
                'justify-content': horizontalAlign,
                'align-content': verticalAlign
            }
        };
    }

    /**
    * Refresh the styles on Editor
    */
    displayStyles(type) {
        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: this.metaValue(null, type),
            },
        });
    }

    /**
     * Set styles for row and columns
     */
    setStyles() {
        const columnWrapper = document.querySelector(`.wp-block[uniqueid="${this.props.attributes.uniqueID}"] .block-editor-block-list__layout`);
        if (!columnWrapper)
            return;

        const columns = columnWrapper.childNodes;

        columns.forEach(column => {
            if (isNil(column.getAttribute('uniqueid')))
                return;

            this.target = `${column.getAttribute('uniqueid')}`;
            this.displayStyles('columns');
        })

        this.target = `${this.props.attributes.uniqueID}`;
        this.displayStyles('row');

        // This should be improved: fixes have same styling on front and backend, but on different targets
        this.target = `${this.props.attributes.uniqueID}>div>div.block-editor-block-list__layout`;
        this.displayStyles('row');

        new BackEndResponsiveStyles(this.getMeta);
    }

    render() {
        const {
            attributes: {
                blockStyle,
                defaultBlockStyle,
                columnGap,
                syncColumns,
                horizontalAlign,
                verticalAlign,
                background,
                boxShadow,
                border,
                size,
                padding,
                margin,
                hoverAnimation,
                hoverAnimationDuration,
                extraClassName,
                extraStyles
            },
            clientId,
            loadTemplate,
            selectOnClick,
            hasInnerBlock,
            setAttributes,
            className,
        } = this.props;

        const { selectorBlocks } = this.state;

        let classes = classnames('gx-block gx-row-block', blockStyle, extraClassName, className);

        return [
            <InspectorControls>
                <PanelBody
                    className="gx-panel gx-image-setting gx-content-tab-setting"
                    initialOpen={true}
                    // why this vvvv title?
                    title={__('Image Settings', 'gutenberg-extra')}
                >
                    <BlockStylesControl
                        blockStyle={blockStyle}
                        onChangeBlockStyle={blockStyle => setAttributes({ blockStyle })}
                        defaultBlockStyle={defaultBlockStyle}
                        onChangeDefaultBlockStyle={defaultBlockStyle => setAttributes({ defaultBlockStyle })}
                    />
                    <RangeControl
                        label={__('Column gap', 'gutenberg-extra')}
                        value={columnGap}
                        onChange={columnGap => setAttributes({ columnGap })}
                        step={.1}
                    />
                    <CheckBoxControl
                        label={__('Syncronize Columns', 'gutenberg-extra')}
                        checked={syncColumns}
                        onChange={syncColumns => setAttributes({ syncColumns })}
                    />
                    <SelectControl
                        label={__('Horizontal align', 'gutenberg-extra')}
                        value={horizontalAlign}
                        options={
                            [
                                { label: 'Flex-start', value: 'flex-start' },
                                { label: 'Flex-end', value: 'flex-end' },
                                { label: 'Center', value: 'center' },
                                { label: 'Space between', value: 'space-between' },
                                { label: 'Space around', value: 'space-around' },
                            ]
                        }
                        onChange={horizontalAlign => setAttributes({ horizontalAlign })}
                    />
                    <SelectControl
                        label={__('Vertical align', 'gutenberg-extra')}
                        value={verticalAlign}
                        options={
                            [
                                { label: 'Stretch', value: 'stretch' },
                                { label: 'Flex-start', value: 'flex-start' },
                                { label: 'Flex-end', value: 'flex-end' },
                                { label: 'Center', value: 'center' },
                                { label: 'Space between', value: 'space-between' },
                                { label: 'Space around', value: 'space-around' },
                            ]
                        }
                        onChange={verticalAlign => setAttributes({ verticalAlign })}
                    />
                </PanelBody>
                <PanelBody
                    className="gx-panel gx-image-setting gx-style-tab-setting"
                    initialOpen={true}
                    // why this vvvv title?
                    title={__('Image Settings', 'gutenberg-extra')}
                >
                    <AccordionControl
                        isPrimary
                        items={[
                            {
                                label: __('Background Image', 'gutenberg-extra'),
                                classNameHeading: 'gx-backgroundsettings-tab',
                                //icon: image,
                                content: (
                                    <BackgroundControl
                                        backgroundOptions={background}
                                        onChange={background => setAttributes({ background })}
                                    // target="gx-row-block"
                                    />
                                ),
                            },
                            {
                                label: __('Box Settings', 'gutenberg-extra'),
                                classNameItem: 'gx-box-settings-item',
                                classNameHeading: 'gx-box-settings-tab',
                                //icon: boxSettings,
                                content: (
                                    <Fragment>
                                        <PanelBody
                                            className={'gx-panel gx-color-setting gx-style-tab-setting'}
                                        >
                                            <BaseControl
                                                className={"bg-color-parent gx-reset-button background-gradient"}
                                            >
                                                <BoxShadowControl
                                                    boxShadowOptions={boxShadow}
                                                    onChange={boxShadow => setAttributes({ boxShadow })}
                                                // target="gx-row-block"
                                                />
                                            </BaseControl>
                                            <hr style={{ marginTop: "28px" }} />
                                            <BorderControl
                                                borderOptions={border}
                                                onChange={border => setAttributes({ border })}
                                                // target="gx-row-block"
                                                avoidZero={false}
                                            />
                                        </PanelBody>
                                    </Fragment>
                                ),
                            },
                            {
                                label: __(' Width / Height', 'gutenberg-extra'),
                                classNameItem: 'gx-width-height-item',
                                classNameHeading: 'gx-width-height-tab',
                                //icon: width,
                                content: (
                                    // Is this vvv PanelBody element necessary?
                                    <PanelBody
                                        className="gx-panel gx-size-setting gx-style-tab-setting"
                                        initialOpen={true}
                                        title={__('Size Settings', 'gutenberg-extra')}
                                    >
                                        <FullSizeControl
                                            sizeSettings={size}
                                            onChange={size => setAttributes({ size })}
                                        // target="gx-row-block"
                                        />
                                    </PanelBody>
                                ),
                            },
                            {
                                label: __('Padding & Margin', 'gutenberg-extra'),
                                classNameItem: 'gx-padding-margin-item',
                                classNameHeading: 'gx-padding-tab',
                                //icon: iconPadding,
                                content: (
                                    <PanelBody
                                        className="gx-panel gx-space-setting gx-style-tab-setting"
                                        initialOpen={true}
                                        // why this vvvv title?
                                        title={__('Space Settings', 'gutenberg-extra')}
                                    >
                                        <DimensionsControl
                                            value={padding}
                                            onChange={padding => setAttributes({ padding })}
                                            avoidZero
                                        // target="gx-row-block"
                                        />
                                        <DimensionsControl
                                            value={margin}
                                            onChange={margin => setAttributes({ margin })}
                                            avoidZero
                                        // target="gx-row-block"
                                        />
                                    </PanelBody>
                                ),
                            }
                        ]}
                    />
                </PanelBody>
                <PanelBody
                    initialOpen={true}
                    className="gx-panel gx-advanced-setting gx-advanced-tab-setting"
                    title={__('Advanced Settings', 'gutenberg-extra')}
                >
                    <HoverAnimationControl
                        hoverAnimation={hoverAnimation}
                        onChangeHoverAnimation={hoverAnimation => setAttributes({ hoverAnimation })}
                        hoverAnimationDuration={hoverAnimationDuration}
                        onChangeHoverAnimationDuration={hoverAnimationDuration => setAttributes({ hoverAnimationDuration })}
                    />
                    <CustomCSSControl
                        extraClassName={extraClassName}
                        onChangeExtraClassName={extraClassName => setAttributes({ extraClassName })}
                        extraStyles={extraStyles}
                        onChangeExtraStyles={extraStyles => setAttributes({ extraStyles })}
                    />
                </PanelBody>
            </InspectorControls>,
            <div
                className={classes}
            >
                {
                    selectorBlocks[0] === clientId &&
                    <div
                        className="gx-row-selector-wrapper"
                    >
                        {
                            !isNil(selectorBlocks) &&
                            selectorBlocks.map((blockId, i) => {
                                const blockName = wp.data.select('core/block-editor').getBlockName(blockId)
                                const blockType = wp.data.select('core/blocks').getBlockType(blockName);
                                const title = blockType.title;

                                return (
                                    <div
                                        className="gx-row-selector-item-wrapper"
                                    >
                                        {
                                            i != 0 &&
                                            <span> > </span>
                                        }
                                        <span
                                            className="gx-row-selector-item"
                                            target={blockId}
                                            onClick={e => {
                                                selectOnClick(blockId);
                                                this.setState
                                            }}
                                        >
                                            {title}
                                        </span>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
                <InnerBlocks
                    templateLock={false}
                    allowedBlocks={ALLOWED_BLOCKS}
                    renderAppender={
                        !hasInnerBlock() ?
                            () => (
                                <div
                                    class="gx-row-template-wrapper"
                                    onClick={() => selectOnClick(clientId)}
                                >
                                    {
                                        TEMPLATES.map((template, i) => {
                                            return (
                                                <Button
                                                    className="gx-row-template-button"
                                                    onClick={() => {
                                                        loadTemplate(i, this.setStyles.bind(this));
                                                    }}
                                                >
                                                    <Icon
                                                        className="gx-row-template-icon"
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
            </div>
        ];
    }
}

const editSelect = withSelect(select => {
    const selectedBlockId = select('core/block-editor').getSelectedBlockClientId();
    const originalNestedBlocks = select('core/block-editor').getBlockParents(selectedBlockId);

    return {
        selectedBlockId,
        originalNestedBlocks
    }
})

const editDispatch = withDispatch((dispatch, ownProps) => {
    const { clientId } = ownProps;

    /**
     * Creates uniqueID for columns on loading templates
     */
    const uniqueIdCreator = () => {
        const newID = uniqueId('gx-block-column-extra-');
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
    const loadTemplate = async (i, callback) => {
        const template = TEMPLATES[i];
        template.content.map(column => {
            column[1].uniqueID = uniqueIdCreator();
        })

        const newTemplate = synchronizeBlocksWithTemplate([], template.content);
        dispatch('core/block-editor').replaceInnerBlocks(clientId, newTemplate);

        const newAttributes = template.attributes;
        dispatch('core/block-editor').updateBlockAttributes(clientId, newAttributes)
            .then(() => callback());
    }

    /**
     * Block selector
     * 
     * @param {string} id Block id to select
     */
    const selectOnClick = (id) => {
        console.log(id)
        dispatch('core/editor').selectBlock(id);
    }

    /**
     * Check if InnerBlocks contains other blocks
     */
    const hasInnerBlock = () => {
        return select('core/block-editor').getBlockOrder(clientId).length >= 1; // hasChildBlocks ??
    }

    return {
        loadTemplate,
        selectOnClick,
        hasInnerBlock
    }
})

export default compose(
    editSelect,
    editDispatch
)(edit);