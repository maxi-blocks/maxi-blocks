const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { PanelColorSettings } = wp.blockEditor;
const { SelectControl } = wp.components;
import DimensionsControl from '../dimensions-control/index';

export const blockBorderAttributes = {
    blockBorderColor: {
        type: 'string',
        default: "",
    },
    borderType: {
        type: 'string',
        default: 'none',
    },
    borderRadius: {
        type: 'number',
        default: 0,
    },
    borderRadiusBottomRight: {
        type: 'number',
        default: 0
    },
    borderRadiusBottomLeft: {
        type: 'number',
        default: 0
    },
    borderRadiusTopRight: {
        type: 'number',
        default: 0
    },
    borderRadiusSize: {
        type: 'number',
        default: 0
    },
    borderRadiusTopLeft: {
        type: 'number',
        default: 0
    },
    borderRadiusBottomRightTablet: {
        type: 'number',
        default: 0
    },
    borderRadiusBottomLeftTablet: {
        type: 'number',
        default: 0
    },
    borderRadiusTopRightTablet: {
        type: 'number',
        default: 0
    },
    borderRadiusTopLeftTablet: {
        type: 'number',
        default: 0
    },
    borderRadiusBottomRightMobile: {
        type: 'number',
        default: 0
    },
    borderRadiusBottomLeftMobile: {
        type: 'number',
        default: 0
    },
    borderRadiusTopRightMobile: {
        type: 'number',
        default: 0
    },
    borderRadiusTopLeftMobile: {
        type: 'number',
        default: 0
    },
    borderRadiusSyncUnits: {
        type: 'number',
        default: 0
    },
    borderRadiusSyncUnitsTablet: {
        type: 'number',
        default: 0
    },
    borderRadiusSyncUnitsMobile: {
        type: 'number',
        default: 0
    },
    borderRadiusUnit: {
        type: 'number',
        default: 0
    },
    borderWidthBottom: {
        type: 'number',
        default: 0
    },
    borderWidthLeft: {
        type: 'number',
        default: 0
    },
    borderWidthRight: {
        type: 'number',
        default: 0
    },
    borderWidthSize: {
        type: 'number',
        default: 0
    },
    borderWidthTop: {
        type: 'number',
        default: 0
    },
    borderWidthBottomTablet: {
        type: 'number',
        default: 0
    },
    borderWidthLeftTablet: {
        type: 'number',
        default: 0
    },
    borderWidthRightTablet: {
        type: 'number',
        default: 0
    },
    borderWidthTopTablet: {
        type: 'number',
        default: 0
    },
    borderWidthBottomMobile: {
        type: 'number',
        default: 0
    },
    borderWidthLeftMobile: {
        type: 'number',
        default: 0
    },
    borderWidthRightMobile: {
        type: 'number',
        default: 0
    },
    borderWidthTopMobile: {
        type: 'number',
        default: 0
    },
    borderWidthSyncUnits: {
        type: 'number',
        default: 0
    },
    borderWidthSyncUnitsTablet: {
        type: 'number',
        default: 0
    },
    borderWidthSyncUnitsMobile: {
        type: 'number',
        default: 0
    },
    borderWidthUnit: {
        type: 'number',
        default: 0
    },
}

