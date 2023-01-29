import { searchAMLFile } from '../../services/search/aml';
import { logger } from '../../utils/logger';
import { Handler } from '../utils';

export const handleAMLSearch: Handler = async (req, res) => {
  if (!req.query || !req.query.term) {
    return res.json({
      status: 400,
      message: 'invalid search term provided'
    });
  }

  try {
    const searchTerm = req.query.term as string;
    const results = await searchAMLFile(searchTerm);
    if (req.get('Content-Type') === 'application/json') {
      res.json(results);
    } else {
      res.render('aml-results', { data: results });
    }
  } catch (err) {
    logger.error({ msg: 'error rendering search results', error: err });
    res.json({
      status: 500,
      message:
        'Oops :/ something went wrong searching results. Please try again later',
    });
  }
};