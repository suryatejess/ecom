import React from "react";

const SignInFirstComponent = (props) => {
    return (
        <>
            <div className="min-h-screen flex justify-center self-center">
                <p className="text-center">
                    you have to signin first before you can see the {props.name}{" "}
                    page
                </p>
            </div>
        </>
    );
};

export default SignInFirstComponent;
