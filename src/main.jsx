import React, { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "./App.jsx";
import firebaseConfig from "./components/firebase/firebase.js";
import RootLayout from "./pages/RootLayout.jsx";
import { createRoot } from "react-dom/client";
import Blogs from "./pages/Blogs.jsx";
import Profile from "./pages/Profile.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { store } from "./app/store";
import { Provider } from "react-redux";
import ForgotPassPage from "./pages/ForgotPassPage.jsx";
import AuthProtect from "./components/routeProtection/AuthProtect.jsx";
import Notification from "./pages/Notification.jsx";
import Messages from "./pages/Messages.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Conversation from "./components/conversation/Conversation.jsx";
import NotFound from "./pages/NotFound.jsx";
import CreatePages from "./pages/CreatePages.jsx";
import PageProfile from "./pages/PageProfile.jsx";
import PageMessage from "./pages/PageMessage.jsx";
import PageConversation from "./components/PageConversation/PageConversation.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <App /> },
      {
        path: "/blogs",
        element: (
          <AuthProtect>
            <Blogs />
          </AuthProtect>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <AuthProtect>
            <Profile />
          </AuthProtect>
        ),
      },
      { path: "/auth", Component: AuthPage },
      { path: "/create-pages", Component: CreatePages },
      { path: "/page-profile/:id", Component: PageProfile },
      { path: "/login", Component: Login },
      { path: "/signup", Component: Signup },
      { path: "/forgotpassword", Component: ForgotPassPage },
      { path: "/notification", Component: Notification },
      {
        path: "/messages",
        Component: Messages,
        children: [
          {
            path: "/messages/chat/:id",
            Component: Conversation,
          },
        ],
      },
      {
        path: "/pagemessages/:id",
        Component: PageMessage,
        children: [
          {
            path: "chat/:chatId", 
            Component: PageConversation,
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
