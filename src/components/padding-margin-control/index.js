/**
 * DEPECRATED
 */

const { __ } = wp.i18n;
const { Fragment } = wp.element;
import { DimensionsControl } from '../dimensions-control/index';

export const PaddingMarginControl = ( props ) => {
    const {
        attributes: {
            dimConPadding,
            dimConMargin
        },
        setAttributes
    } = props;

    return (
        <Fragment>
            <DimensionsControl
                value={dimConPadding}
                onChange={value => setAttributes({dimConPadding: value})}
            />
            <DimensionsControl
                value={dimConMargin}
                onChange={value => setAttributes({dimConMargin: value})}
            />
        </Fragment>
    )
}


/*
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
*/