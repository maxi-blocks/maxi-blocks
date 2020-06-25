/**
 * External dependencies
 */
import React from 'react';
import { setBlockStyles } from './data';
import classnames from "classnames";
/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * SAVE function
 * @param props
 * @return {*}
 */
const save = (props) => {
    const {
        className,
        attributes: {
            id,
            testimonials,
            backgroundColor,
            backgroundImage,
            backgroundGradient,
            titleAlignment,
            titleStyle,
            imageAlignment,
            imageRound,
            blockStyle,
            defaultBlockStyle,
            blockAlignment,
            uniqueID
        }
    } = props;

    let classes = classnames( className );
    if ( uniqueID && (typeof uniqueID !== 'undefined') ) {
        classes = classnames( classes, uniqueID )
    }

    const blockStyles = setBlockStyles(props);

    const personImageAlign = (testimonial, imageAlignment, imageRound) => {
        return (
            testimonial.image
            &&
            (<div className="gts__picture" style={ ['left', 'right'].includes(imageAlignment) ? {float: imageAlignment} : { } }>
                <img
                    src={testimonial.image} alt=""
                    style={ ['left', 'right'].includes(imageAlignment)
                        ?
                        ( {float: imageAlignment,  backgroundImage: `url(${testimonial.image})`,
                        borderRadius: imageRound} )
                        :
                        {  backgroundImage: `url(${testimonial.image})`,
                        borderRadius: imageRound}
                    }
                />
            </div>)
        );
    };

    const testimonialsList = testimonials.map(function(testimonial) {

        return (

                <div className="col" key={testimonial.index}>
                    <div className="testimonial">
                        <span className="testimonial-index" style={{ display: "none" }}>
                            {testimonial.index}
                        </span>

                        { imageAlignment === 'top' ? personImageAlign(testimonial, imageAlignment, imageRound) : ''}
                        { imageAlignment === 'left' ? personImageAlign(testimonial, imageAlignment, imageRound) : ''}


                        <div className={"gts_personal_info  name"}>
                            <span className="testimonial-personNameSurname maxi-testimonial-name-surname">{testimonial.personNameSurname}</span>{" "}
                            {/*<span className="testimonial-personSurname">{testimonial.personSurname}</span>*/}
                            <span className="testimonial-personPosition">{testimonial.personPosition}</span>

                        </div>

                        <div>
                            {testimonial.linkOptionHref
                            &&
                            (<div className="person_link_options save">
                                <a href={testimonial.linkOptionHref} target={testimonial.linkOptionTarget}
                                   className="testimonial_person_link">{testimonial.linkOptionTitle}</a>
                            </div>)}
                            <div className="testimonial-title-container mt-3 col-9"
                                 style={{textAlign: titleAlignment, fontStyle: titleStyle}}>
                                {testimonial.title && (
                                    <p className="testimonial-title-name"  style={{textAlign: titleAlignment, fontStyle: titleStyle}}>
                                        <span className="testimonial-title">{testimonial.title}</span>
                                    </p>
                                )}
                                {testimonial.link && (
                                    <p className="testimonial-title-container">
                                        <a target="_blank" href={testimonial.link}>
                                            <i className="fas fa-user"/>
                                            <span className="testimonial-author-link">
                                                    {testimonial.link}
                                                </span>
                                        </a>
                                    </p>
                                )}
                            </div>
                            {testimonial.content && (
                                <p className="testimonial-text-container">
                                    <i className="fa fa-quote-left pull-left" aria-hidden="true"/>
                                    <span className="testimonial-text">{testimonial.content} </span>
                                    <i className="fa fa-quote-right pull-right" aria-hidden="true"/>
                                </p>
                            )}
                        </div>

                        { imageAlignment === 'bottom' ? personImageAlign(testimonial, imageAlignment, imageRound) : ''}
                        { imageAlignment === 'right' ? personImageAlign(testimonial, imageAlignment, imageRound) : ''}
                    </div>
                </div>
        );
    });

    if (testimonials.length > 0) {

        let backgroundImageWithGradient = backgroundGradient.length
            ? `linear-gradient(to right, ${backgroundGradient[0]},${backgroundGradient[1]})`
            : '';

        if (backgroundImage) {
            backgroundImageWithGradient += backgroundGradient.length
                ? `, url(${backgroundImage})`
                : `url(${backgroundImage})`
        }
        blockStyles.backgroundColor = backgroundColor ? backgroundColor : undefined;
        blockStyles.backgroundImage = backgroundImageWithGradient ? backgroundImageWithGradient : undefined ;

        return (
            <div className={"testimonials align" + blockAlignment} style={ blockStyles }>
                <div
                    id={id}
                    className={'inner maxi-block ' + blockStyle + ' maxi-image-box '}
                    data-gx_initial_block_class={defaultBlockStyle}>
                    <div className="row">
                        {testimonialsList}
                    </div>
                </div>
            </div>
        );
    } else return null;
};

export default save;