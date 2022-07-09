import Registration from "./registration";
import LogIn from "./login";
import ResetPassword from "./resetPassword";

import { BrowserRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div id="main-welcome">
            <div>
                <h1>Welcome!</h1>
                <img src="/logo.png" />
            </div>
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <LogIn />
                    </Route>
                    <Route path="/resetPassword">
                        <ResetPassword />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}
