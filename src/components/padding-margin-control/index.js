const { __ } = wp.i18n;
const { Fragment } = wp.element;
import DimensionsControl from '../dimensions-control/index';

export const paddingMarginControlAttributes = {
    paddingUnit: {
        type: 'string',
        default: 'px',
    },
    paddingTop: {
        type: 'number',
    },
    paddingRight: {
        type: 'number',
    },
    paddingBottom: {
        type: 'number',
    },
    paddingLeft: {
        type: 'number',
    },
    paddingTopTablet: {
        type: 'number',
    },
    paddingRightTablet: {
        type: 'number',
    },
    paddingBottomTablet: {
        type: 'number',
    },
    paddingLeftTablet: {
        type: 'number',
    },
    paddingTopMobile: {
        type: 'number',
    },
    paddingRightMobile: {
        type: 'number',
    },
    paddingBottomMobile: {
        type: 'number',
    },
    paddingLeftMobile: {
        type: 'number',
    },
    paddingSize: {
        type: 'string',
        default: 'advanced',
    },
    paddingSyncUnits: {
        type: 'boolean',
        default: false,
    },
    paddingSyncUnitsTablet: {
        type: 'boolean',
        default: true,
    },
    paddingSyncUnitsMobile: {
        type: 'boolean',
        default: true,
    },
    marginUnit: {
        type: 'string',
        default: 'px',
    },
    marginTop: {
        type: 'number',
    },
    marginRight: {
        type: 'number',
    },
    marginBottom: {
        type: 'number',
    },
    marginLeft: {
        type: 'number',
    },
    marginTopTablet: {
        type: 'number',
    },
    marginRightTablet: {
        type: 'number',
    },
    marginBottomTablet: {
        type: 'number',
    },
    marginLeftTablet: {
        type: 'number',
    },
    marginTopMobile: {
        type: 'number',
    },
    marginRightMobile: {
        type: 'number',
    },
    marginBottomMobile: {
        type: 'number',
    },
    marginLeftMobile: {
        type: 'number',
    },
    marginSize: {
        type: 'string',
        default: 'no',
    },
    marginSyncUnits: {
        type: 'boolean',
        default: false,
    },
    marginSyncUnitsTablet: {
        type: 'boolean',
        default: false,
    },
    marginSyncUnitsMobile: {
        type: 'boolean',
        default: false,
    },
}

export const PaddingMarginControl = ( props ) => {
    const {
        attributes: {
            paddingTop,
            paddingRight,
            paddingBottom,
            paddingLeft,
            paddingTopTablet,
            paddingRightTablet,
            paddingBottomTablet,
            paddingLeftTablet,
            paddingTopMobile,
            paddingRightMobile,
            paddingBottomMobile,
            paddingLeftMobile,
            paddingUnit,
            paddingSyncUnits,
            paddingSyncUnitsTablet,
            paddingSyncUnitsMobile,
            paddingSize,
            marginTop,
            marginRight,
            marginBottom,
            marginLeft,
            marginTopTablet,
            marginRightTablet,
            marginBottomTablet,
            marginLeftTablet,
            marginTopMobile,
            marginRightMobile,
            marginBottomMobile,
            marginLeftMobile,
            marginUnit,
            marginSyncUnits,
            marginSyncUnitsTablet,
            marginSyncUnitsMobile,
            marginSize,
        }
    } = props;

    return (
        <Fragment>
            <DimensionsControl {...props}
                type={'padding'}
                label={__('Padding', 'gutenberg-extra')}
                valueTop={paddingTop}
                valueRight={paddingRight}
                valueBottom={paddingBottom}
                valueLeft={paddingLeft}
                valueTopTablet={paddingTopTablet}
                valueRightTablet={paddingRightTablet}
                valueBottomTablet={paddingBottomTablet}
                valueLeftTablet={paddingLeftTablet}
                valueTopMobile={paddingTopMobile}
                valueRightMobile={paddingRightMobile}
                valueBottomMobile={paddingBottomMobile}
                valueLeftMobile={paddingLeftMobile}
                unit={paddingUnit}
                syncUnits={paddingSyncUnits}
                syncUnitsTablet={paddingSyncUnitsTablet}
                syncUnitsMobile={paddingSyncUnitsMobile}
                dimensionSize={paddingSize}
            />
            <DimensionsControl {...props}
                type={'margin'}
                label={__('Margin', 'gutenberg-extra')}
                valueTop={marginTop}
                valueRight={marginRight}
                valueBottom={marginBottom}
                valueLeft={marginLeft}
                valueTopTablet={marginTopTablet}
                valueRightTablet={marginRightTablet}
                valueBottomTablet={marginBottomTablet}
                valueLeftTablet={marginLeftTablet}
                valueTopMobile={marginTopMobile}
                valueRightMobile={marginRightMobile}
                valueBottomMobile={marginBottomMobile}
                valueLeftMobile={marginLeftMobile}
                unit={marginUnit}
                syncUnits={marginSyncUnits}
                syncUnitsTablet={marginSyncUnitsTablet}
                syncUnitsMobile={marginSyncUnitsMobile}
                dimensionSize={marginSize}
            />
        </Fragment>
    )
}