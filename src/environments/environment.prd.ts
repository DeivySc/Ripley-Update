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
    '{KMS_PUBLIC_KEY_BACKEND}',
  contentType : "application/json; charset=utf-8",
  authorization: ""

  //kms public key backend - Inyectar con Pipeline

  //Datos sensibles que recibe el front - Validar con riesgos

  //AccessToken se requiere llevar hasta el frontend para poder validar el perfil
};
