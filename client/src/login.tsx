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
        // console.log("Handel Change is running");
        console.log(event.target.value);

        // FIXME! see a nicer way to do it!
        switch (event.target.name) {
            case "email":
                this.setState(
                    {
                        [event.target.name]: event.target.value,
                    },
                    () => console.log("this.state:", this.state)
                );
                break;
            case "password":
                this.setState(
                    {
                        [event.target.name]: event.target.value,
                    },
                    () => console.log("this.state:", this.state)
                );
                break;
            default:
                break;
        }

        // this.setState(
        //     {
        //         [event.target.name as keyof typeof LogInState]:
        //             event.target.value,
        //     },
        //     () => console.log("this.state:", this.state)
        // );
    }
    handleSubmit() {
        console.log("Clicked submit!");
        const { error, ...newUser } = this.state;
        console.log("newUser", newUser);
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from POST/ login", data);

                if (data.status === "Success") {
                    location.reload();
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
                <h1> Rendering Registration</h1>
                <p>
                    <Link to="/"> Registration </Link> || Log in
                </p>
                {this.state.error && (
                    <p className="error">oops, something went wrong</p>
                )}
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
