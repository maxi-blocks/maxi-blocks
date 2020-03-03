const { __ } = wp.i18n;
const { Fragment } = wp.element;
import DimensionsControl from '../dimensions-control/index';

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