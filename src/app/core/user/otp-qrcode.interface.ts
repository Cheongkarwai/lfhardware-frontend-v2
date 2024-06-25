export interface OtpQrcode extends Otp{
  qr_code_base64: string;
}

export interface Otp{
  secret: string;
}

export interface OtpInput extends Otp{
  value: string;
}
