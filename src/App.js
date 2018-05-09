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
    this.state = { results: [], alertPrice: "1", user: 1, jsonPriceAlert: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  sendMail() {
    const fromAddress = "prualert@company.com";
    const subject = "Price Alert";
    const text = `Hi! Price has reached.`;
    const toAddress = "joozybrain@yahoo.com";

    try {
      fetch("/api/sendMail", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAddress: fromAddress,
          subject: subject,
          text: text,
          toAddress: toAddress
        })
      }).then(response => {
        if (response.ok) {
          console.log("Mail Sent!");
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
    alert("A Price Alert was set: " + this.state.alertPrice);
    event.preventDefault();
    try {
      fetch("/api/setPriceAlert", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: this.state.alertPrice,
          user: this.state.user
        })
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            console.log("Price Alert not set");
          }
        })
        .then(json => {
          console.log("Price Alert Set OK at " + json.price);
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
      .then(() => {
        fetch(`/api/getPriceAlert/${this.state.user}`)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Not able to get Price");
            }
          })
          .then(json => {
            this.setState({ jsonPriceAlert: json.price });
          })
          .then(() => {
            if (
              this.state.jsonPriceAlert ===
              {
                ...this.state.results[this.state.results.length - 1]
              }.y.toString()
            ) {
              this.sendMail();
            }
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <React.Fragment>
        <div className="App">
          <div>
            {" "}
            <Chart data={this.state.results} />{" "}
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
        <div>
          Last loaded Price:{" "}
          {{ ...this.state.results[this.state.results.length - 1] }.y}@{moment(
            { ...this.state.results[this.state.results.length - 1] }.x
          ).format("DD-MMM")}
        </div>
        <div>Price Alert Set in DB: {this.state.jsonPriceAlert}</div>
      </React.Fragment>
    );
  }
}

export default App;
