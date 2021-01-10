export type GeekDockerLoginOption = {
  email: String,
  password: String
}

export type GeekDockerUserInfoOption = {
  "userName": String,
  "userId": String,
  "token": String
};

export type GeekDockerOption = {
  serverUrl?: String,
  loginParams?: GeekDockerLoginOption,
  userInfoCache?: GeekDockerUserInfoOption,
};

export type AddGeekDockerOption = {
  serverUrl?: String,
  loginParams?: GeekDockerLoginOption,
  userInfoCache?: GeekDockerUserInfoOption,
};
