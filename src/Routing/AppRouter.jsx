import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./router";
import Sections from "../Components/UI/Sections/Sections";

const AppRouter = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);

  return isAuth ? (
    <div className="content d-flex column">
      <Sections />
      <Routes>
        {publicRoutes.map((route) => (
          <Route
            Component={route.component}
            path={route.path}
            exact={route.exact}
            key={route.path}
          />
        ))}
      </Routes>
    </div>
  ) : (
    <section className="auth__form d-flex center">
      <Routes>
        {privateRoutes.map((route) => (
          <Route
            Component={route.component}
            path={route.path}
            exact={route.exact}
            key={route.path}
          />
        ))}
        <Route path="/*" element={<Navigate to="/login" />} />

      </Routes>
    </section>
  );
};

export default AppRouter;
