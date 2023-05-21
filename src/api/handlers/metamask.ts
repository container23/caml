import { Handler } from '../utils';

export const handleMetamaskPage: Handler = async (_, res) => {
  const data = {
    gtmId: res.locals.gtmId,
  };
  res.render('metamask', data);
};
