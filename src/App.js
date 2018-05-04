import React, { Component } from "react";
import Chart from "./components/Chart";
import "./App.css";
import "../node_modules/react-vis/dist/style.css";

const API_URL = "https://nataliia-radina.github.io/react-vis-example/";

const MSEC_DAILY = 86400000;
const timestamp = new Date("September 9 2017").getTime();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { results: [], alertPrice: 1 };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async sendMail() {
    await fetch("/api/sendMail").then(response => {
      if (response.ok) {
        console.log("ok");
      } else {
        console.log("fail");
      }
    });
  }

  handleChange(event) {
    this.setState({ alertPrice: event.target.value });
  }

  handleSubmit(event) {
    alert("A Price target was submitted: " + this.state.alertPrice);
    event.preventDefault();

    fetch("/api/savePrice", {
      
    })
  }

  componentDidMount() {
    fetch(API_URL)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then(json => {
        this.setState({
          results: json.results.filter(r => {
            return r.name === "JavaScript";
          })
        });
      });

    if (this.state.alertPrice === 1) this.sendMail();
  }

  render() {
    const { results } = this.state;

    const data = [
      { x: timestamp + MSEC_DAILY, y: 8 },
      { x: timestamp + MSEC_DAILY * 2, y: 5 },
      { x: timestamp + MSEC_DAILY * 3, y: 4 },
      { x: timestamp + MSEC_DAILY * 4, y: 9 },
      { x: timestamp + MSEC_DAILY * 5, y: 1 }
    ];

    let todayPrice = data[data.length - 1].y;

    return (
      <div className="App">
        <div>
          {" "}
          <Chart data={data} />{" "}
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              Set Alert <input type="text" onChange={this.handleChange} />
            </label>
            <input type="submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default App;
