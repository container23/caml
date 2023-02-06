import { Handler } from '../utils';

export const handleTerms: Handler = async (_, res) => {
  res.render('terms');
};