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
            borderRadius,
            borderWidth
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
            <DimensionsControl
                value={borderRadius}
                onChange={value => setAttributes({borderRadius: value})}
            />
            <DimensionsControl
                value={borderWidth}
                onChange={value => setAttributes({borderWidth: value})}
            />
        </Fragment>
    )
}