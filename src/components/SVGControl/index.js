/**
 * WordPress dependencies
 */
const {
    SelectControl
} = wp.components;
const {
    Fragment,
    useState
} = wp.element;

/**
 * Internal dependencies
 */
import MediaUploaderControl from '../media-uploader-control';
import __experimentalSVGDefaultsDisplayer from '../SVGDefaultsDisplayer';
import {
    generateDataObject,
    injectImgSVG
} from './utils';

/**
 * External dependencies
 */
import { ReactSVG } from 'react-svg';
import classnames from 'classnames';
import { isNumber } from 'lodash';

/**
 * Component
 */
const SVGControl = props => {
    const {
        SVGData,
        SVGMediaID,
        SVGMediaURL,
        onChange,
        className
    } = props;

    const classes = classnames(
        'maxi-svg-control',
        className
    )

    const [customSVG, changeCustomSVG] = useState(
        isNumber(SVGMediaID) ? 1 : 0
    )

    return (
        <div
            className={classes}
        >
            <SelectControl
                label={__('Custom SVG', 'maxi-blocks')}
                value={customSVG}
                options={[
                    { label: __('Yes', 'maxi-blocks'), value: 1 },
                    { label: __('No', 'maxi-blocks'), value: 0 }
                ]}
                onChange={value => changeCustomSVG(Number(value))}
            />
            {
                !customSVG &&
                <__experimentalSVGDefaultsDisplayer 
                    SVGData={SVGData}
                    onChange={obj => onChange(obj)}
                />
            }
            {
                !!customSVG &&
                <Fragment>
                    <MediaUploaderControl
                        className='maxi-svg-block__svg-uploader'
                        allowedTypes={['image/svg+xml']}
                        mediaID={SVGMediaID}
                        onSelectImage={imageData => {
                            onChange({
                                SVGMediaID: imageData.id,
                                SVGMediaURL: imageData.url
                            });
                        }}
                        onRemoveImage={() =>
                            onChange({
                                SVGMediaID: null,
                                SVGMediaURL: null,
                            })
                        }
                        placeholder={__('Set SVG', 'maxi-blocks')}
                        replaceButton={__('Replace SVG', 'maxi-blocks')}
                        removeButton={__('Remove SVG', 'maxi-blocks')}
                    />
                    <div
                        style={{
                            display: 'none',
                            visibility: 'hidden',
                        }}
                    >
                        <ReactSVG
                            src={SVGMediaURL}
                            afterInjection={(err, svg) => {
                                if (!!svg) {
                                    const resData = generateDataObject(SVGData, svg);
                                    const resEl = injectImgSVG(svg, resData);

                                    if (SVGElement != resEl.outerHTML)
                                        onChange({
                                            SVGElement: resEl.outerHTML,
                                            SVGData: JSON.stringify(resData)
                                        })
                                }
                            }}
                        />
                    </div>
                </Fragment>
            }
        </div>
    )
}

export default SVGControl;