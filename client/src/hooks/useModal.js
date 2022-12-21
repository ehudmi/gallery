import { useState } from "react";

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState();
  const [selectedId, setSelectedId] = useState(null);

  const toggle = () => {
    setIsShowing(!isShowing);
    setMessage("Are you sure you want to delete the selected");
  };

  return {
    isShowing,
    toggle,
    message,
    setType,
    type,
    setSelectedId,
    selectedId,
  };
};

export default useModal;
