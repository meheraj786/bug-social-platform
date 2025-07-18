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

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, Component: App },
      { path: "/blogs", Component: Blogs },
      { path: "/profile", Component: Profile },
      { path: "/auth", Component: AuthPage },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
