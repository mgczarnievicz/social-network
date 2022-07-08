import Registration from "./registration.js";
import LogIn from "./login.js";
import { BrowserRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div id="welcome">
            <h1>Welcome!</h1>
            <img src="/logo.png" />
            <BrowserRouter>
                <div>
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <LogIn />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}
