import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/HomePage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegistrationPage from "./pages/RegistrationPage.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import { store, persistor } from "./redux/store.ts";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./components/ThemeProvider.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import AdminRoute from "./components/AdminRoute.tsx";
import PostCreatePage from "./pages/PostCreatePage.tsx";
import PostEditPage from "./pages/PostEditPage.tsx";
import PostShowPage from "./pages/PostShowPage.tsx";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/about", element: <AboutPage /> },
  {
    path: "/dashboard",
    element: <PrivateRoute component={<DashboardPage />} />,
  },
  {
    path: "/posts/create",
    element: <AdminRoute component={<PostCreatePage />} />,
  },
  {
    path: "/posts/:postId/edit",
    element: <AdminRoute component={<PostEditPage />} />,
  },
  { path: "/posts/:slug", element: <PostShowPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegistrationPage /> },
  { path: "/projects", element: <ProjectsPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
