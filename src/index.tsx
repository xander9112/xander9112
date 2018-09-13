import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./_components/App";
import {Provider} from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import {store} from "./_helpers";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
    <Provider store={store}>
        <React.Fragment>
            <CssBaseline />
            <App />
        </React.Fragment>
    </Provider>,
    document.getElementById("root") as HTMLElement
);
registerServiceWorker();
