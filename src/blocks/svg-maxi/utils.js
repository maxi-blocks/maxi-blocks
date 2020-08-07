/**
 * Internal dependencies
 */
import SVGDefaults from './defaults';

/**
 * External dependencies
 */
import { ReactSVG } from 'react-svg';
import {
    uniqueId,
    isObject
} from 'lodash';

/**
 * Utils
 */
export const injectImgSVG = (svg, uniqueID, imgMediaURL, colorSVG) => {
    if (!!imgMediaURL) {
        let pattern = document.createElement('pattern');
        pattern.id = `maxi-svg-block__svg__${uniqueID}`;
        pattern.classList.add('maxi-svg-block__svg');
        pattern.setAttribute('width', '100%');
        pattern.setAttribute('height', '100%');
        pattern.setAttribute('x', '0');
        pattern.setAttribute('y', '0');
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');

        let image = document.createElement('image');
        image.classList.add('maxi-svg-block__svg__image');
        image.setAttribute('width', '100%');
        image.setAttribute('height', '100%');
        image.setAttribute('x', '0');
        image.setAttribute('y', '0');
        image.setAttribute('xlink:href', imgMediaURL);

        pattern.append(image);
        svg.prepend(pattern)

        svg.querySelectorAll('path').forEach(path => {
            path.style.fill = `url(#maxi-svg-block__svg__${uniqueID})`;
            path.setAttribute('fill', `url(#maxi-svg-block__svg__${uniqueID})`)
        })
    }
    else if (colorSVG) {
        svg.querySelectorAll('path').forEach(path => {
            path.style.fill = colorSVG;
            path.setAttribute('fill', colorSVG)
        })
    }

    return svg;
}

export const generateDataObject = (data, svg) => {
    const response =
        !!data ?
            !isObject(data) ?
                JSON.parse(data) :
                data :
            [];
    const obj = {
        id: '',
        color: '',
        imageID: '',
        imageURL: '',
    }
    const SVGLayers = Array.from(
        svg.querySelectorAll('path, circle, rect, polygon, line, ellipse')
    );

    if (response.length >= SVGLayers.length) {
        response.splice(0, response.length - SVGLayers.length);
        response.forEach((layer, i) => {
            response[i].id = `${svg.dataItem}__${uniqueId()}`;
        })
    }
    else
        SVGLayers.forEach((layer, i) => {
            if (response.length > i)
                return;

            const newObj = { ...obj };
            newObj.id = `${svg.dataItem}__${uniqueId()}`;
            response.push(newObj)
        })
    
    return response;
}

export const getSVGDefaults = props => {
    const {
        attributes: {
            uniqueID,
            imgMediaURL,
            colorSVG,
            SVGData
        },
        setAttributes
    } = props;

    return (
        <div
            className='maxi-svg-block__defaults'
        >
            {
                SVGDefaults.forEach(svgEl => (
                    <ReactSVG
                        src={svgEl}
                        className='maxi-svg-block__defaults__item'
                        onClick={e => {
                            if (!!e.target.ownerSVGElement) {
                                const svg = e.target.ownerSVGElement;
                                const resEl = injectImgSVG(svg, uniqueID, imgMediaURL, colorSVG);
                                const resData = generateDataObject(SVGData, resEl);

                                setAttributes({
                                    SVGElement: resEl.outerHTML,
                                    SVGMediaID: null,
                                    SVGData: JSON.stringify(resData)
                                })
                            }
                        }}
                        beforeInjection={svg => svg.dataItem = `${uniqueID}__svg`}
                    />
                ))
            }
        </div>
    )
}