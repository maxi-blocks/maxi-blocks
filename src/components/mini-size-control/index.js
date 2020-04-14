/**
 * WordPress Dependencies
 */
const {	
    RadioControl, 
    RangeControl 
} = wp.components;

/**
 * Block
 */
const MiniSizeControl = props => {

    const {
        label,
        className = '',
        unit,
        onChangeUnit,
        value,
        onChangeValue
    } = props;

    return (
        <div className={className}>
            <RadioControl
                className={'gx-unit-control'}
                selected={unit}
                options={[
                    { label: 'PX', value: 'px' },
                    { label: 'EM', value: 'em' },
                    { label: 'VW', value: 'vw' },
                    { label: '%', value: '%' },
                ]}
                onChange={onChangeUnit}
            />
            <RangeControl
                label={label}
                className={'gx-with-unit-control'}
                value={value}
                onChange={onChangeValue}
                min={0}
                allowReset={true}
                initialPosition={0}
            />
        </div>
    )
}

export default MiniSizeControl;