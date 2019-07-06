import React from 'react';
import PropTypes from 'prop-types';
// import withStyles from 'isomorphic-style-loader/withStyles';
import s from './SvgPieTimer.scss';

class SvgPieTimer extends React.Component {

  static defaultProps = {
  };

  static propTypes = {
    duration: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    loops: PropTypes.number.isRequired,
    inverse: PropTypes.bool.isRequired,
    reverse: PropTypes.bool.isRequired,
  };

  static fmtMSS(second) {
    const result = (second - (second %= 60)) / 60 + (9 < second ? ':' : ':0') + s;
    return result;
  }

  constructor(props) {
    super(props);

    // This part might be confusing:
    // If n==0, do infinite loops
    // In other cases where n is set, do n loops
    // If n is not set, do 1 loop
    // Do it this way to prevent mixing n==0 and !n

    const duration = props.duration || 1000;
    const n = (props.loops === 0) ? 0 : props.loops ? props.loops : 1;
    const end = (Date.now()) + (duration * n);
    const totalDuration = duration * n;

    this.state = {
      duration,
      loops: n,
      end,
      totalDuration,
      showDuration: false,
    };

  }

  componentDidMount() {
    this.frame();
  }

  // Animate frame by frame
  frame() {
    const current = Date.now();
    const remaining = this.state.end - current;

    // Now set rotation rate
    // E.g. 50% of first loop returns 1.5
    // E.g. 75% of sixth loop returns 6.75
    // Has to return >0 for SVG to be drawn correctly
    // If you need the current loop, use Math.floor(rate)

    let rate = this.state.loops + 1 - remaining / this.state.duration;

    // As requestAnimationFrame will draw whenever capable,
    // the animation might end before it reaches 100%.
    // Let's simulate completeness on the last visual
    // frame of the loop, regardless of actual progress
    if (remaining < 60) {
      // 1.0 might break, set to slightly lower than 1
      // Update: Set to slightly lower than n instead
      this.draw(this.state.loops - 0.0001);


      // Stop animating when we reach the total number loops
      if(remaining < this.state.totalDuration && this.state.loops) return
    }


    if (this.props.reverse && this.props.reverse === true) {
      rate = 360 - rate;
    }

    this.draw(rate);

    // Draw after requesting the next frame
    requestAnimationFrame(this.frame.bind(this));
  }

  draw(rate) {
    let angle = 360 * rate;
    const { border, loader } = this;

    angle %= 360;

    const rad = (angle * Math.PI) / 180;
    const x = Math.sin(rad) * (this.props.width / 2);
    const y = Math.cos(rad) * (-(this.props.height / 2));
    let mid = (angle > 180) ? 1 : 0;
    let sweepDirection = 1;

    if (this.props.inverse && this.props.inverse === true) {
      mid = Math.abs(mid - 1);
      sweepDirection = 0;
    }

    const shape = `M 0 0 v ${-(this.props.height / 2)} A ${(this.props.width / 2)}  ${(this.props.width / 2)} 1 ${mid}  ${sweepDirection}  ${x}  ${y}  z`;

    if (border !== null) {
      this.border.setAttribute('d', shape);
    }
    if (loader !== null) {
      this.loader.setAttribute('d', shape);
    }
  }

  toggleShow = () => {
    this.setState({
      showDuration: !this.state.showDuration,
    });
  };

  render() {
    return (
      <div className={s['pie-timer']}>
        <svg
          className={s.svg}
          style={{'cursor': 'pointer'}}
          onClick={this.toggleShow}
          width={this.props.width}
          height={this.props.width}
          viewBox={"0 0 " + this.props.width + " " + this.props.height}
        >
          <path
            className={s['svg-border']}
            ref={(border) => {
              this.border = border;
            }}
            transform={"translate(" + this.props.width/2 + " " + this.props.height/2 + ")"}
          />
          <path
            className={s['svg-loader']}
            ref={(loader) => { this.loader = loader; }}
            transform={"translate(" + this.props.width/2 + " " + this.props.height/2 + ")  scale(1)"}
          />
        </svg>
        <span
          style={this.state.showDuration === true ? {'marginTop': '10px', 'cursor': 'pointer', 'display': 'block'} : {'display': 'none'}}
          onClick={this.toggleShow}
        >
          {SvgPieTimer.fmtMSS(((this.state.end - Date.now()) / 1000).toFixed(0))}
        </span>
      </div>
    );
  }
}

export default SvgPieTimer;
