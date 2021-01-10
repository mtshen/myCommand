export type GeekDockerLoginOption = {
  "email": String,
  "password": String
}

export type GeekDockerOption = {
  serverUrl: String,
  "loginParams": GeekDockerLoginOption,
};
