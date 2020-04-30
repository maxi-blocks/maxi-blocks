/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { compose } = wp.compose;
const {
    withSelect,
    withDispatch,
    select,
    dispatch
} = wp.data;
const {
    InnerBlocks,
    InspectorControls
} = wp.blockEditor;
const {
    PanelBody,
    RangeControl,
    BaseControl
} = wp.components;

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
    DimensionsControl,
    CustomCSSControl,
    FullSizeControl,
    HoverAnimationControl,
} from '../../components';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    pull,
    isNil,
    isNumber,
    isEmpty
} from 'lodash';

/**
 * Editor
 */
class edit extends GXBlock {

    componentDidMount() {
        this.uniqueIDChecker(this.props.attributes.uniqueID);
        this.displayStyles();
    }

    componentDidUpdate() {
        this.props.testCase(this.props.attributes);
        this.displayStyles();
    }

    /**
     * Retrieve the target for responsive CSS
     */
    get getTarget() {
        return `gx-block-wrapper[uniqueid="${this.props.attributes.uniqueID}"]`;
    }

    get getObject() {
        const {
            attributes: {
                sizeDesktop,
                sizeMobile,
                sizeTablet
            }
        } = this.props;
        let response = {
            label: "Column",
            desktop: {},
            tablet: {},
            mobile: {}
        };

        if (!isNil(sizeDesktop) && isNumber(sizeDesktop))
            if (sizeDesktop != 0) {
                response.desktop['flex'] = `0 0 ${sizeDesktop}%`;
                response.desktop['max-width'] = `${sizeDesktop}%`;
            }
            else {
                response.desktop['flex'] = '0 0 auto';
                response.desktop['max-width'] = '';
            }
        if (!isNil(sizeTablet) && isNumber(sizeTablet)) {
            if (sizeTablet != 0) {
                response.tablet['flex'] = `0 0 ${sizeTablet}%`;
                response.tablet['max-width'] = `${sizeTablet}%`;
            }
            else {
                response.tablet['flex'] = '0 0 auto';
                response.tablet['max-width'] = '';
            }
        }
        if (!isNil(sizeMobile) && isNumber(sizeMobile)) {
            if (sizeMobile != 0) {
                response.mobile['flex'] = `0 0 ${sizeMobile}%`;
                response.mobile['max-width'] = `${sizeMobile}%`;
            }
            else {
                response.mobile['flex'] = '0 0 auto';
                response.mobile['max-width'] = '';
            }
        }

        return response;
    }

    /**
    * Refresh the styles on Editor
    */
    displayStyles() {
        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: this.metaValue(),
            },
        });
        new BackEndResponsiveStyles(this.getMeta);
    }

    render() {
        const {
            attributes: {
                uniqueID,
                blockStyle,
                defaultBlockStyle,
                sizeDesktop,
                sizeTablet,
                sizeMobile,
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
            className,
            setAttributes
        } = this.props;

        let classes = classnames('gx-block gx-column-block', blockStyle, extraClassName, className);

        /**
         * Check if InnerBlock contains other blocks
         */
        const hasInnerBlock = () => {
            return select('core/block-editor').getBlockOrder(clientId).length >= 1;
        }

        /**
         * Check if current block or children is select
         */
        const isSelect = () => {
            const selectedBlock = select('core/editor').getSelectedBlockClientId();
            const nestedBlocks = select('core/block-editor').getBlockOrder(clientId);
            return nestedBlocks.includes(selectedBlock) || clientId === selectedBlock;
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
                        label={__('Desktop', 'gutenberg-extra')}
                        value={sizeDesktop}
                        onChange={sizeDesktop => setAttributes({ sizeDesktop })}
                        min={0}
                        max={100}
                        step={.1}
                    />
                    <RangeControl
                        label={__('Tablet', 'gutenberg-extra')}
                        value={sizeTablet}
                        onChange={sizeTablet => setAttributes({ sizeTablet })}
                        min={0}
                        max={100}
                        step={.1}
                    />
                    <RangeControl
                        label={__('Mobile', 'gutenberg-extra')}
                        value={sizeMobile}
                        onChange={sizeMobile => setAttributes({ sizeMobile })}
                        min={0}
                        max={100}
                        step={.1}
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
                                        target=">.gx-column-block"
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
                                                    target=">.gx-column-block"
                                                />
                                            </BaseControl>
                                            <hr style={{ marginTop: "28px" }} />
                                            <BorderControl
                                                borderOptions={border}
                                                onChange={border => setAttributes({ border })}
                                                target=">.gx-column-block"
                                                //avoidZero={false}
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
                                            target=">.gx-column-block"
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
                                            target=">.gx-column-block"
                                            avoidZero
                                        />
                                        <DimensionsControl
                                            value={margin}
                                            onChange={margin => setAttributes({ margin })}
                                            target=">.gx-column-block"
                                            avoidZero
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
                <InnerBlocks
                    templateLock={false}
                    renderAppender={
                        !hasInnerBlock() || isSelect() ?
                            () => (
                                <InnerBlocks.ButtonBlockAppender />
                            ) :
                            false
                    }
                />
            </div>
        ];
    }
}

// May is not necessary withSelect...
const editSelect = withSelect((select, ownProps) => {
    const {
        clientId
    } = ownProps;

    const rowBlockId = select('core/block-editor').getBlockRootClientId(clientId); // getBlockHierarchyRootClientId
    const isSync = select('core/block-editor').getBlockAttributes(rowBlockId).syncColumns;

    return {
        isSync,
        rowBlockId
    }
})

