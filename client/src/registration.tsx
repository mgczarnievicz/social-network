import { Component } from "react";

interface IProps {
    id: string;
}

// interface RegistrationState {
//     name?: string;
//     surname?: string;
//     email?: string;
//     password?: string;
//     error: boolean;
// }

interface RegistrationState {
    name?: unknown;
    surname?: unknown;
    email?: unknown;
    password?: unknown;
    error: boolean;
}

class Registration extends Component<{}, RegistrationState> {
    constructor(props) {
        super(props);
        this.state = {
            // name: "",
            // surname: "",
            // email: "",
            // password: "",
            error: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /* TODO:
    1. render 4 inputs fields + button
    2. capture the users input ans store it state
    3. when the user submit, we want to send that data to the server
    4. if sth goes  wrong conditionar render and error.
    4. if everzthing goes well shw them the logo.
    */

    handleChange(e) {
        // console.log("Handel Change is running");
        console.log(e.target.value);

        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state:", this.state)
        );
    }
    handleSubmit() {
        console.log("Clicked submit!");
        fetch("/registration", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from POST/ registration", data);

                // trigger the page to reload
                location.reload();
            });
    }

    render() {
        return (
            <div>
                <h1> Rendering Registration</h1>
                {this.state.error && (
                    <p className="error">oops, something went wrong</p>
                )}

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={this.handleChange}
                ></input>
                <input
                    type="text"
                    name="surname"
                    placeholder="Surname"
                    onChange={this.handleChange}
                ></input>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={this.handleChange}
                ></input>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={this.handleChange}
                ></input>
                <button onClick={this.handleSubmit}>Submit</button>
            </div>
        );
    }
}

export default Registration;
