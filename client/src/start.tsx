// To be able to use Global State
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./redux/reducer";

import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
import { init } from "./socket";
import { composeWithDevTools } from "redux-devtools-extension";
import * as immutableState from "redux-immutable-state-invariant";

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default(), thunk))
);

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            // I want to initialize Websocket connection ans pass the store to it
            init(store);
            ReactDOM.render(
                <Provider store={store}>
                    <App />
                </Provider>,

                document.querySelector("main")
            );
        }
    });
