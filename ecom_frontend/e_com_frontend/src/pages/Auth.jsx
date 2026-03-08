import { Outlet } from "react-router-dom";
import AuthLogin from "./AuthLogin";

function Auth() {
    return (
        <div>
            {/* <AuthLogin /> */}
            <Outlet />
        </div>
    );
}

export default Auth;
