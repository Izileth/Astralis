export interface SignIn {
  email: string;
  password: string;
}

export interface SignUp {
  name: string;
  email: string;
  password: string;
  slug?: string; 
}


export interface Account {
  id: string;
  userId: string;
  provider: 'google' | 'discord' | string;
  providerAccountId: string;
}