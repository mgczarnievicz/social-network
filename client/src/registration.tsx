import { Component } from "react";
import { ChangeEvent } from "react";
import { Link } from "react-router-dom";

interface IProps {
    id: string;
}

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
            name: "",
            surname: "",
            email: "",
            password: "",
            error: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /* TODO:
    1. render 4 inputs fields + button
    2. capture the users input ans store it state
    3. when the user submit, we want to send that data to the server
    4. if sth goes  wrong conditional render and error.
    4. if everything goes well shw them the logo.
    */

    // HTMLInputElement
    // e: ChangeEvent<{ value: string }>

    /* 
    
    (property) React.InputHTMLAttributes<HTMLInputElement>.onChange?: React.ChangeEventHandler<HTMLInputElement>
     React.FormEvent<HTMLInputElement>
      React.ChangeEventHandler<HTMLInputElement>

       React.ChangeEvent<HTMLInputElement>
      React.SyntheticEvent
    */
    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // console.log("Handel Change is running");
        console.log(event.target.value);

        /* 
        FIXME!!!!!!!!
        look for a nice solution!!!
         */
        switch (event.target.name) {
            case "name":
                this.setState(
                    {
                        [event.target.name]: event.target.value,
                    },
                    () => console.log("this.state:", this.state)
                );
                break;
            case "surname":
                this.setState(
                    {
                        [event.target.name]: event.target.value,
                    },
                    () => console.log("this.state:", this.state)
                );
                break;
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

        // if (key === "name" || key === "surname" || key === "email") {
        //     this.setState(
        //         {
        //             [key]: event.target.value,
        //         },
        //         () => console.log("this.state:", this.state)
        //     );
        // }

        // this.setState(
        //     {
        //         [event.target.name as "name"]: event.target.value,
        //     },
        //     () => console.log("this.state:", this.state)
        // );
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

                <p>
                    Registration ||
                    <Link to="/login"> Log in </Link>
                </p>
                {this.state.error && (
                    <p className="error">oops, something went wrong</p>
                )}
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
