/**
 * WordPress dependencies
 */
const { Popover } = wp.components;
const { useSelect } = wp.data;
const {
    Fragment,
    useEffect,
    useState
} = wp.element;

/**
 * Internal dependencies
 */
import { getDefaultProp } from '../../utils';

/**
 * Utils
 */
import {
    Alignment,
    BackgroundColor,
    Border,
    BoxShadow,
    Mover,
    ColumnPattern,
    Divider,
    DividerColor,
    DividerAlignment,
    Duplicate,
    Link,
    Delete,
    ImageSize,
    TextBold,
    TextColor,
    TextItalic,
    TextLevel,
    TextLink,
    TextList,
    TextListOptions,
    TextOptions,
    PaddingMargin,
    Size,
    __experimentalColumnMover,
    __experimentalRowSettings
} from './components/';

/**
 * Styles
 */
import './editor.scss';

/**
 * General
 */
const allowedBlocks = [
    'maxi-blocks/block-image-box',
    'maxi-blocks/block-title-extra',
    'maxi-blocks/testimonials-slider-block',
    'maxi-blocks/row-maxi',
    'maxi-blocks/column-maxi',
    'maxi-blocks/button-maxi',
    'maxi-blocks/text-maxi',
    'maxi-blocks/divider-maxi',
    'maxi-blocks/image-maxi',
    'maxi-blocks/section-maxi',
    'maxi-blocks/container-maxi',
];

/**
 * Component
 */
