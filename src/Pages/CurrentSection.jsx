import { useParams } from "react-router-dom";
import ResetPassword from "../Components/Sections/ResetPassword";
import UsersList from "../Components/Sections/UsersList";
import AddUser from "../Components/Sections/AddUser";
import About from "../Components/Sections/About";
import { useSelector } from "react-redux";

const CurrentSection = () => {
  const params = useParams();
  const users = useSelector(state => state.auth.users)
  console.log(users);

  const setCurrentSection = () => {
    switch (params.section) {
      case "reset-password":
        return <ResetPassword />;
      case "users-list":
        return <UsersList />;
      case "add-user":
        return <AddUser />;
      case "about":
        return <About/>
      default:
        return null;
    }
  };

  return (
    <div className="section__content d-flex center">{setCurrentSection()}</div>
  );
};

export default CurrentSection;
