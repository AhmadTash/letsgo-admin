export interface User {
  id: string;
  name?: string;
  username?: string;
  avatar?: string;
  email?: string;

  [key: string]: unknown;
}
