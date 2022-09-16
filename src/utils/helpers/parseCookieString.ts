export default function parseCookieString(cookieString: string): any {
  if (!cookieString)
      return {};

  let pairs = cookieString.split(";");
  let splittedPairs = pairs.map(cookie => cookie.split("="));

  const cookieObj = splittedPairs.reduce(function (obj, cookie) {
    // @ts-ignore
    obj[decodeURIComponent(cookie[0].trim())] = decodeURIComponent(cookie[1].trim());

    return obj;
  }, {})

  return cookieObj;
}