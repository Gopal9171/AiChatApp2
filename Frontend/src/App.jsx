import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './routes/homePage/homePage';
import DashboardPage from './routes/dashboardPage/dashboardPage';
import ChatPage from './routes/chatPage/chatPage';
import RootLayout from "./layouts/root.layout/rootlayout";
import DashboardLayout from "./layouts/dashboard.layout/dashboardlayout";
import SignInPage from './routes/signInPage/SignInPage';
import SignUpPage from './routes/signUpPage/SignUpPage';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/dashboard/chats/:id", element: <ChatPage /> }
        ]
      }
    ]
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