export const BlockBorder = (props) => {
    const {
        attributes: {
            blockBorderColor,
            borderType,
            borderRadiusTopLeft,
            borderRadiusTopRight,
            borderRadiusBottomRight,
            borderRadiusBottomLeft,
            borderRadiusTopLeftTablet,
            borderRadiusTopRightTablet,
            borderRadiusBottomRightTablet,
            borderRadiusBottomLeftTablet,
            borderRadiusTopLeftMobile,
            borderRadiusTopRightMobile,
            borderRadiusBottomRightMobile,
            borderRadiusBottomLeftMobile,
            borderRadiusUnit,
            borderRadiusSyncUnits,
            borderRadiusSyncUnitsTablet,
            borderRadiusSyncUnitsMobile,
            borderRadiusSize,
            borderWidthTop,
            borderWidthRight,
            borderWidthBottom,
            borderWidthLeft,
            borderWidthTopTablet,
            borderWidthRightTablet,
            borderWidthBottomTablet,
            borderWidthLeftTablet,
            borderWidthTopMobile,
            borderWidthRightMobile,
            borderWidthBottomMobile,
            borderWidthLeftMobile,
            borderWidthUnit,
            borderWidthSyncUnits,
            borderWidthSyncUnitsTablet,
            borderWidthSyncUnitsMobile,
            borderWidthSize
        },
        setAttributes
    } = props;

    return (
        <Fragment>
            <PanelColorSettings
                title={__('Color Settings', 'gutenberg-extra')}
                colorSettings={[
                    {
                        value: blockBorderColor,
                        onChange: (value) => setAttributes({ blockBorderColor: value }),
                        label: __('Border Colour', 'gutenberg-extra'),
                    },
                ]}
            />
            <SelectControl
                label="Border Type"
                className="gx-border-type"
                value={borderType}
                options={[
                    { label: 'None', value: 'none' },
                    { label: 'Dotted', value: 'dotted' },
                    { label: 'Dashed', value: 'dashed' },
                    { label: 'Solid', value: 'solid' },
                    { label: 'Double', value: 'double' },
                    { label: 'Groove', value: 'groove' },
                    { label: 'Ridge', value: 'ridge' },
                    { label: 'Inset', value: 'inset' },
                    { label: 'Outset', value: 'outset' },
                ]}
                onChange={(value) => setAttributes({ borderType: value })}
            />
            <DimensionsControl {...props}
                type={'borderRadius'}
                className={'gx-border-radius-control'}
                label={__('Border Radius', 'gutenberg-extra')}
                valueTop={borderRadiusTopLeft}
                valueRight={borderRadiusTopRight}
                valueBottom={borderRadiusBottomRight}
                valueLeft={borderRadiusBottomLeft}
                valueTopTablet={borderRadiusTopLeftTablet}
                valueRightTablet={borderRadiusTopRightTablet}
                valueBottomTablet={borderRadiusBottomRightTablet}
                valueLeftTablet={borderRadiusBottomLeftTablet}
                valueTopMobile={borderRadiusTopLeftMobile}
                valueRightMobile={borderRadiusTopRightMobile}
                valueBottomMobile={borderRadiusBottomRightMobile}
                valueLeftMobile={borderRadiusBottomLeftMobile}
                unit={borderRadiusUnit}
                syncUnits={borderRadiusSyncUnits}
                syncUnitsTablet={borderRadiusSyncUnitsTablet}
                syncUnitsMobile={borderRadiusSyncUnitsMobile}
                dimensionSize={borderRadiusSize}
            />
            <DimensionsControl {...props}
                type={'borderWidth'}
                className={'gx-border-width-control'}
                label={__('Border Width', 'gutenberg-extra')}
                valueTop={borderWidthTop}
                valueRight={borderWidthRight}
                valueBottom={borderWidthBottom}
                valueLeft={borderWidthLeft}
                valueTopTablet={borderWidthTopTablet}
                valueRightTablet={borderWidthRightTablet}
                valueBottomTablet={borderWidthBottomTablet}
                valueLeftTablet={borderWidthLeftTablet}
                valueTopMobile={borderWidthTopMobile}
                valueRightMobile={borderWidthRightMobile}
                valueBottomMobile={borderWidthBottomMobile}
                valueLeftMobile={borderWidthLeftMobile}
                unit={borderWidthUnit}
                syncUnits={borderWidthSyncUnits}
                syncUnitsTablet={borderWidthSyncUnitsTablet}
                syncUnitsMobile={borderWidthSyncUnitsMobile}
                dimensionSize={borderWidthSize}
            />
        </Fragment>
    )
}