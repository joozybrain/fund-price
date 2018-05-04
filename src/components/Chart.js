import React from "react";
import moment from "moment"
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineMarkSeries,
  Crosshair
} from "react-vis";

const MSEC_DAILY = 86400000;
const timestamp = new Date("September 9 2017").getTime();

class Chart extends React.Component {
  constructor(props) {
      super(props)
      this.state = { crosshairValues : []}
  }
render() {
  return (
    <XYPlot onMouseLeave={() => this.setState({crosshairValues: []})} xType="time" width={1000} height={500}>
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis tickFormat={v => `${moment(v).format("MMM DD")}`} tickTotal={this.props.data.length} title="Period of time" />
      <YAxis title="Price $" />
      <LineMarkSeries onNearestX={(value, {index}) =>
              this.setState({crosshairValues: [this.props.data[index]]})} data={this.props.data} fill="red" style={{ stroke: "red", strokeWidth: 3 }} />
      <Crosshair values={this.state.crosshairValues}/>
    </XYPlot>
  )};
};

export default Chart;
