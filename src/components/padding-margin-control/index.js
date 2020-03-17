/**
 * DEPRECATED
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