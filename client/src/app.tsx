import React from "react";
import { Component } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

import Logo from "./logo";
import ProfilePhoto from "./profilePhoto";
import Profile from "./profile";
import Uploader from "./uploader";
import FindPeople from "./findPeople";
import OtherProfile from "./otherProfile";
import Wall from "./wall";
import FriendsAndWannabees from "./friendsWannabees";
import { ProfileInfoWBio, EmptyProps } from "./typesClient";

// interface AppState {
//     id?: number;
//     name?: string;
//     surname?: string;
//     photourl?: string;
//     bio?: string[];
//     email?: string;
//     uploaderVisible: boolean;
// }

// interface AppProps {}

interface AppState extends ProfileInfoWBio {
    email?: string;
    uploaderVisible: boolean;
}

// <AppProps, AppState>
export default class App extends Component<EmptyProps, AppState> {
    constructor(props: EmptyProps) {
        super(props);
        this.state = {
            id: null,
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
                data.data.bio = data.data.bio.split("\n");
                console.log("Data after splitting", data);
                this.setState(
                    {
                        ...this.state,
                        ...data.data,
                    },
                    () =>
                        console.log(
                            "this.state after /getUserInfo.json:",
                            this.state
                        )
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
        const bioToSet = newBio.split("\n");

        this.setState({
            bio: bioToSet,
        });
        console.log("logging this after bio", this);
    }
    logOutFunction() {
        fetch("/logout.json")
            .then((resp) => resp.json())
            .then((data) => {
                if (data.status === "Success") {
                    location.reload();
                }
            });
    }

    render() {
        return (
            <>
                {this.state.uploaderVisible && (
                    <Uploader
                        upDatingPhoto={this.upDatingPhoto}
                        toggleUploader={this.toggleUploader}
                    />
                )}

                <BrowserRouter>
                    <header className="header">
                        <Link to="/">
                            <Logo />
                        </Link>
                        <nav>
                            <Link to="/news">News</Link>
                            <Link to="/friends">Friends</Link>
                            <Link to="/searchPeople">Find Friends</Link>
                            <Link to="/">Profile</Link>
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
                                id={this.state.id}
                                name={this.state.name}
                                surname={this.state.surname}
                                photourl={this.state.photourl}
                                bio={this.state.bio}
                                toggleUploader={this.toggleUploader}
                                upDateBio={this.upDateBio}
                            />
                        </Route>
                        <Route path="/searchPeople">
                            <FindPeople />
                        </Route>
                        <Route path="/user/:idUserToSee">
                            <OtherProfile />
                        </Route>
                        <Route path="/news">
                            <Wall wallUserId={this.state.id} />
                        </Route>
                        <Route path="/friends">
                            <FriendsAndWannabees />
                        </Route>
                    </Switch>
                </BrowserRouter>
            </>
        );
    }
}
