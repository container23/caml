import { Handler } from '../utils';

export const getHeartbeat: Handler = async (req, res) => {
  const timestamp = new Date().toISOString();
  res.status(200).send({ message: 'ok', timestamp });
};