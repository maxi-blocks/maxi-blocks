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
    isObject,
    isEmpty,
    isElement
} from 'lodash';

/**
 * Utils
 */
export const injectImgSVG = (svg, uniqueID, SVGData = {}) => {
    console.log(SVGData)
    const SVGValue = !isObject(SVGData) ?
        JSON.parse(SVGData) :
        SVGData;

    const SVGElement = !isElement(svg) ?
        new DOMParser().parseFromString(svg, "text/xml").firstChild :
        svg;

    const SVGLayers = Array.from(
        SVGElement.querySelectorAll('path, circle, rect, polygon, line, ellipse')
    );

    Object.entries(SVGValue).forEach(([id, el], i) => {
        if (!isEmpty(el.imageURL)) {
            let pattern = document.createElement('pattern');
            pattern.id = `${id}__img`;
            pattern.classList.add('maxi-svg-block__pattern');
            pattern.setAttribute('width', '100%');
            pattern.setAttribute('height', '100%');
            pattern.setAttribute('x', '0');
            pattern.setAttribute('y', '0');
            pattern.setAttribute('patternUnits', 'userSpaceOnUse');

            let image = document.createElement('image');
            image.classList.add('maxi-svg-block__pattern__image');
            image.setAttribute('width', '100%');
            image.setAttribute('height', '100%');
            image.setAttribute('x', '0');
            image.setAttribute('y', '0');
            image.setAttribute('xlink:href', el.imageURL);

            pattern.append(image);
            SVGElement.prepend(pattern)

            SVGLayers[i].style.fill = `url(#${id}__img)`;
            SVGLayers[i].setAttribute('fill', `url(#${id}__img)`)
        }
        else if (!isEmpty(el.color)) {
            SVGLayers[i].style.fill = el.color;
            SVGLayers[i].setAttribute('fill', el.color)
        }
    })

    SVGElement.dataset.item = `${uniqueID}__svg`;

    return SVGElement;
}

export const generateDataObject = (data, svg) => {
    const response =
        !!data ?
            !isObject(data) ?
                JSON.parse(data) :
                data :
            {};
    const obj = {
        color: '',
        imageID: '',
        imageURL: '',
    }
    const SVGLayers = Array.from(
        svg.querySelectorAll('path, circle, rect, polygon, line, ellipse')
    );

    debugger;

    if (Object.keys(response).length >= SVGLayers.length)
        do {
            delete response[Object.keys(response)[Object.keys(response).length]];
            console.log(response)
        }
        while (Object.keys(response).length >= SVGLayers.length)
    else
        SVGLayers.forEach((layer, i) => {
            if (response.length > i)
                return;

            response[`${svg.dataset.item}__${uniqueId()}`] = obj;
        })

    console.log('dataObject', response)

    return response;
}

export const getSVGDefaults = props => {
    const {
        attributes: {
            uniqueID,
            SVGData
        },
        setAttributes
    } = props;

    return (
        <div
            className='maxi-svg-block__defaults'
        >
            {
                SVGDefaults.map(svgEl => (
                    <ReactSVG
                        src={svgEl}
                        className='maxi-svg-block__defaults__item'
                        onClick={e => {
                            if (!!e.target.ownerSVGElement) {
                                const svg = e.target.ownerSVGElement;
                                const resData = generateDataObject(SVGData, svg);
                                const resEl = injectImgSVG(svg, uniqueID, resData);

                                setAttributes({
                                    SVGElement: resEl.outerHTML,
                                    SVGMediaID: null,
                                    SVGData: JSON.stringify(resData)
                                })
                            }
                        }}
                    />
                ))
            }
        </div>
    )
}