export const setButtonStyles = ( props ) => {
    const {
        shadowColor,
        shadowHorizontal,
        shadowVertical,
        shadowBlur,
        shadowSpread,
    } = props.attributes;

    const getShadow = () => {
        let response = 'boxShadow: ';
        values.shadowColor ? response +=  (values.shadowColor + 'px') : null;
        values.shadowHorizontal ? response += (values.shadowHorizontal + 'px') : null;
        values.shadowVertical ? response += (values.shadowVertical + 'px') : null;
        values.shadowBlur ? response += (values.shadowBlur + 'px'): null;
        values.shadowSpread ? response += (values.shadowSpread + 'px'): null;

        return response.trim();
    }

    return(
        getShadow()
    )
}