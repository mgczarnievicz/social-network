import { log } from "console";
import React from "react";
import { Component } from "react";
import { ChangeEvent } from "react";
import { Link } from "react-router-dom";

interface ResetState {
    email?: string;
    code?: string;
    newPassword?: string;
    view: number;
    error: boolean;
}

interface ResetProps {}

/* TODO: clear input. I don't know why I got something in code even though nothing was written. Its keep the email input value  */

class ResetPassword extends Component<ResetProps, ResetState> {
    constructor(props: ResetProps) {
        super(props);
        this.state = {
            email: "",
            code: "",
            newPassword: "",
            view: 1,
            error: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSendEmail = this.handleSendEmail.bind(this);
        this.handleSetNewPassword = this.handleSetNewPassword.bind(this);
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
    handleSendEmail() {
        console.log("Send Email!");
        console.log("this.state.email", this.state.email);
        const { error, view, ...userInput } = this.state;
        console.log("userInput", userInput);

        fetch("/resetPassword/sendEmail.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInput),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from POST/ SendEmail", data);

                if (data.status === "Success") {
                    this.setState({
                        view: 2,
                        error: false,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });
        // (e.target as HTMLInputElement)
        // emailRef.current.value = "";
        console.log("this.state:", this.state);
    }

    handleSetNewPassword() {
        console.log("Set New Password");
        const { error, view, ...userInput } = this.state;
        console.log("userInput", userInput);
        fetch("/resetPassword/setNewPassword.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInput),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from POST/ setNewPassword", data);

                if (data.status === "Success") {
                    this.setState({
                        view: 3,
                        error: false,
                    });
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });
        console.log("this.state:", this.state);
    }

    determineViewToRender() {
        // this method determines what the render!
        switch (this.state.view) {
            case 1:
                return (
                    <div className="form">
                        <h2>Step 1:</h2>
                        <p>Enter your mail</p>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            ref="emailRef"
                            onChange={this.handleChange}
                        ></input>
                        <button onClick={this.handleSendEmail}>Submit</button>
                    </div>
                );
            case 2:
                return (
                    <div className="form">
                        <h2>Step 2:</h2>
                        <p>
                            Verify your email where you recived your code and
                            enter a new password
                        </p>
                        <input
                            type="text"
                            name="code"
                            placeholder="code"
                            required
                            ref="codeRef"
                            onChange={this.handleChange}
                        ></input>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Password"
                            required
                            ref="passwordRef"
                            onChange={this.handleChange}
                        ></input>
                        <button onClick={this.handleSetNewPassword}>
                            Submit
                        </button>
                    </div>
                );
            case 3:
                // remember to also add a link to login ;)
                return (
                    <div className="form">
                        <h1>
                            Your Password was successfully change. Please Log In
                        </h1>
                        <p>
                            <Link to="/login"> Log in </Link>
                        </p>
                    </div>
                );
        }
    }

    render() {
        return (
            <div>
                <h1>Follow the next steps to reset your Password.</h1>
                <div className="error">
                    {this.state.error && <p>oops, something went wrong</p>}
                </div>

                {/* call the method */}
                {this.determineViewToRender()}
            </div>
        );
    }
}

export default ResetPassword;
