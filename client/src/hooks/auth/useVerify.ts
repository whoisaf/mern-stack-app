import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import config from "../../constants/config";
import * as routes from "../../constants/routes";
import { userActions } from "../../modules/user";
import { requestError, sendRequest } from "../../utils/http";

/**
 *  Hook api interface
 */
export interface IUseVerify {
  pending: boolean;
  isVerified: boolean;
  message: string;
  error: any;
}

export default (token: string | undefined): IUseVerify => {
  /**
   *  Load dispatch
   */
  const dispatch = useDispatch();

  /**
   *  Create state
   */
  const [pending, setPending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  /**
   *  On mount
   */
  useEffect(() => {
    if (token) {
      dispatch(userActions.doVerify());
      setPending(true);
      setTimeout(verify, config.PRELOAD_TIME + 1000);
    }
  }, [token]);

  /**
   *  Verify function
   */
  const verify = async () => {
    const data = {
      token
    };
    try {
      const response = await sendRequest(
        "post",
        routes.AUTH_VERIFY,
        JSON.stringify(data)
      );

      setPending(false);
      dispatch(userActions.verifySuccess());
      setMessage(response.data.message);
      setIsVerified(true);
    } catch (err) {
      setPending(false);
      setError(requestError(err));
      dispatch(userActions.verifyFail());
    }
  };

  /**
   *  Return api
   */
  return {
    pending,
    isVerified,
    message,
    error
  };
};
