
export const environment = {
  production: false,
  // MatPaginator Inputs
  pageSize: 5,
  pageSizeOptions: [5, 10, 25, 50, 100],
  BASE_BACKEND: '{DNS_BACKEND}',
  CLIENT_ID: 'ripleypoints_pwa',
  CLIENT_SECRET: 'cmlwbGV5cG9',
  RECAPTCHA_SITE_KEY: '6Ld89fMaAAAAAFYXQSgeZ9hz9nE-vU6DSEZe5RBS',
  PUBLIC_KEY_BACKEND:
		'-----BEGIN PUBLIC KEY-----\
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0vPi+NbXl+Hgky09Tq8b\
    nvFMqTLtIwndfaHpYtzUoc7Gtd8yLwfteWlKNc2PNZVh0vuGyY6AmYLs86EFjxHz\
    QXlI0UBR7k/pBY7X8V6hQRSs7ZwdmNrsZEfkfWanXrKAP3tbFZlQ+yZne3zNz81L\
    ESGFx0MQJon3wEEYqsdTBAo3/3xv1UZmuTXiSLwXZpniVoorleZkMj3vsfhEYZ9g\
    /q2owMZ30LijgbJUOqoTvC9+PYLeWjwUppRqDKQIQUVNU7jrwluEJmIjYEn21zwg\
    dGxKNRpy5MoQKfc0bbeslDGCyT4J9KAyTEYYYedJycVlP1aMdnriw2QW6ZXa9acW\
    eQIDAQAB\
    -----END PUBLIC KEY-----',
  //reCaptchaV3 - ClientID - coordinar - Inyectar con Pipeline

  //kms public key backend - Inyectar con Pipeline

  //Datos sensibles que recibe el front - Validar con riesgos

  //AccessToken se requiere llevar hasta el frontend para poder validar el perfil

  contentType : "application/json; charset=utf-8",
  authorization: ""
};