export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
}
