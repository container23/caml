import { Handler } from '../utils';

export const handlePrivacy: Handler = async (_, res) => {
  res.render('privacy');
};