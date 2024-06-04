import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { getUser, getMarkers, getCount } from "../../dux/reducer";
import "./Landing.css";

export class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name_: "",
      last_name: "",
      email: "",
      password: "",
      verPassword: "",
      registerView: false,
    };
  }

  // componentDidMount() {
  //   axios.get("/api/user").then((res) => {
  //     this.props.getUser(res.data[0]);
  //     this.props.history.push("/myMap");
  //   });
  // }

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleToggle = () => {
    this.setState({ registerView: !this.state.registerView });
  };

  handleRegister = (e) => {
    e.preventDefault();
    let { first_name, last_name, email, password, verPassword } = this.state;

    first_name = this.capitalizeFirstLetter(first_name)

    if (password && password === verPassword) {
      axios
        .post("/api/register", { first_name, last_name, email, password })
        .then((res) => {
          this.props.getUser(res.data[0]);
          this.props.getMarkers([]);
          this.props.getCount([{ cities: "0", countries: "0" }]);
          this.props.history.push("/myMap");
        })
        .catch((err) => console.log(err));
    } else {
      alert("Passwords don't match");
    }
    // axios
    //   .post("/api/email", { email, first_name })
    //   .catch((err) => console.log(err));
  };

  handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    axios
      .post("/api/login", { email, password })
      .then((res) => {
        console.log(res)
        this.props.getUser(res.data[0]); //user info
        this.props.getMarkers(res.data[1]); //marker info
        this.props.getCount(res.data[2]); //trip count info
        this.props.history.push("/myMap");
      })
      .catch((err) => console.log(err));
  };

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } 

  render() {
    return (
      <div className="landing-container">
        <section className="authentication-info">
          <form
            className="landForm"
            onSubmit={
              this.state.registerView ? this.handleRegister : this.handleLogin
            }
          >
            <h1>Welcome to trekit!</h1>
            {this.state.registerView ? (
              <div className="inputText">
                <h3>Register Below</h3>
                <input
                  value={this.state.first_name}
                  name="first_name"
                  placeholder="First Name"
                  onChange={(e) => this.handleInput(e)}
                />
                <input
                  value={this.state.last_name}
                  name="last_name"
                  placeholder="Last Name"
                  onChange={(e) => this.handleInput(e)}
                />
              </div>
            ) : (
              <h3>Login Below</h3>
            )}
            <div className="inputText">
              <input
                value={this.state.email}
                name="email"
                placeholder="Email"
                onChange={(e) => this.handleInput(e)}
              />
              <input
                value={this.state.password}
                name="password"
                type="password"
                placeholder="Password"
                onChange={(e) => this.handleInput(e)}
              />
            </div>
            {this.state.registerView ? (
              <div className="inputText">
                <input
                  value={this.state.verPassword}
                  name="verPassword"
                  type="password"
                  placeholder="Verify Password"
                  onChange={(e) => this.handleInput(e)}
                />
                <button onClick={this.handleRegister}>Register</button>
                <p className="white">
                  Have an account?{" "}
                  <span onClick={this.handleToggle}>Login here</span>
                </p>
              </div>
            ) : (
              <>
                {/*  */}
                <button onClick={this.handleLogin}>Login</button>
                <p className="white">
                  Don't have an account?{" "}
                  <span onClick={this.handleToggle}>Register here</span>
                </p>
              </>
            )}
          </form>
        </section>
      </div>
    );
  }
}

export default connect(null, { getUser, getMarkers, getCount })(Landing);
