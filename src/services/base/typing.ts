export interface Login {
  username: string;
  password: string;
}

export interface IInitialState {
  permissionLoading?: boolean;
  currentUser?: any;
  settings?: any;
  authorizedPermissions?: { rsname: string }[];
}
