const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { PanelColorSettings } = wp.blockEditor;
const { SelectControl } = wp.components;
import { DimensionsControl } from '../dimensions-control/index';

export const blockBorderAttributes = {
    blockBorderColor: {
        type: 'string',
        default: "",
    },
    borderHoverColor: {
        type: 'string',
        default: "",
    },
    borderType: {
        type: 'string',
        default: 'none',
    },
    borderWidth: {
        type: 'number',
        default: 0,
    },
    borderRadius: {
        type: 'number',
        default: 0,
    },
    borderRadiusTopLeft: {
        type: 'number',
    },
    borderRadiusTopRight: {
        type: 'number',
    },
    borderRadiusBottomLeft: {
        type: 'number',
    },
    borderRadiusBottomRight: {
        type: 'number',
    },
    borderRadiusTopLeftTablet: {
        type: 'number',
    },
    borderRadiusTopRightTablet: {
        type: 'number',
    },
    borderRadiusBottomLeftTablet: {
        type: 'number',
    },
    borderRadiusBottomRightTablet: {
        type: 'number',
    },
    borderRadiusTopLeftMobile: {
        type: 'number',
    },
    borderRadiusTopRightMobile: {
        type: 'number',
    },
    borderRadiusBottomLeftMobile: {
        type: 'number',
    },
    borderRadiusBottomRightMobile: {
        type: 'number',
    },
    borderRadiusUnit: {
        type: 'string',
        default: 'px',
    },
    borderRadiusSize: {
        type: 'string',
        default: 'advanced',
    },
    borderRadiusSyncUnits: {
        type: 'boolean',
        default: false,
    },
    borderRadiusSyncUnitsTablet: {
        type: 'boolean',
        default: true,
    },
    borderRadiusSyncUnitsMobile: {
        type: 'boolean',
        default: true,
    },
    borderWidthRight: {
        type: 'number',
    },
    borderWidthTop: {
        type: 'number',
    },
    borderWidthLeft: {
        type: 'number',
    },
    borderWidthBottom: {
        type: 'number',
    },
    borderWidthRightTablet: {
        type: 'number',
    },
    borderWidthTopTablet: {
        type: 'number',
    },
    borderWidthLeftTablet: {
        type: 'number',
    },
    borderWidthBottomTablet: {
        type: 'number',
    },
    borderWidthRightMobile: {
        type: 'number',
    },
    borderWidthTopMobile: {
        type: 'number',
    },
    borderWidthLeftMobile: {
        type: 'number',
    },
    borderWidthBottomMobile: {
        type: 'number',
    },
    borderWidthUnit: {
        type: 'string',
        default: 'px',
    },
    borderWidthSize: {
        type: 'string',
        default: 'advanced',
    },
    borderWidthSyncUnits: {
        type: 'boolean',
        default: false,
    },
    borderWidthSyncUnitsTablet: {
        type: 'boolean',
        default: true,
    },
    borderWidthSyncUnitsMobile: {
        type: 'boolean',
        default: true,
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