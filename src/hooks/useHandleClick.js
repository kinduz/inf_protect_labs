import { useEffect } from "react";

export const useHandleClick = (clickedElem, setClickedElem) => {
    const handleClick = () => {
        if (clickedElem === true) {
            setClickedElem(false);
        } 
        else return
      };
    useEffect(() => {
        document.addEventListener("click", handleClick);
        return () => {
          document.removeEventListener("click", handleClick);
        };
      }, [clickedElem])
}