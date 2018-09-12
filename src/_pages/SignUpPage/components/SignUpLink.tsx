import {Link} from "react-router-dom";
import * as routes from "../../../_constants";
import * as React from "react";

export const SignUpLink = () =>
    <p>
        Don't have an account?
        {" "}
        <Link to={routes.SIGN_UP}>Sign Up</Link>
    </p>;
