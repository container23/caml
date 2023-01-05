import { searchAMLFile } from '../../services/search/aml';
import { logger } from '../../utils/logger';
import { Handler } from '../utils';

export const handleAMLCheckResults: Handler = async (req, res) => {
  // TODO: perform auth check
  const searchTerm = req.query.search as string;
  if (!searchTerm) {
    res.status(400).send('Invalid Request: missing search term');
    return
  }
  try {
    const results = await searchAMLFile(searchTerm);
    res.render('aml-results', { data: results });
  } catch (err) {
    logger.error({ msg: 'error rendering search results', err });
    res
      .status(500)
      .send(
        'Oops :/ something went wrong rendering your results. Please try again later '
      );
  }
}