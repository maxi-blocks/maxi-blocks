/**
 * WordPress dependencies
 */
const { Popover } = wp.components;
const { useSelect } = wp.data;
const { Fragment } = wp.element;

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

    const anchorRef = document.getElementById(`block-${clientId}`);

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
                    uniqueID={uniqueID}
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
                        />
                        <BoxShadow
                            clientId={clientId}
                        />
                        <BackgroundColor
                            clientId={clientId}
                        />
                        <Border
                            clientId={clientId}
                        />
                        <ImageSize
                            clientId={clientId}
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