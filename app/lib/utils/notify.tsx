import { CircleAlert, CircleCheckBigIcon, CircleX, MessageCircleWarningIcon } from "lucide-react";
import { toast } from "react-toastify";

const DEFAULT_SUCCESS_MESSAGE = "Operation has been successfully completed.";
const DEFAULT_ERROR_MESSAGE =
  "Something has gone wrong. Please try again later. If the problem persists, please contact our support team.";

const success = (message = DEFAULT_SUCCESS_MESSAGE, options = {}) => {
  toast.success(message, {
    icon: <CircleCheckBigIcon />,
    ...options,
  });
};

const error = (message = DEFAULT_ERROR_MESSAGE, options = {}) => {
  toast.error(message, {
    icon: <CircleX />,
    ...options,
  });
};

const warning = (message: string, options = {}) => {
  return toast.warn(message, {
    icon: <MessageCircleWarningIcon />,
    ...options,
  });
};

const info = (message: string, options = {}) => {
  toast.info(message, {
    icon: <CircleAlert />,
    ...options,
  });
};

const Notify = {
  success,
  error,
  warning,
  info,
};

export default Notify;
