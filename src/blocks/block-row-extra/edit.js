/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { synchronizeBlocksWithTemplate } = wp.blocks;
const {
    select,
    dispatch,
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
import { isNil } from 'lodash';
/**
 * Edit
 */
const ALLOWED_BLOCKS = ['gutenberg-extra/block-column-extra'];

class edit extends GXBlock {

    componentDidMount() {
        this.uniqueIDChecker(this.props.attributes.uniqueID);
        this.setStyles();
    }

    componentDidUpdate() {
        this.setStyles();
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
            loadTemplate,
            clientId,
            setAttributes,
            className,
        } = this.props;

        let classes = classnames('gx-block gx-row-block', blockStyle, extraClassName, className);

        /**
         * Fix no selecting block issue when clicking on the button 
         * 
         * @param {object} e Clicked object properties
         */
        const selecOnClick = e => {
            const rowBlockId = e.target.closest('[data-type="gutenberg-extra/block-row-extra"]').getAttribute('data-block');
            dispatch('core/editor').selectBlock(rowBlockId);
        }

        /**
         * Check if InnerBlock contains other blocks
         */
        const hasInnerBlock = () => {
            return select('core/block-editor').getBlockOrder(clientId).length >= 1;
        }

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
            <div className={classes}>
                <span className="gx-row-selector">
                    ROW
                </span>
                <InnerBlocks
                    templateLock={false}
                    allowedBlocks={ALLOWED_BLOCKS}
                    renderAppender={
                        !hasInnerBlock() ?
                            () => (
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
                            ) :
                            false
                    }
                />
            </div>
        ];
    }
}

export default withDispatch((dispatch, ownProps) => {
    const { clientId } = ownProps;

    const loadTemplate = async (i, callback) => {
        const template = TEMPLATES[i];

        const newTemplate = synchronizeBlocksWithTemplate([], template.content);
        dispatch('core/block-editor').replaceInnerBlocks(clientId, newTemplate);

        const newAttributes = template.attributes;
        dispatch('core/block-editor').updateBlockAttributes(clientId, newAttributes)
            .then(() => callback());
    }

    return {
        loadTemplate
    }
})(edit)