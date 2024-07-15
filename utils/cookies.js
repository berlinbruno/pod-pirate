import { jwtDecode } from "jwt-decode";

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export async function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export async function setAccessTokenCookie(token, id, role) {
  const decodedToken = jwtDecode(token);

  // Calculate the expiration time (one day from now)
  const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Convert expiration time to UTC string
  const expires = expirationTime.toUTCString();

  // Set the cookie string with the specified attributes
  document.cookie = `accessToken=${token}; path=/; expires=${expires}; Secure; SameSite=Strict`;

  document.cookie = `userId=${id}; path=/; expires=${expires}; Secure; SameSite=Strict`;

  document.cookie = `role=${role}; path=/; expires=${expires}; Secure; SameSite=Strict`;
}
