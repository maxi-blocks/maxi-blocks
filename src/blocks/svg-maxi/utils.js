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
    isArray,
    isEmpty
} from 'lodash';

/**
 * Utils
 */
export const injectImgSVG = (svg, uniqueID, SVGData) => {
    const SVGValue = !isArray(SVGData) ?
        JSON.parse(SVGData) :
        SVGData;

    console.log(SVGData)

    const SVGLayers = Array.from(
        svg.querySelectorAll('path, circle, rect, polygon, line, ellipse')
    );

    SVGValue.forEach((el, i) => {
        if (!isEmpty(el.imageURL)) {
            let pattern = document.createElement('pattern');
            pattern.id = `${el.id}__img`;
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
            svg.prepend(pattern)

            SVGLayers[i].style.fill = `url(#${el.id}__img)`;
            SVGLayers[i].setAttribute('fill', `url(#${el.id}__img)`)
        }
        else if (!isEmpty(el.color)) {
            SVGLayers[i].style.fill = el.color;
            SVGLayers[i].setAttribute('fill', el.color)
        }
    })

    svg.dataset.item = `${uniqueID}__svg`;

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

    if (response.length >= SVGLayers.length)
        response.splice(-(response.length - SVGLayers.length), response.length - SVGLayers.length);
    else
        SVGLayers.forEach((layer, i) => {
            if (response.length > i)
                return;

            const newObj = { ...obj };
            newObj.id = `${svg.dataset.item}__${uniqueId()}`;
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