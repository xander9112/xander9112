import TextField from "@material-ui/core/es/TextField/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import * as React from "react";

const renderTextField = ({input, label, meta: {touched, error}, ...custom}: any) => (
    <FormControl>
        <TextField
            label={label}
            {...input}
            {...custom}
        />
        {touched && error &&
            <FormHelperText error id="name-error-text">{error}</FormHelperText>
        }
    </FormControl>
);

export {renderTextField as TextField};
