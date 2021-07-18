// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // MatPaginator Inputs
  pageSize: 5,
  pageSizeOptions: [5, 10, 25, 50, 100],
  BASE_BACKEND: '{DNS_BACKEND}',
  CLIENT_ID: 'ripleypoints_pwa',
  CLIENT_SECRET: 'cmlwbGV5cG9',
  RECAPTCHA_SITE_KEY: '{RECAPTCHA_SITE_KEY}',
  PUBLIC_KEY_BACKEND:
    '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0hlUp+cCl5q+dFR/qOyA9G9zzMYIvNcQ/NF7RlB756CokRQqISjRRqDtihpH7shE/b/Yigp5IVNXwCs2HRoNkvA6ufY1zQ+yZg8qwmbus8ZnAcCmwzddShrfrbMOCl1+/BoclXuf9mg4weQk+yGjpd/RZrxlkaoRW2orBR9hySFAAE7mQaRK6W9X2N6OOSZvDH9Y/+UWak18kehfqizkX1q1SoFLaBYbzGIl5fUS9/uSxwu242Y8svTOx2ckMisGFWWrO9Jcr0A/ASx0Oua9/mRGy0eyWNuRvsJ9Vb1CSfeSz5GZHbiN+2szadWzSYXsaJTFRb5lvxhq8qTL3+1d5wIDAQAB-----END PUBLIC KEY-----',
  contentType : "application/json; charset=utf-8",
  authorization: "",
};
