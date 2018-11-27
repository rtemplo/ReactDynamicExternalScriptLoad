import React, { PureComponent } from "react"
import logo from "./logo.svg"
import Script from "react-load-script"
// import DependencyFiles from "/ng-elements/ngFiles.json"
import axios from "axios"
import "./App.css"

class App extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      username: "default-username",
      password: "default-password",
      scriptsCreated: 0,
      scriptsLoaded: 0,
      scriptError: false,
      scriptsToLoad: null
    }
  }

  componentDidMount = () => {
    console.log("CDM")
    axios.get("/ng-elements/ngFiles.json").then(res => {
      this.setState({ scriptsToLoad: res.data.scriptFiles })
    })
  }

  componentDidUpdate() {
    console.log("CDU")
    if (this.state.scriptsLoaded === 3) {
      this.nv.addEventListener("login", this.handleNvEnter)
    }
  }

  componentWillUnmount() {
    this.nv.removeEventListener("login", this.handleNvEnter)
  }

  handleNvEnter = event => {
    this.setState({
      username: event.detail.username,
      password: event.detail.password
    })
  }

  handleScriptCreate = () => {
    this.setState(prevState => ({
      scriptsCreated: prevState.scriptsCreated + 1
    }))
  }

  handleScriptLoad = () => {
    this.setState(prevState => ({
      scriptsLoaded: prevState.scriptsLoaded + 1
    }))
  }

  handleScriptError = () => {
    this.setState({ scriptError: true })
  }

  loadScripts = () => {
    if (this.state.scriptsToLoad != null) {
      return this.state.scriptsToLoad.map((script, idx) => {
        return (
          <Script
            key={idx}
            url={"/ng-elements/" + script}
            onCreate={this.handleScriptCreate}
            onError={this.handleScriptError}
            onLoad={this.handleScriptLoad}
          />
        )
      })
    }
  }

  render() {
    return (
      <div className="App">
        {this.loadScripts()}
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">
            Welcome to React + Angular Component Integration Demo
          </h1>
        </header>

        <div>Created Scripts: {this.state.scriptsCreated}</div>
        <div>Loaded Scripts: {this.state.scriptsLoaded}</div>

        {this.state.scriptsLoaded === 3 && !this.state.scriptError ? (
          <ng-login
            ref={elem => (this.nv = elem)}
            username={this.state.username}
            password={this.state.password}
          />
        ) : (
          <div>Still loading scripts</div>
        )}
        <br />

        <h3>React.js - Output</h3>
        <div>User Name: {this.state.username}</div>
        <div>password: {this.state.password}</div>
      </div>
    )
  }
}

export default App