const editDispatch = withDispatch((dispatch, ownProps) => {
    const {
        isSync,
        rowBlockId,
        clientId
    } = ownProps;

    const isSelect = select('core/block-editor').getSelectedBlockClientId() === clientId;
    const originalNestedBlocks = select('core/block-editor').getBlockOrder(rowBlockId);
    let nestedBlocks = [...originalNestedBlocks];
    nestedBlocks = pull(nestedBlocks, clientId);

    const getBackgroundObject = object => {
        const response = {
            label: object.label,
            general: {}
        }

        if (!isEmpty(object.colorOptions.color)) {
            response.general['background-color'] = object.colorOptions.color;
        }
        if (!isEmpty(object.colorOptions.gradient)) {
            response.general['background'] = object.colorOptions.gradient;
        }
        if (!isEmpty(object.blendMode)) {
            response.general['background-blend-mode'] = object.blendMode;
        }

        object.backgroundOptions.map(option => {
            if (isNil(option) || isEmpty(option.imageOptions.mediaURL))
                return;
            // Image
            if (option.sizeSettings.size === 'custom' && !isNil(option.imageOptions.cropOptions)) {
                if (!isNil(response.general['background-image']))
                    response.general['background-image'] = `${response.general['background-image']},url('${option.imageOptions.cropOptions.image.source_url}')`;
                else
                    response.general['background-image'] = `url('${option.imageOptions.cropOptions.image.source_url}')`;
                if (!isEmpty(object.colorOptions.gradient))
                    response.general['background-image'] = `${response.general['background-image']}, ${object.colorOptions.gradient}`;
            }
            else if (option.sizeSettings.size === 'custom' && isNil(option.imageOptions.cropOptions) || option.sizeSettings.size != 'custom' && !isNil(option.imageOptions.mediaURL)) {
                if (!isNil(response.general['background-image']))
                    response.general['background-image'] = `${response.general['background-image']},url('${option.imageOptions.mediaURL}')`;
                else
                    response.general['background-image'] = `url('${option.imageOptions.mediaURL}')`;
                if (!isEmpty(object.colorOptions.gradient))
                    response.general['background-image'] = `${response.general['background-image']}, ${object.colorOptions.gradient}`;
            }
            // Size
            if (option.sizeSettings.size != 'custom') {
                if (!isNil(response.general['background-size']))
                    response.general['background-size'] = `${response.general['background-size']},${option.sizeSettings.size}`;
                else
                    response.general['background-size'] = option.sizeSettings.size;
            }
            else {
                if (!isNil(response.general['background-size']))
                    response.general['background-size'] = `${response.general['background-size']},cover`;
                else
                    response.general['background-size'] = 'cover';
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

    const getBoxShadowObject = object => {
        let boxShadow = '';
        object.shadowHorizontal ? boxShadow += (object.shadowHorizontal + 'px ') : null;
        object.shadowVertical ? boxShadow += (object.shadowVertical + 'px ') : null;
        object.shadowBlur ? boxShadow += (object.shadowBlur + 'px ') : null;
        object.shadowSpread ? boxShadow += (object.shadowSpread + 'px ') : null;
        object.shadowColor ? boxShadow += (object.shadowColor) : null;
        boxShadow = boxShadow.trim();

        const response = {
            label: object.label,
            general: {
                "box-shadow": boxShadow
            }
        }

        return response;
    }

    const basicStyling = (id, object, avoidZero = true) => {
        const blockUniqueID = select('core/block-editor').getBlockAttributes(id).uniqueID;
        const meta = JSON.parse(select('core/editor').getEditedPostAttribute('meta')._gutenberg_extra_responsive_styles);

        const target = `${blockUniqueID}>.gx-column-block`;
        let obj = {};
        if (object.label === 'Background')
            obj = getBackgroundObject(object)
        if (object.label === 'Box Shadow')
            obj = getBoxShadowObject(object)
        else
            obj = object;

        const responsiveStyle = new ResponsiveStylesResolver(target, meta, obj, avoidZero);
        const response = JSON.stringify(responsiveStyle.getNewValue);

        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: response,
            },
        });
        new BackEndResponsiveStyles(meta);
    }

    return {
        testCase: attributes => {
            if (!isSync || !isSelect)
                return;

            const newAttributes = { ...attributes };
            delete newAttributes.uniqueID;

            nestedBlocks.map( blockId => {  
                dispatch('core/block-editor').updateBlockAttributes(blockId, newAttributes)
                .then(
                    () => {
                        basicStyling(blockId, JSON.parse(newAttributes.background), false);
                        basicStyling(blockId, JSON.parse(newAttributes.boxShadow), false);
                        basicStyling(blockId, JSON.parse(newAttributes.border), false);
                        basicStyling(blockId, JSON.parse(newAttributes.border).borderWidth, false);
                        basicStyling(blockId, JSON.parse(newAttributes.border).borderRadius, false);
                        basicStyling(blockId, JSON.parse(newAttributes.size));
                        basicStyling(blockId, JSON.parse(newAttributes.margin));
                        basicStyling(blockId, JSON.parse(newAttributes.padding));
                    }
                )
            })
        }
    }
})

export default compose(editSelect, editDispatch)(edit);