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
    '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvK42lwelH+EDXtDWdH2LzqX8KFQvM8kovZqfwkTZsLYuSiHstpkBrJW7B9EMNxR06h3+aUiSF54iwHPsO2xrqLcWXorfJlDQyUSkwCi+DT/JQCBFJ6KeiGYFPRxSfKjqzUK+5n/V1qqRWCMs8+Sbgfv0YGyBZeZu7fDzeMSU85p2HA5H6zYMnZol293T93p/JQeOm9NgGATb5oZ4AxV0YPSNYc1CBEgbyeydXALpktb1K/O555puvJxrJdM16aeKvtoLT4NIqQ7M1y6CLIjXI85wJIk3Db114rP9nsvfVt88vB8mDLJQPL8IUf3fboY0IKX5JvGz6FsPIn+TJrCaLwIDAQAB-----END PUBLIC KEY-----',
  
    //kms public key backend - Inyectar con Pipeline
  
    //Datos sensibles que recibe el front - Validar con riesgos
  
    //AccessToken se requiere llevar hasta el frontend para poder validar el perfil
    
    contentType : "application/json; charset=utf-8",
    authorization: ""
  };
  