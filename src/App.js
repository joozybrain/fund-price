import React, { Component } from "react";
import Chart from "./components/Chart";
import moment from "moment";
import "./App.css";
import "../node_modules/react-vis/dist/style.css";

const API_URL =
  "https://www.quandl.com/api/v3/datasets/XSES/BEC.json?api_key=AsjQT56fzWTdZUBNDked&start_date=2018-03-01&order=asc";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { results: [], alertPrice: "1", user: 1 };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  sendMail() {
    try {
      fetch("/api/sendMail").then(response => {
        if (response.ok) {
          console.log("ok");
        } else {
          console.log("fail");
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  handleChange(event) {
    this.setState({ alertPrice: event.target.value });
  }

  handleSubmit(event) {
    alert("A Price target was set: " + this.state.alertPrice);
    event.preventDefault();
    try {
      fetch("/api/setPrice", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: this.state.alertPrice,
          user: 1
        })
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            console.log("Price not set");
          }
        })
        .then(json => {
          console.log("Price Set OK at " + json.price);
        });
    } catch (err) {
      console.log(err);
    }
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
          results: json.dataset.data.map(e => {
            return { x: moment(e[0], "YYYY-MM-DD").valueOf(), y: e[4] };
          })
        });
      })
      .catch(err => {
        console.log(err);
      });

    fetch(`/api/getPrice/${this.state.user}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Not able to get Price");
        }
      })
      .then(json => {
        if (json.price === this.state.alertPrice) {
          console.log("json price" + json.price);
          this.sendMail();
        }
      });
  }

  render() {
    const { results } = this.state;

    //let todayPrice = data[data.length - 1].y;

    return (
      <div className="App">
        <div>
          {" "}
          <Chart data={results} />{" "}
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
