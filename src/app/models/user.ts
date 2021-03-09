export interface User {
  id: string;
  username: string;
  name: string;
  lastName: string;
  birthDate: Date | string;
  email: string;
  phoneNumber?: string;
  favoriteColor?: string;
  country?: string;
}
