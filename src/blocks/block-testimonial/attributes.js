import { blockStyleAttributes } from '../../components/block-styles/index';
import { sizeControlAttributes } from '../../components/size-control/index';
import { typographyAttributes } from '../../components/typography'
import { paddingMarginControlAttributes } from '../../components/padding-margin-control/index';

const attributes = {
    id: {
        source: "attribute",
        selector: ".inner",
        attribute: "id"
    },
    className: {
        type: 'string',
        default: '',
    },
    testimonials: {
        source: "query",
        default: [

        ],
        selector: ".testimonial",
        query: {
            image: {
                source: "attribute",
                selector: "img",
                attribute: "src"
            },
            index: {
                source: "text",
                selector: "span.testimonial-index"
            },
            content: {
                source: "text",
                selector: "span.testimonial-text"
            },
            title: {
                source: "text",
                selector: ".testimonial-title"
            },
            subtitle: {
                source: "text",
                selector: "span.testimonial-subtitle span"
            },
            link: {
                source: "text",
                selector: ".testimonial-author-link"
            },
            personNameSurname: {
                type: 'array',
                source: 'children',
                selector: ".gx-testimonial-name-surname"
            },
            personPosition: {
                source: "text",
                selector: ".testimonial-personPosition"
            },
            linkOptionHref: {
                source: "attribute",
                selector: "a.testimonial_person_link",
                attribute: "href"
            },
            linkOptionTitle: {
                source: "text",
                selector: "a.testimonial_person_link",
            },
            linkOptionTarget: {
                source: "attribute",
                selector: "a.testimonial_person_link",
                attribute: "target"
            }
        }
    },
    titleStyle: {
        type: 'string',
        default: "normal",
    },
    titleAlignment: {
        type: 'string',
        default: "left",
    },
    backgroundColor: {
        type: 'string',
        default: "",
    },
    backgroundImage: {
        type: 'string',
        default: "",
    },
    backgroundGradient: {
        type: 'array',
        default: [],
    },
    defaultPalette: {
        type: 'array',
        default: [
            { offset: '0.00', color: 'rgba(238, 55, 11, 1)' },
            { offset: '1.00', color: 'rgba(126, 32, 34, 1)' }
        ]
    },
    imageAlignment: {
        type: 'string',
        default: "top",
    },
    imageRound: {
        type: 'string',
        default: "0",
    },
    titlePopUpIsVisible: {
        type: 'boolean',
        default: false,
    },
    textAlignment: {
        type: 'string',
    },
    blockAlignment: {
        type: 'string',
        default: 'wide',
    },
    titlePosition: {
        type: 'string',
        default: 'top'
    },
    ...typographyAttributes,
    ...blockStyleAttributes,
    ...sizeControlAttributes,
    ...paddingMarginControlAttributes
};

export default attributes;