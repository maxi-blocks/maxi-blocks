/**
 * WordPress dependencies
 */
const { Popover } = wp.components;
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
    Duplicate,
    Link,
    Delete,
    ImageSize,
    TextBold,
    TextColor,
    TextItalic,
    TextLevel,
    TextOptions,
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
            alignmentDesktop,
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
            columnGap,
            boxShadow
        },
        clientId,
        isSelected,
        name,
        onChangeColumnGap,
        setAttributes
    } = props;

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
                        <TextOptions
                            blockName={name}
                            typography={typography}
                            onChange={typography => setAttributes({ typography })}
                        />
                        <TextColor
                            blockName={name}
                            typography={typography}
                            onChange={typography => setAttributes({ typography })}
                        />
                        <Alignment
                            blockName={name}
                            alignmentDesktop={alignmentDesktop}
                            onChange={alignmentDesktop => setAttributes({ alignmentDesktop })}
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
                        />
                        <TextItalic
                            blockName={name}
                            typography={typography}
                            onChange={typography => setAttributes({ typography })}
                        />
                        <ColumnPattern
                            clientId={clientId}
                            blockName={name}
                            rowPattern={rowPattern}
                            onChange={rowPattern => setAttributes({ rowPattern })}
                            onChangeColumnGap={onChangeColumnGap}
                        />
                        <Link
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
                        />
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
                        <BoxShadow
                            blockName={name}
                            boxShadow={boxShadow}
                            onChange={boxShadow => setAttributes({ boxShadow })}
                        />
                        <Size
                            clientId={clientId}
                            blockName={name}
                            size={size}
                            onChangeSize={size => setAttributes({ size })}
                            fullWidth={fullWidth}
                            onChangeFullWidth={fullWidth => setAttributes({ fullWidth })}
                            isFirstOnHierarchy={isFirstOnHierarchy}
                        />
                        <PaddingMargin
                            blockName={name}
                            margin={margin}
                            onChangeMargin={margin => setAttributes({ margin })}
                            padding={padding}
                            onChangePadding={padding => setAttributes({ padding })}
                            columnGap={columnGap}
                            onChangeColumnGap={columnGap => {
                                onChangeColumnGap(columnGap);
                                setAttributes({ columnGap })
                            }}
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