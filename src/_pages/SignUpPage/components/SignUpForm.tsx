import * as React from "react";
import {Field, InjectedFormProps, reduxForm} from "redux-form";
import {TextField} from "../../../_components/Fields";
import {createStyles, Theme, WithStyles, withStyles} from "@material-ui/core";
// import Checkbox from "@material-ui/core/es/Checkbox/Checkbox";
// import RadioButtonGroup from "@material-ui/core/es/RadioButtonGroup/RadioButtonGroup";

const validate = (values: any) => {
    const errors = {
        email: ""
    };
    const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "favoriteColor",
        "notes"
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
    return errors;
};


// const renderCheckbox = ({input, label}: any) => (
{/*<Checkbox*/
}
// label={label}
// checked={input.value ? true : false}
// onCheck={input.onChange}
// />
// );

// const renderRadioGroup = ({input, ...rest}: any) => (
{/*<RadioButtonGroup*/
}
// {...input}
// {...rest}
// valueSelected={input.value}
// onChange={(event, value) => input.onChange(value)}
// />
// );

// const renderSelectField = ({input, label, meta: {touched, error}, children, ...custom}:any) => (
{/*<SelectField*/
}
// floatingLabelText={label}
// errorText={touched && error}
// {...input}
// onChange={(event, index, value) => input.onChange(value)}
// children={children}
// {...custom}
// />
// );

interface IProps {
}

interface IFormProps extends WithStyles<typeof styles> {
    onSubmit: (event: any) => void
}

class SignUpForm extends React.Component<IProps & InjectedFormProps<{}, IProps>, {}> {
    public render() {
        return (<Form {...this.props} onSubmit={this.onSubmit} />);
    }

    private onSubmit = (event: any) => {
        console.log(event);
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

            <button type="submit" disabled={pristine || submitting}>
                Submit
            </button>

            {/*{error && <p>{error.message}</p>}*/}
        </form>
    );
};

const Form = withStyles(styles, {withTheme: true})(FormComponent);

export default reduxForm<{}, IProps>({
    form: "SignUpForm",
    validate
})(SignUpForm);
