import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./pages/login/LoginPage";
import Home from "./pages/home/Home";
import Stocks from "./pages/stocks/Stocks";
import Settings from "./pages/settings/Settings";
import Portfolio from "./pages/portfolio/Portfolio";
import Insights from "./pages/insights/Insights";
import useAuth from "./hooks/useAuth";
import Notfound404 from "./components/pages/Notfound404";
import AddTransaction from "./pages/portfolio/AddTransaction";

function CheckAuth({ children, redirectTo }) {
  const { authState } = useAuth();
  return authState?.isAuthenticated ? children : <Navigate to={redirectTo} />;
}

function CheckLoginAuth({ children }) {
  const { authState } = useAuth();
  const redirectTo = localStorage.getItem("lastVisitedPage");
  return authState?.isAuthenticated ? <Navigate to={redirectTo} /> : children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <CheckLoginAuth redirectTo="/portfolio">
              <MainLayout>
                <LoginPage />
              </MainLayout>
            </CheckLoginAuth>
          }
        ></Route>

        <Route
          path="/signup"
          element={
            <CheckLoginAuth redirectTo="/portfolio">
              <MainLayout>
                <LoginPage />
              </MainLayout>
            </CheckLoginAuth>
          }
        ></Route>

        <Route
          path="/forgot-password"
          element={
            <CheckLoginAuth redirectTo="/portfolio">
              <MainLayout>
                <LoginPage />
              </MainLayout>
            </CheckLoginAuth>
          }
        ></Route>

        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        ></Route>

        <Route
          path="/settings"
          element={
            <CheckAuth redirectTo="/login">
              <MainLayout>
                <Settings />
              </MainLayout>
            </CheckAuth>
          }
        ></Route>

        <Route
          path="/portfolio"
          element={
            <CheckAuth redirectTo="/login">
              <MainLayout>
                <Portfolio />
              </MainLayout>
            </CheckAuth>
          }
        ></Route>

        <Route
          path="/add-stock"
          element={
            <CheckAuth redirectTo="/login">
              <MainLayout>
                <AddTransaction />
              </MainLayout>
            </CheckAuth>
          }
        ></Route>

        <Route
          path="/insights"
          element={
            <CheckAuth redirectTo="/login">
              <MainLayout>
                <Insights />
              </MainLayout>
            </CheckAuth>
          }
        ></Route>

        <Route
          path="/stocks/:stockSymbol"
          element={
            <MainLayout>
              <Stocks />
            </MainLayout>
          }
        ></Route>

        <Route
          path="*"
          element={
            <MainLayout>
              <Notfound404 />
            </MainLayout>
          }
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
