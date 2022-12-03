import { createContext, useCallback, useState } from "react";

export const UserDetailsContext = createContext([{}, () => {}]);

const UserDetailsProvider = (props) => {
  const [userDetails, setUserDetails] = useState({});

  const setOwnUserDetails = useCallback(
    (userDet) => {
      setUserDetails(userDet);
    },
    [setUserDetails]
  );

  return (
    <UserDetailsContext.Provider value={[userDetails, setOwnUserDetails]}>
      {props.children}
    </UserDetailsContext.Provider>
  );
};

export default UserDetailsProvider;
