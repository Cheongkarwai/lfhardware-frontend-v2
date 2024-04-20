export interface FormGroupLayout{
  type:string;
  label:string;
  //This will be use by single control
  name:string;
  value:string;
  //Radio button will use this
  options:Option[],
}

export interface Option{
  label:string;
  value:string;
}
