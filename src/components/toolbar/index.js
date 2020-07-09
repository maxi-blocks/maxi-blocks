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
    TextOptions,
    TextShadow,
    PaddingMargin,
    Size
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
            width,
            mediaID,
            fullWidth,
            isFirstOnHierarchy,
            textLevel,
            margin,
            padding,
            rowPattern,
            linkSettings,
            boxShadow,
            showLine,
            divider,
            lineOrientation,
            lineVertical,
            lineHorizontal,
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
                            typography={typography}
                            onChange={typography => setAttributes({ typography })}
                            breakpoint={deviceType}
                        />
                        <TextItalic
                            blockName={name}
                            typography={typography}
                            onChange={typography => setAttributes({ typography })}
                            breakpoint={deviceType}
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
                        <BackgroundColor
                            blockName={name}
                            background={background}
                            onChange={background => setAttributes({ background })}
                        />
                        <Border
                            blockName={name}
                            border={border}
                            onChange={border => setAttributes({ border })}
                            breakpoint={deviceType}
                        />
                        {
                            deviceType === 'general' &&
                            <ImageSize
                                clientId={clientId}
                                blockName={name}
                                size={size}
                                onChangeSize={size => setAttributes({ size })}
                                width={width}
                                onChangeWidth={width => setAttributes({ width })}
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
                            onChangeSize={size => setAttributes({ size })}
                            fullWidth={fullWidth}
                            onChangeFullWidth={fullWidth => setAttributes({ fullWidth })}
                            isFirstOnHierarchy={isFirstOnHierarchy}
                            breakpoint={deviceType}
                        />
                        <BoxShadow
                            blockName={name}
                            boxShadow={boxShadow}
                            onChange={boxShadow => setAttributes({ boxShadow })}
                            breakpoint={deviceType}
                        />
                        <PaddingMargin
                            blockName={name}
                            margin={margin}
                            onChangeMargin={margin => setAttributes({ margin })}
                            padding={padding}
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