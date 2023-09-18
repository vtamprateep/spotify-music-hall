import { useState } from 'react';

const useModal = () => {
  const [viewLogIn, setViewLogIn] = useState(false);

  function toggle() {
    setViewLogIn(!viewLogIn);
  }

  return {
    viewLogIn,
    toggle,
  }
};

export default useModal;
