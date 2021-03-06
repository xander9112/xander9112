import * as React from "react";
import {Field, InjectedFormProps, reduxForm} from "redux-form";

import {TextField} from "../../../_components/Fields";
import {createStyles, Theme, WithStyles, withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/es/Grid/Grid";
import Button from "@material-ui/core/es/Button/Button";
import {doCreateUserWithEmailAndPassword} from "../../../_firebase";

import * as routes from "../../../_constants";

const validate = (values: any) => {
    const errors = {
        username: "",
        email: "",
        password: "",
        password_confirm: ""
    };

    const requiredFields = [
        "username",
        "email",
        "password",
        "password_confirm"
    ];

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = "Required";
        }
    });
    if (
        values.email &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = "Invalid email address";
    }


    if (values.password_confirm && values.password !== values.password_confirm) {
        errors.password_confirm = "Password and Confirm Password must be an equal";
    }

    return errors;
};

interface IProps {
    history: {
        push: (url: string) => void
    }
}


interface IFormProps extends WithStyles<typeof styles> {
    onSubmit: (event: any) => void
}

class SignUpForm extends React.Component<IProps & InjectedFormProps<{}, IProps>, {}> {
    public render() {
        return (
            <Grid container spacing={24}>
                <Grid item xs={4}>
                    <Form {...this.props} onSubmit={this.onSubmit} />
                </Grid>
            </Grid>
        );
    }

    private onSubmit = async ({email, password}: any) => {
        const {history} = this.props;

        try {
            await doCreateUserWithEmailAndPassword(email, password);

            history.push(routes.HOME);

        } catch (error) {
            console.log(error.message);
        }
    };
}

const styles = (theme: Theme) => createStyles({
    container: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column"
    }
});

const FormComponent = (props: IFormProps & InjectedFormProps<{}, IProps>) => {
    const {handleSubmit, pristine, submitting, onSubmit, classes} = props;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.container}>
            <Field
                name="username"
                component={TextField}
                label="Full Name"
            />
            <Field
                name="email"
                component={TextField}
                label="Email Address"
            />
            <Field
                name="password"
                component={TextField}
                type="password"
                label="Password"
            />
            <Field
                name="password_confirm"
                component={TextField}
                type="password"
                label="Confirm Password"
            />
            <br />
            {/*<ButtonBase*/}
            {/*type="submit"*/}
            {/*disabled={pristine || submitting}>*/}
            {/**/}
            {/*</ButtonBase>*/}

            <Button
                color="primary"
                variant="contained"
                disabled={pristine || submitting}
                onClick={handleSubmit(onSubmit)}
            >
                Submit
            </Button>
            {/*{error && <p>{error.message}</p>}*/}
        </form>
    );
};

const Form = withStyles(styles, {withTheme: true})(FormComponent);

export default reduxForm<{}, IProps>({
    form: "SignUpForm",
    validate
})(SignUpForm);
