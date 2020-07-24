/**
 * External dependencies
 */
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider'

/**
 * Styles and icons
 */
import './editor.scss';

function Track({ source, target, getTrackProps }) {
    return (
      <div
        style={{
          position: 'absolute',
          height: 10,
          zIndex: 1,
          marginTop: 35,
          backgroundColor: '#546C91',
          borderRadius: 5,
          cursor: 'pointer',
          left: `${source.percent}%`,
          width: `${target.percent - source.percent}%`,
        }}
        {...getTrackProps() /* this will set up events if you want it to be clickeable (optional) */}
      />
    )
  }

export function Handle({
    handle: { id, value, percent },
    getHandleProps
  }) {
    return (
      <div
        style={{
          left: `${percent}%`,
          position: 'absolute',
          marginLeft: -15,
          marginTop: 25,
          zIndex: 2,
          width: 30,
          height: 30,
          border: 0,
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: '50%',
          backgroundColor: '#2C4870',
          color: '#333',
        }}
        {...getHandleProps(id)}
      >
        <div style={{ fontFamily: 'Roboto', fontSize: 11, marginTop: -35 }}>
          {value}
        </div>
      </div>
    )
  }

/**
 * Component
 */
const AdvancedRangeControl = props => {

    const sliderStyle = {  // Give the slider some width
        position: 'relative',
        width: '100%',
        height: 80,
        marginTop: 15,
        marginBottom: 15,
    }

    const railStyle = {
        position: 'absolute',
        width: '100%',
        height: 4,
        marginTop: 35,
        borderRadius: 5,
        backgroundColor: '#dddfe1',
    }

    const {
        value,
        onChangeValue,
    } = props;

    return (
        <div className="maxi-advanced-range-control">

            <Slider
                className='maxi-advanced-range-control__slider'
                rootStyle={sliderStyle}
                domain={[0, 100]}
                step={1}
                mode={3}
                values={value}
                onChange={values => {
                    onChangeValue(values);
                }}
            >
                <Rail>
                {({ getRailProps }) => (
                    <div style={railStyle} {...getRailProps()} />
                )}
                </Rail>
                <Handles>
                {({ handles, getHandleProps }) => (
                    <div className="slider-handles">
                    {handles.map(handle => (
                        <Handle
                        key={handle.id}
                        handle={handle}
                        getHandleProps={getHandleProps}
                        />
                    ))}
                    </div>
                )}
                </Handles>
                <Tracks left={false} right={false}>
                {({ tracks, getTrackProps }) => (
                    <div className="slider-tracks">
                    {tracks.map(({ id, source, target }) => (
                        <Track
                        key={id}
                        source={source}
                        target={target}
                        getTrackProps={getTrackProps}
                        />
                    ))}
                    </div>
                )}
                </Tracks>
                <Ticks values={['Viewport Bottom', 'Viewport Top']}>
                {({ ticks }) => (
                    <div className="slider-ticks">
                      {ticks.map(tick => (
                        <div className='slider-ticks__tick'>{tick.value}</div>
                      ))}
                    </div>
                )}
                </Ticks>
            </Slider>

        </div>
    )

}

export default AdvancedRangeControl;