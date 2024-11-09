
export * from './loggerMiddleware'
export * from './noSniffMiddleware'
export * from './xPoweredByMiddleware'

export  const localize = (req, res, next) : any => {

    let locale = req.acceptsLanguages()[0];
    locale = locale.includes("-")?locale.slice(0, -3):locale;
    req.i18n.setLocale(locale);
    next();

 }
