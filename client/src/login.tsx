import React from "react";
import { Component } from "react";
import { ChangeEvent } from "react";
import { Link } from "react-router-dom";

interface LogInState {
    email?: string;
    password?: string;
    error: boolean;
}

interface LogInProps {}

class LogIn extends Component<LogInProps, LogInState> {
    constructor(props: LogInProps) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(
            {
                // Bc not all of the key are optional i always need to set them. So I deconstruct and set the one that i want
                ...this.state,
                [event.target.name]: event.target.value,
            },
            () => console.log("this.state in handleChange:", this.state)
        );
    }
    handleSubmit() {
        const { error, ...newUser } = this.state;

        fetch("/login.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.status === "Success") {
                    location.replace("/");
                } else {
                    this.setState(
                        {
                            error: true,
                        },
                        () => console.log("this.state:", this.state)
                    );
                }
            })
            .catch(() => {
                this.setState(
                    {
                        error: true,
                    },
                    () => console.log("this.state:", this.state)
                );
            });
    }

    render() {
        return (
            <div className="form">
                <h1> Log In</h1>
                <p>
                    <Link to="/"> Registration </Link> || Log in
                </p>
                <div className="error">
                    {this.state.error && <p>oops, something went wrong</p>}
                </div>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    onChange={this.handleChange}
                ></input>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    onChange={this.handleChange}
                ></input>
                <button onClick={this.handleSubmit}>Submit</button>
                <p>
                    <Link to="/resetPassword"> Forgot password? </Link>
                </p>
            </div>
        );
    }
}

export default LogIn;
