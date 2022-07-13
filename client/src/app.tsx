import React from "react";
import { Component } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

import Logo from "./logo";
import ProfilePhoto from "./profilePhoto";
import Profile from "./profile";
import Uploader from "./uploader";
import FindPeople from "./findPeople";

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
        console.log("logging this after bio", this);
    }
    logOutFunction() {}

    /* TODO: app-container can go and the header div can actually be a header 
    
    div className="app-container"
    */
    render() {
        return (
            <>
                {this.state.uploaderVisible && (
                    <Uploader upDatingPhoto={this.upDatingPhoto} />
                )}

                <BrowserRouter>
                    <header className="header">
                        <Link to="/">
                            <Logo />
                        </Link>
                        <nav>
                            <Link
                                to="/searchPeople"
                                className="find-friend-color"
                            >
                                Find Friends
                            </Link>
                            <Link to="/" className="profile-color">
                                Profile
                            </Link>
                            <Link to="/" onClick={this.logOutFunction}>
                                Log Out
                            </Link>
                        </nav>
                        <ProfilePhoto
                            name={this.state.name}
                            surname={this.state.surname}
                            photoUrl={this.state.photourl}
                            toggleUploader={this.toggleUploader}
                        />
                    </header>
                    <Switch>
                        <Route exact path="/">
                            <Profile
                                name={this.state.name}
                                surname={this.state.surname}
                                photoUrl={this.state.photourl}
                                bio={this.state.bio}
                                toggleUploader={this.toggleUploader}
                                upDateBio={this.upDateBio}
                            />
                        </Route>
                        <Route path="/searchPeople">
                            <FindPeople />
                        </Route>
                        <Route exact path="/logout">
                            {/* <Registration /> */}
                        </Route>
                    </Switch>
                </BrowserRouter>
            </>
        );
    }
}
