import React from "react";
import { Component } from "react";
import Logo from "./logo";
import ProfilePhoto from "./profilePhoto";
import Uploader from "./uploader";

interface AppState {
    name?: string;
    surname?: string;
    // email?: string;
    photoUrl?: string;
    uploaderVisible: boolean;
}

interface AppProps {}

// <AppProps, AppState>
export default class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            name: "Maria",
            surname: "Inciarte",
            photoUrl: "",
            uploaderVisible: false,
        };
    }

    componentDidMount(): void {
        console.log("App Mounted!");

        /* TODO:
        We want the user info:
            name, surname, photo. When we have it we want to set ir to the state. (this.setState)

        */
    }
    toggleModal() {
        console.log("ToggleModal is running");
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    methodInApp(arg: boolean) {
        console.log("This is arg", arg);
    }
    render() {
        return (
            <div>
                <Logo />
                <ProfilePhoto
                    name={this.state.name}
                    surname={this.state.surname}
                    photoUrl={this.state.photoUrl}
                />
                <h1>Profile Picture Component.</h1>

                {this.state.uploaderVisible && (
                    <Uploader methodInApp={this.methodInApp} />
                )}
            </div>
        );
    }
}
