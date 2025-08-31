export interface user {
  id: string;
  email: string;
  created_at: string; //
  updated_at: string; //
  last_sign_in_at: string;
  phone: string;
  name: string;
  provider: string;
  identity_id: string;
}

export interface errorDetails {
  error?: boolean;
  sucess?: boolean;
  message: string;
}

export interface loginDetails {
  email: string;
  password: string;
}

export interface AddDetails {
  name: string;
  pin: string;
  expiry_date: string;
  file_url: string;
}

export interface retriveDataDetails {
  name: string;
  expiry_date: string;
  data_link: string;
  id: string;
}
