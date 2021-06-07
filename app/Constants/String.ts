export enum RESPONSE_MESSAGE {
  CREATED = "Created Successfully",
  UPDATED = "Updated Successfully",
  DELETED = "Deleted Successfully",
  LOGOUT = "Logout Successfully",
  LOGOUT_ALL = "Logout All Successfully",
  PASSWORD_CHANGED = "Password Changed Successfully",
  EMAIL_CHANGED = "Email Changed Successfully",
}

export enum EXCEPTION_CODE {
  E_INVALID_AUTH_UID = "E_INVALID_AUTH_UID",
  E_INVALID_AUTH_PASSWORD = "E_INVALID_AUTH_PASSWORD",
  E_ROW_NOT_FOUND = "E_ROW_NOT_FOUND",
  E_ROUTE_NOT_FOUND = "E_ROUTE_NOT_FOUND",
  E_VALIDATION_FAILURE = "E_VALIDATION_FAILURE",
  E_UNAUTHORIZED_ACCESS = "E_UNAUTHORIZED_ACCESS",
  E_FORBIDDEN_ACCESS = "E_FORBIDDEN_ACCESS",
  E_NOTACCAPTABLE_ACCESS = "E_NOTACCAPTABLE_ACCESS",
  E_INVALID_MODIFY_ROLE = "E_INVALID_MODIFY_ROLE",
}

export enum EXCEPTION_MESSAGE {
  E_INVALID_AUTH_UID = "Invalid Credentials",
  E_INVALID_AUTH_PASSWORD = "Invalid Credentials",
  E_ROW_NOT_FOUND = "Row Not Found",
  E_ROUTE_NOT_FOUND = "Route Not Found",
  E_VALIDATION_FAILURE = "Invalid Validation",
  E_UNAUTHORIZED_ACCESS = "Unauthorized Access",
  E_FORBIDDEN_ACCESS = "Forbidden Access",
  E_NOTACCAPTABLE_ACCESS = "Not Accaptable Access",
  E_INVALID_MODIFY_ROLE = "Invalid Mofify Role"
}