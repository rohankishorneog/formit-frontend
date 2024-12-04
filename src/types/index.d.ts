export interface FieldConfig {
  _id?: string;
  label: string;
  fieldType:
    | "text"
    | "number"
    | "email"
    | "password"
    | "textarea"
    | "date"
    | string;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  createdAt?: Date;
}

export interface NavLink {
  label: string;
  path: string;
}
