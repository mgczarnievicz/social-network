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
import { EmptyProps } from "./typesClient";

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

    useEffect(() => {
        let abort = false;
        dispatch(asyncReceiveUser(abort));
        return () => {
            abort = true;
        };
    }, []);

    function toggleUploader() {
        // console.log("ToggleModal is running");
        setUploaderVisible(!uploaderVisible);
    }

    function upDatingPhoto(url: string) {
        // console.log("This is arg", url);
        setUploaderVisible(false);
        dispatch(userUpdatePhotoUrl(url));
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
                        <Link to="/chat">Chat</Link>

                        <Link to="/searchPeople">Find Friends</Link>
                        <Link to="/">Profile</Link>
                        <Link to="/" onClick={logOutFunction}>
                            Log Out
                        </Link>
                    </nav>
                    <ProfilePhoto toggleUploader={toggleUploader} />
                </header>
                <Switch>
                    <Route exact path="/">
                        <Profile toggleUploader={toggleUploader} />
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
                    <Route path="/news">
                        <div className="container-main-width ">
                            <h1 className="wall-title">My Post</h1>
                            <Wall />
                        </div>
                    </Route>
                    <Route path="/friends">
                        <FriendsAndWannabees />
                    </Route>
                </Switch>
            </BrowserRouter>
        </>
    );
}
