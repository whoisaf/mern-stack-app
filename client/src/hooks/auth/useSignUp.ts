import { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import validator from "validator";

import config from "../../constants/config";
import * as routes from "../../constants/routes";
import { userActions } from "../../modules/user";
import { requestError, sendRequest } from "../../utils/http";

/**
 *  State interface
 */
export interface ISignUpState {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

/**
 *  Hook api interface
 */
export interface IUseSignUp {
  data: ISignUpState;
  error: any;
  valid: boolean;
  pending: boolean;
  submitted: boolean;
  verify: string;
  passwordNotValid(): boolean;
  passwordsDontMatch(): boolean;
  hasError(name: string): boolean;
  getError(name: string): any;
  onSubmitHandler(e: FormEvent<Element>): void;
  onChangeHandler(e: FormEvent<Element>): void;
}

/**
 *  Initial state
 */
export const initialData: ISignUpState = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: ""
};

/**
 *  Hook
 */
export const useSignUp = (): IUseSignUp => {
  /**
   *  Load dispatch
   */
  const dispatch = useDispatch();

  /**
   *  Create state
   */
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState([]) as any;
  const [error, setError] = useState(null) as any;
  const [valid, setValid] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [verify, setVerify] = useState("");

  /**
   *  On component update
   */
  useEffect(() => {
    const { name, email, password, passwordConfirm } = data;

    const emailValid = email && validator.isEmail(email);
    const passwordValid =
      password &&
      password.length <= config.MIN_PASSWORD_LENGTH &&
      password === passwordConfirm;

    if (name && emailValid && passwordValid) {
      setValid(true);
    } else {
      setValid(false);
    }
  });

  /**
   *  Password valid function
   */
  const passwordNotValid = () => {
    const { password } = data;
    return password && password.length < config.MIN_PASSWORD_LENGTH
      ? true
      : false;
  };

  /**
   *  Password match function
   */
  const passwordsDontMatch = () => {
    const { password, passwordConfirm } = data;
    return passwordConfirm && password !== passwordConfirm ? true : false;
  };

  /**
   *  Has error function
   */
  const hasError = (name: string = "") => {
    const isError = error !== null;

    if (name) {
      return (
        isError &&
        typeof error.name !== undefined &&
        error.name &&
        error.name === name
      );
    }

    return isError;
  };

  /**
   *  Get error function
   */
  const getError = () => {
    return hasError() ? error : null;
  };

  /**
   *  On input change handler
   */
  const onChangeHandler = (e: FormEvent) => {
    const target = e.target as HTMLFormElement;
    setData({ ...data, [target.name]: target.value.trim() });
    if (hasError() && submitted) {
      setError(null);
    }
  };

  /**
   *  On submit handler
   */
  const onSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setSubmitted(true);

    if (valid) {
      dispatch(userActions.signUp());
      setPending(true);
      setTimeout(submit, config.HTTP_DELAY);
    }
  };

  /**
   *  Submit function
   */
  const submit = async () => {
    try {
      const response = await sendRequest(
        "post",
        routes.API_USERS,
        JSON.stringify(data)
      );

      setPending(false);
      if (response.data.verifyToken) {
        setVerify(response.data.message);
        dispatch(
          userActions.signUpSuccess({
            user: null,
            verify: true
          })
        );
      } else {
        dispatch(
          userActions.signUpSuccess({
            user: response.data.user,
            verify: false
          })
        );
      }
    } catch (err) {
      setPending(false);
      setError(requestError(err));
      dispatch(userActions.signUpFail());
    }
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
    verify,
    onChangeHandler,
    onSubmitHandler,
    passwordNotValid,
    passwordsDontMatch,
    hasError,
    getError
  };
};
