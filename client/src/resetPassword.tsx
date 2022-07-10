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
        // console.log("Handel Change is running");
        console.log("event.target.value", event.target.value);

        // FIXME! see a nicer way to do it!
        switch (event.target.name) {
            case "email":
                this.setState({
                    [event.target.name]: event.target.value,
                });
                break;
            case "code":
                this.setState({
                    [event.target.name]: event.target.value,
                });
                break;
            case "newPassword":
                this.setState({
                    [event.target.name]: event.target.value,
                });
                break;

            default:
                break;
        }
        console.log("this.state:", this.state);

        // this.setState(
        //     {
        //         [event.target.name as keyof typeof LogInState]:
        //             event.target.value,
        //     },
        //     () => console.log("this.state:", this.state)
        // ); e: Event & { target: Element }
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
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            ref="emailRef"
                            onChange={this.handleChange}
                        ></input>
                        <button onClick={this.handleSendEmail}>Submit</button>
                        <h1>View 1: one input (email) & one button</h1>
                    </div>
                );
            case 2:
                return (
                    <div className="form">
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
                        <h1>
                            View 2: two inputs (reset code, new pw), & one
                            button
                        </h1>
                    </div>
                );
            case 3:
                // remember to also add a link to login ;)
                return (
                    <div className="form">
                        <h1>success msg & link back to Login!</h1>
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
                {this.state.error && (
                    <p className="error">oops, something went wrong</p>
                )}
                {/* call the method */}
                {this.determineViewToRender()}
            </div>
        );
    }
}

export default ResetPassword;
