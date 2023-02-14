import {
  searchAMLFile,
} from '../../services/search/aml';
import {
  MIN_SEARCH_INPUT_LENGTH,
  MAX_SEARCH_INPUT_LENGTH,
} from '../../services/search/types';
import { logger } from '../../utils/logger';
import { Handler } from '../utils';

export const handleAMLSearch: Handler = async (req, res) => {
  if (!req.query || !req.query.term) {
    return res.json({
      status: 400,
      message: 'invalid search term',
    });
  }

  // verify user submitted valid text input
  const searchTerm = req.query.term as string;
  if (
    searchTerm.length < MIN_SEARCH_INPUT_LENGTH ||
    searchTerm.length > MAX_SEARCH_INPUT_LENGTH
  ) {
    return res.json({
      status: 400,
      message: `invalid search term. value must be between ${MIN_SEARCH_INPUT_LENGTH} and ${MAX_SEARCH_INPUT_LENGTH} characters.`,
    });
  }

  try {
    const results = await searchAMLFile(searchTerm);
    if (req.get('Content-Type') === 'application/json') {
      res.json(results);
    } else {
      res.render('aml-results', {
        minSearchLength: MIN_SEARCH_INPUT_LENGTH,
        maxSearchLength: MAX_SEARCH_INPUT_LENGTH,
        data: results
      });
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