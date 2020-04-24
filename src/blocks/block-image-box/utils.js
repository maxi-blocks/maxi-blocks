function renderImagePosition(param) {
    switch (param) {
        case 'left':
            return 'row';
        case 'right':
            return 'row-reverse';
        case 'bottom':
            return 'column-reverse';
        case 'top':
            return 'column';
        default:
            return 'column';
    }
}

export const setLinkStyles = ( props ) => {
    const {
        imagePosition
    } = props.attributes;

    return {
        flexDirection: renderImagePosition(imagePosition),
    }
}