import React from "react";
import { Component } from "react";
import Logo from "./logo";
import ProfilePhoto from "./profilePhoto";
import Profile from "./profile";
import Uploader from "./uploader";

interface AppState {
    name?: string;
    surname?: string;
    photourl?: string;
    bio?: string;
    email?: string;
    uploaderVisible: boolean;
}

interface AppProps {}

// <AppProps, AppState>
export default class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            name: "",
            surname: "",
            photourl: "",
            uploaderVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.upDatingPhoto = this.upDatingPhoto.bind(this);
        this.upDateBio = this.upDateBio.bind(this);
    }

    componentDidMount(): void {
        fetch("/getUserInfo.json")
            .then((resp) => resp.json())
            .then((data) => {
                console.log("data from GET / UserInfo", data);
                this.setState(
                    {
                        ...this.state,
                        ...data.data,
                    },
                    () => console.log("this.state:", this.state)
                );
            })
            .catch(() => {});
    }

    toggleUploader() {
        console.log("ToggleModal is running");
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    upDatingPhoto(url: string) {
        console.log("This is arg", url);
        this.setState({
            photourl: url,
            uploaderVisible: false,
        });
    }

    upDateBio(newBio: string) {
        // Here we want to update the bio.
        console.log("Getting data from edit Bio", newBio);
        this.setState({
            bio: newBio,
        });
        console.log("loging this after bio", this);
    }

    render() {
        return (
            <div className="app-container">
                <div className="header">
                    <Logo />
                    <ProfilePhoto
                        name={this.state.name}
                        surname={this.state.surname}
                        photoUrl={this.state.photourl}
                        toggleUploader={this.toggleUploader}
                    />
                </div>
                {this.state.uploaderVisible && (
                    <Uploader upDatingPhoto={this.upDatingPhoto} />
                )}

                {
                    <Profile
                        name={this.state.name}
                        surname={this.state.surname}
                        photoUrl={this.state.photourl}
                        bio={this.state.bio}
                        toggleUploader={this.toggleUploader}
                        upDateBio={this.upDateBio}
                    />
                }
            </div>
        );
    }
}
