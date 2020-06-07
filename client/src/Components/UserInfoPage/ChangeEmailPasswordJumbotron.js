import React from 'react';

const ChangeEmailPasswordJumbotron = (props) => {
    return (
        <div className="jumbotron jumbotron-container">
            <h1 className="display-4">Change your email/password</h1>
            <p className="lead">If you want to change your email or password, we will send you an email with a verification code which you will use before you can change your email or password</p>
            <hr className="my-4" />
            <p className="lead">
            <a className="btn btn-success btn-lg" onClick={props.onClick} role="button">Change email / password</a>
            </p>
        </div>
    );
}

export default ChangeEmailPasswordJumbotron