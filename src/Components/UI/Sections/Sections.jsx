import { useState } from "react";
import { useHandleClick } from "../../../hooks/useHandleClick";
import { useDispatch, useSelector } from "react-redux";
import { adminSections, userSections } from "../../../store/data/data";
import { logoutAction } from "../../../store/Reducers/authReducer";
import { Link } from "react-router-dom";

const Sections = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.userRole);

  const [isActiveSectionFirst, setIsActiveSectionFirst] = useState(null);
  const [isActiveSectionSecond, setIsActiveSectionSecond] = useState(null);

  useHandleClick(isActiveSectionFirst, setIsActiveSectionFirst);
  useHandleClick(isActiveSectionSecond, setIsActiveSectionSecond);

  const logoutFunc = () => {
    dispatch(logoutAction())
    window.location.reload()
  }

  return (
    <div className="sections d-flex center">
      <div
        className="section__users section"
        onClick={(e) => {
          e.stopPropagation();
          setIsActiveSectionFirst(!isActiveSectionFirst);
        }}
      >
        Пользователи
        {isActiveSectionFirst && (
          <div className="section__list d-flex column">
            {role === "1"
              ? adminSections.map((underSection) => (
                  <Link className="under__section" to={`/section/${underSection.to}`}>{underSection.label}</Link>
                ))
              : userSections.map((underSection) => (
                  <Link className="under__section" to={`/section/${underSection.to}`}>{underSection.label}</Link>
                ))}
            <div className="under__section exit" onClick={() => logoutFunc() }>Выйти</div>
          </div>
        )}
      </div>
      <div
        className="section__about section"
        onClick={(e) => {
          e.stopPropagation();
          setIsActiveSectionSecond(!isActiveSectionSecond);
        }}
      >
        Справка
        {isActiveSectionSecond && (
          <div className="section__list d-flex column">
            <Link className="under__section" to='section/about'>Справка</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sections;
