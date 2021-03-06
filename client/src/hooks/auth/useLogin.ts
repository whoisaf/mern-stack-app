import { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import validator from "validator";

import config from "../../constants/config";
import * as routes from "../../constants/routes";
import { userActions } from "../../modules/user";
import { requestError, sendRequest } from "../../utils/http";

/**
 *  State interface
 */
export interface ILoginState {
  email: string;
  password: string;
}

/**
 *  Hook api interface
 */
export interface IUseLogin {
  data: ILoginState;
  error: any;
  valid: boolean;
  pending: boolean;
  submitted: boolean;
  validUsername(): boolean;
  validPassword(): boolean;
  hasError(): boolean;
  getError(): any;
  onSubmitHandler(e: FormEvent<Element>): void;
  onChangeHandler(e: FormEvent<Element>): void;
}

/**
 *  Initial state
 */
export const initialState: ILoginState = {
  email: "",
  password: ""
};

/**
 *  Hook
 */
export const useLogin = (): IUseLogin => {
  /**
   *  Load dispatch
   */
  const dispatch = useDispatch();

  /**
   *  Create state
   */
  const [data, setData] = useState(initialState);
  const [error, setError] = useState(null);
  const [valid, setValid] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /**
   *  Run when username or password is updated
   */
  useEffect(() => {
    if (validUsername() && validPassword()) {
      setValid(true);
    } else {
      setValid(false);
    }
  });

  /**
   *  On change handler
   */
  const onChangeHandler = (e: FormEvent) => {
    const target = e.target as HTMLFormElement;
    setData({ ...data, [target.name]: target.value.trim() });
    if (hasError() && submitted) {
      setError(null);
    }
  };

  /**
   *  Submit handler
   */
  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setSubmitted(true);

    if (valid) {
      dispatch(userActions.login());
      setPending(true);
      setTimeout(submit, 2000);
    }
  };

  /**
   *  Submit function
   */
  const submit = async () => {
    // Login success ..
    try {
      const response = await sendRequest(
        "post",
        routes.AUTH_EMAIL,
        JSON.stringify(data)
      );

      // Set not pending
      setPending(false);

      // Dispatch success action
      dispatch(userActions.doLogin(response.data));

      // Login fail ..
    } catch (err) {
      setPending(false);
      setError(requestError(err));
      dispatch(userActions.loginFail());
    }
  };

  /**
   *  Validate username function
   */
  const validUsername = () => {
    return data.email && validator.isEmail(data.email) ? true : false;
  };

  /**
   * Validate password function
   */
  const validPassword = () => {
    return data.password && data.password.length >= config.MIN_PASSWORD_LENGTH
      ? true
      : false;
  };

  /**
   * Has error
   */
  const hasError = () => {
    return error !== null ? true : false;
  };

  /**
   * Get error
   */
  const getError = () => {
    return error;
  };

  /**
   *  Return api
   */
  return {
    data,
    error,
    valid,
    pending,
    submitted,
    onSubmitHandler,
    onChangeHandler,
    validUsername,
    validPassword,
    hasError,
    getError
  };
};
