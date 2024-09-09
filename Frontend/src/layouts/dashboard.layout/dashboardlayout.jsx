import { Outlet, useNavigate } from "react-router-dom";
import "./dashboardlayout.css";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import ChatList from "../../component/chatList/chatList";

const DashboardLayout = () => {
    const { userId, isLoaded } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to sign-in page if not authenticated
        if (isLoaded && !userId) {
            navigate("/sign-in");
        }
    }, [isLoaded, userId, navigate]);

    if (!isLoaded) {
        // Show a loading message while authentication state is being determined
        return <div>Loading.....</div>;
    }

    return (
        <div className="dashboardLayout">
            <div className="menu">
                <ChatList />
            </div>
            <div className="content">
                {/* Render child routes */}
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
