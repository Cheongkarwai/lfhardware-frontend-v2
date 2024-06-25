export interface Customer {
  id: string;
  // name: string;
  first_name: string;
  last_name: string;
  address: {
    line_1: string;
    line_2: string;
    city: string;
    state: string;
    zipcode: string;

  }
  email_address:string;
  phone_number: string;
  email_verified: boolean;
  enabled: boolean;
}


export interface CustomerInput{
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number:string;
  address: {
    line_1: string;
    line_2: string;
    city: string;
    state: string;
    zipcode: string;
  }
}
