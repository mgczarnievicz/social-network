import Registration from "./registration";
import LogIn from "./login";
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
