import React from "react";
import { Component } from "react";
import { ChangeEvent } from "react";
import { Link } from "react-router-dom";

interface RegistrationState {
    name?: string;
    surname?: string;
    email?: string;
    password?: string;
    error: boolean;
}

interface RegistrationProps {}

class Registration extends Component<RegistrationProps, RegistrationState> {
    constructor(props: RegistrationProps) {
        super(props);
        this.state = {
            error: false,
            name: "",
            surname: "",
            email: "",
            password: "",
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
        console.log("Clicked submit in Registration!");
        console.log("newUser", newUser);

        fetch("/registration.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from POST/ registration", data);

                if (data.status === "Success") {
                    // location.replace("/");
                    location.reload();
                } else {
                    this.setState({
                        error: true,
                    });
                }
                console.log("this.state:", this.state);
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
                <h1>Join our community</h1>

                <p>
                    Registration ||
                    <Link to="/login"> Log in </Link>
                </p>
                <div className="error">
                    {this.state.error && <p>oops, something went wrong</p>}
                </div>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={this.handleChange}
                    required
                ></input>
                <input
                    type="text"
                    name="surname"
                    placeholder="Surname"
                    onChange={this.handleChange}
                    required
                ></input>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={this.handleChange}
                    required
                ></input>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={this.handleChange}
                    required
                ></input>
                <button onClick={this.handleSubmit}>Submit</button>
            </div>
        );
    }
}

export default Registration;
