export const ROUTES_WITH_RECAPTCHA_VALIDATION = [
    {
        route: 'login',
        requestKey: 'captchaResponse'
    },
    {
        route: 'ReglasAcumulacion/Bandeja',
        requestKey: 'captchaResponse'
    }
];
export const ROUTES_WITHOUT_RECAPTCHA_HEADER = [
    'jsonip.com'
]
export const RECAPTCHA_ACTION_KEY = 'register';