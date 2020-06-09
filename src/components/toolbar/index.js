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
    Duplicate,
    Link,
    Delete,
    ImageSize,
    TextBold,
    TextColor,
    TextItalic,
    TextLevel,
    TextOptions,
    PaddingMargin
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
];

/**
 * Component
 */
const MaxiToolbar = () => {
    const { clientId, blockName, uniqueID, rawTypography } = useSelect(
        select => {
            const {
                getSelectedBlockClientId,
                getBlockName,
                getBlockAttributes
            } = select(
                'core/block-editor'
            )
            const clientId = getSelectedBlockClientId();
            const blockName = clientId ? getBlockName(clientId) : '';
            const rawTypography = clientId ? getBlockAttributes(clientId).typography : {};
            const uniqueID = clientId ? getBlockAttributes(clientId).uniqueID : '';
            return {
                clientId,
                blockName,
                rawTypography,
                uniqueID
            }
        },
        []
    )

    const [anchorRef, setAnchorRef] = useState(
        document.getElementById(`block-${clientId}`)
    )

    useEffect(() => {
        setAnchorRef(document.getElementById(`block-${clientId}`));
    })

    if (!allowedBlocks.includes(blockName))
        return null;

    return (
        <Fragment>
            {
                clientId &&
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
                        <Alignment
                            clientId={clientId}
                            blockName={blockName}
                        />
                        <BoxShadow
                            clientId={clientId}
                            blockName={blockName}
                        />
                        <BackgroundColor
                            clientId={clientId}
                            blockName={blockName}
                        />
                        <Border
                            clientId={clientId}
                            blockName={blockName}
                        />
                        <ImageSize
                            clientId={clientId}
                            blockName={blockName}
                        />
                        <TextOptions
                            clientId={clientId}
                            blockName={blockName}
                            rawTypography={rawTypography}
                        />
                        <TextBold
                            clientId={clientId}
                            blockName={blockName}
                            rawTypography={rawTypography}
                        />
                        <TextItalic
                            clientId={clientId}
                            blockName={blockName}
                            rawTypography={rawTypography}
                        />
                        <TextColor
                            clientId={clientId}
                            blockName={blockName}
                            rawTypography={rawTypography}
                        />
                        <TextLevel
                            clientId={clientId}
                            blockName={blockName}
                            rawTypography={rawTypography}
                        />
                        <ColumnPattern
                            clientId={clientId}
                            blockName={blockName}
                        />
                        <Duplicate
                            clientId={clientId}
                        />
                        <Link
                            clientId={clientId}
                        />
                        <PaddingMargin
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