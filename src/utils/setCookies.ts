import { Response } from "express";



export interface AuthTokens{
   accessToken?:string;
   refreshToken?:string;
}


export const setAuthCookies = (res: Response, tokenInfo: AuthTokens) => {

  const cookieOptions = {
    httpOnly: true,
    secure: true, // HTTPS required
    sameSite: "none" as "none", // allow cross-site cookies
    // domain: ".onrender.com", // optional, use if still not working
  };

  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, cookieOptions);
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, cookieOptions);
  }
};
