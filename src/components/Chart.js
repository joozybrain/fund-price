import React from "react";
import moment from "moment";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineMarkSeries,
  Crosshair
} from "react-vis";

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { crosshairValues: [] };
  }
  render() {
    return (
      <XYPlot
        onMouseLeave={() => this.setState({ crosshairValues: [] })}
        xType="time"
        width={1200}
        height={500}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis
          tickFormat={v => `${moment(v).format("MMM DD")}`}
          tickTotal={15}
          // tickTotal={this.props.data.length}
          title="Period of time"
        />
        <YAxis title="Price $" />
        <LineMarkSeries
          onNearestX={(value, { index }) => {
            this.setState({ crosshairValues: [this.props.data[index]] });
          }}
          data={this.props.data}
          fill="red"
          size="3"
          style={{ stroke: "red", strokeWidth: 1 }}
        />
        <Crosshair values={this.state.crosshairValues}>
          <div
            style={{
              background: "black",
              minWidth: "7em",
              padding: "1em",
              fontSize: "9px",
              color: "white"
            }}
          >
            <p>
              Date:{" "}
              {moment({ ...this.state.crosshairValues[0] }.x).format(
                "DD-MM-YYYY"
              )}
            </p>
            <p>Price: {{ ...this.state.crosshairValues[0] }.y}</p>
          </div>
        </Crosshair>
      </XYPlot>
    );
  }
}

export default Chart;
