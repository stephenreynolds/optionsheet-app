import { ErrorMessage, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";
import { checkUsernameAvailable } from "../../../common/userApi";
import { changeUsername } from "../../../redux/actions/userActions";
import { PromiseDispatch } from "../../../redux/promiseDispatch";
import { getMyUsername } from "../../../redux/selectors/userSelectors";
import { HelpBlock } from "../utils";

const UsernameForm = () => {
  const username = useSelector((state) => getMyUsername(state));
  const dispatch: PromiseDispatch = useDispatch();

  if (!username) {
    return null;
  }

  const initialValues = {
    username
  };

  const validationSchema = yup.object({
    username: yup
      .string()
      .required("Username is required.")
      .test(
        "checkUsername",
        "That username is not available.",
        async (value) => value && !(await checkUsernameAvailable(value) && value !== username)
      )
  });

  const onSubmit = (values) => {
    dispatch(changeUsername(values.username))
      .then(() => {
        toast.success("Username changed.");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      {({ getFieldProps, handleSubmit, values, touched, errors }) => (
        <form onSubmit={handleSubmit}>
          <label>Name</label>

          <input
            type="text"
            name="username"
            aria-describedby="usernameHelpBlock"
            className={touched.username && errors.username && "invalid"}
            {...getFieldProps("username")}
          />

          {errors.username && (
            <HelpBlock id="usernameHelpBlock" className="help-block text-red">
              <ErrorMessage name="username" />
            </HelpBlock>
          )}

          <button type="submit" disabled={!!errors.username || values.username === username}>
            Change name
          </button>
        </form>
      )}
    </Formik>
  );
};

export default UsernameForm;