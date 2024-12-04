import { NavLink } from "../types";

export const NAV_LINKS: NavLink[] = [
  { label: "Home", path: "/" },
  { label: "Create", path: "/forms/create" },
  { label: "Forms", path: "/forms" },
];

export const inputTypes = [
  { type: "text", label: "Text Input" },
  { type: "email", label: "Email Input" },
  { type: "password", label: "Password Input" },
  { type: "number", label: "Number Input" },
  { type: "date", label: "Date Input" },
];
