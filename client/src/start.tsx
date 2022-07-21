// To be able to use Global State
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./redux/reducer";

import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
// import { init } from "./socket";

const store = createStore(rootReducer, applyMiddleware(thunk));
// composeWithDevTools(applyMiddleware(immutableState.default()));

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        console.log("data from /user/id.json ", data);
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            // I want to initialize Websocket connection ans pass the store to it
            // init(store);
            ReactDOM.render(
                <Provider store={store}>
                    <App />
                </Provider>,

                document.querySelector("main")
            );
        }
    });