const MaxiToolbar = props => {
    const {
        attributes: {
            uniqueID,
            typography,
            typographyHover,
            alignment,
            background,
            border,
            size,
            imageSize,
            mediaID,
            fullWidth,
            isFirstOnHierarchy,
            textLevel,
            margin,
            padding,
            rowPattern,
            horizontalAlign,
            verticalAlign,
            linkSettings,
            boxShadow,
            showLine,
            divider,
            lineOrientation,
            lineVertical,
            lineHorizontal,
            content,
            isList,
            typeOfList
        },
        clientId,
        isSelected,
        name,
        setAttributes
    } = props;

    const { deviceType } = useSelect(
        select => {
            const {
                __experimentalGetPreviewDeviceType
            } = select(
                'core/edit-post'
            );
            let deviceType = __experimentalGetPreviewDeviceType();
            deviceType = deviceType === 'Desktop' ?
                'general' :
                deviceType;
            return {
                deviceType,
            }
        }
    );

    const [anchorRef, setAnchorRef] = useState(
        document.getElementById(`block-${clientId}`)
    )

    useEffect(() => {
        setAnchorRef(document.getElementById(`block-${clientId}`));
    })

    if (!allowedBlocks.includes(name))
        return null;

    return (
        <Fragment>
            {
                isSelected &&
                anchorRef &&
                <Popover
                    noArrow
                    animate={false}
                    position='top center right'
                    focusOnMount={false}
                    anchorRef={anchorRef}
                    className="maxi-toolbar__popover"
                    uniqueid={uniqueID}
                    __unstableSticky={true}
                    __unstableSlotName="block-toolbar"
                    shouldAnchorIncludePadding
                >
                    <div
                        className='toolbar-wrapper'
                    >
                        <Mover
                            clientId={clientId}
                            blockName={name}
                        />
                        <__experimentalColumnMover
                            clientId={clientId}
                            blockName={name}
                        />
                        <DividerColor
                            blockName={name}
                            divider={divider}
                            onChange={divider => setAttributes({ divider })}
                        />
                        <Divider
                            blockName={name}
                            showLine={showLine}
                            divider={divider}
                            defaultDivider={getDefaultProp(clientId, 'divider')}
                            lineOrientation={lineOrientation}
                            onChange={(showLine, divider) =>
                                setAttributes({
                                    showLine,
                                    divider,
                                })
                            }
                        />
                        <DividerAlignment
                            lineOrientation={lineOrientation}
                            lineVertical={lineVertical}
                            lineHorizontal={lineHorizontal}
                            divider={divider}
                            blockName={name}
                            onChangeOrientation={(lineOrientation) => setAttributes({ lineOrientation })}
                            onChangeHorizontal={(lineHorizontal) => setAttributes({ lineHorizontal })}
                            onChangeVertical={(lineVertical) => setAttributes({ lineVertical })}
                        />
                        <TextOptions
                            blockName={name}
                            typography={typography}
                            defaultTypography={getDefaultProp(clientId, 'typography')}
                            onChange={typography => setAttributes({ typography })}
                            breakpoint={deviceType}
                        />
                        <TextColor
                            blockName={name}
                            typography={typography}
                            onChange={typography => setAttributes({ typography })}
                            breakpoint={deviceType}
                        />
                        <Alignment
                            blockName={name}
                            alignment={alignment}
                            onChange={alignment => setAttributes({ alignment })}
                            breakpoint={deviceType}
                        />
                        <TextLevel
                            blockName={name}
                            textLevel={textLevel}
                            typography={typography}
                            typographyHover={typographyHover}
                            margin={margin}
                            isList={isList}
                            onChange={
                                (
                                    textLevel,
                                    typography,
                                    typographyHover,
                                    margin
                                ) => setAttributes({
                                    textLevel,
                                    typography,
                                    typographyHover,
                                    margin
                                })
                            }
                        />
                        <TextBold
                            blockName={name}
                            content={content}
                            onChange={content => setAttributes({ content })}
                            node={anchorRef}
                        />
                        <TextItalic
                            blockName={name}
                            content={content}
                            onChange={content => setAttributes({ content })}
                            node={anchorRef}
                        />
                        <__experimentalRowSettings
                            blockName={name}
                            horizontalAlign={horizontalAlign}
                            verticalAlign={verticalAlign}
                            onChange={obj => setAttributes(obj)}
                        />
                        <ColumnPattern
                            clientId={clientId}
                            blockName={name}
                            rowPattern={rowPattern}
                            onChange={rowPattern => setAttributes({ rowPattern })}
                        />
                        <Link
                            blockName={name}
                            linkSettings={linkSettings}
                            onChange={linkSettings => setAttributes({ linkSettings })}
                        />
                        <TextLink
                            blockName={name}
                            content={content}
                            onChange={content => setAttributes({ content })}
                            node={anchorRef}
                        />
                        <TextList
                            blockName={name}
                            isList={isList}
                            content={content}
                            onChange={(isList, content) =>
                                setAttributes({
                                    isList,
                                    content
                                })}
                        />
                        <TextListOptions
                            blockName={name}
                            isList={isList}
                            content={content}
                            typeOfList={typeOfList}
                            onChange={content => setAttributes({ content })}
                            node={anchorRef}
                        />
                        <BackgroundColor
                            blockName={name}
                            background={background}
                            onChange={background => setAttributes({ background })}
                        />
                        <Border
                            blockName={name}
                            border={border}
                            defaultBorder={getDefaultProp(clientId, 'border')}
                            onChange={border => setAttributes({ border })}
                            breakpoint={deviceType}
                        />
                        {
                            deviceType === 'general' &&
                            <ImageSize
                                blockName={name}
                                size={size}
                                defaultSize={getDefaultProp(clientId, 'size')}
                                onChangeSize={size => setAttributes({ size })}
                                imageSize={imageSize}
                                onChangeImageSize={imageSize => setAttributes({ imageSize })}
                                mediaID={mediaID}
                                fullWidth={fullWidth}
                                onChangeFullWidth={fullWidth => setAttributes({ fullWidth })}
                                isFirstOnHierarchy={isFirstOnHierarchy}
                                onChangeCaption={captionType => setAttributes({ captionType })}
                            />
                        }
                        <Size
                            clientId={clientId}
                            blockName={name}
                            size={size}
                            defaultSize={getDefaultProp(clientId, 'size')}
                            onChangeSize={size => setAttributes({ size })}
                            fullWidth={fullWidth}
                            onChangeFullWidth={fullWidth => setAttributes({ fullWidth })}
                            isFirstOnHierarchy={isFirstOnHierarchy}
                            breakpoint={deviceType}
                        />
                        <BoxShadow
                            blockName={name}
                            boxShadow={boxShadow}
                            defaultBoxShadow={getDefaultProp(clientId, 'boxShadow')}
                            onChange={boxShadow => setAttributes({ boxShadow })}
                            breakpoint={deviceType}
                        />
                        <PaddingMargin
                            blockName={name}
                            margin={margin}
                            defaultMargin={getDefaultProp(clientId, 'margin')}
                            onChangeMargin={margin => setAttributes({ margin })}
                            padding={padding}
                            defaultPadding={getDefaultProp(clientId, 'padding')}
                            onChangePadding={padding => setAttributes({ padding })}
                            breakpoint={deviceType}
                        />
                        <Duplicate
                            clientId={clientId}
                        />
                        <Delete
                            clientId={clientId}
                        />
                    </div>
                </Popover>
            }
        </Fragment>
    )
}

export default MaxiToolbar;