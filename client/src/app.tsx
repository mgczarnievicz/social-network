import React, { useEffect, useState } from "react";
import { Component } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";

import Logo from "./logo";
import ProfilePhoto from "./profilePhoto";
import Profile from "./profile";
import Uploader from "./uploader";
import FindPeople from "./findPeople";
import OtherProfile from "./otherProfile";
import Wall from "./wall";
import Chat from "./chat";

import FriendsAndWannabees from "./friendsWannabees";
import { ProfileInfoWBio, EmptyProps } from "./typesClient";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/reducer";
import { ProfileInfo } from "./typesClient";

import {
    asyncReceiveUser,
    userUpdateBio,
    userUpdatePhotoUrl,
} from "./redux/user/slice";

export default function App(props: EmptyProps) {
    const dispatch = useDispatch();
    const [uploaderVisible, setUploaderVisible] = useState(false);
    const userInfo = useSelector((state: RootState) => state.user);
    console.log("In App", userInfo);

    useEffect(() => {
        let abort = false;
        console.log("I am in the useEffect in App");

        dispatch(asyncReceiveUser(abort));
        return () => {
            console.log("cleanup running");
            abort = true;
        };
    }, []);

    function toggleUploader() {
        console.log("ToggleModal is running");
        setUploaderVisible(!uploaderVisible);
    }

    function upDatingPhoto(url: string) {
        console.log("This is arg", url);
        setUploaderVisible(false);
        dispatch(userUpdatePhotoUrl(url));
    }

    function upDateBio(newBio: string) {
        // Here we want to update the bio. This will be done in BIO!
        console.log("Getting data from edit Bio", newBio);
        const bioToSet = newBio.split("\n");
        dispatch(userUpdateBio(bioToSet));
        // console.log("logging this after bio", this);
    }
    function logOutFunction() {
        fetch("/logout.json")
            .then((resp) => resp.json())
            .then((data) => {
                if (data.status === "Success") {
                    location.reload();
                }
            });
    }

    return (
        <>
            {uploaderVisible && (
                <Uploader
                    upDatingPhoto={upDatingPhoto}
                    toggleUploader={toggleUploader}
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
                        <Link to="/" onClick={logOutFunction}>
                            Log Out
                        </Link>
                    </nav>
                    {/* <ProfilePhoto toggleUploader={toggleUploader} /> */}
                </header>
                <Switch>
                    <Route exact path="/">
                        <Profile
                            toggleUploader={toggleUploader}
                            upDateBio={upDateBio}
                        />
                    </Route>
                    <Route path="/chat">
                        <Chat />
                    </Route>
                    <Route path="/searchPeople">
                        <FindPeople />
                    </Route>
                    <Route path="/user/:idUserToSee">
                        <OtherProfile />
                    </Route>
                    <Route path="/news">{/* <Wall /> */}</Route>
                    <Route path="/friends">
                        <FriendsAndWannabees />
                    </Route>
                </Switch>
            </BrowserRouter>
        </>
    );
}
