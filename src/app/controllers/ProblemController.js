import { Op } from 'sequelize';

import * as Yup from 'yup';
import Recipient from '../models/Recipients';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class ProblemController {
  async index(req, res) {
    return res.json(orders);
  }

  async deliveries(req, res) {
    return res.json(orders);
  }

  async update(req, res) {
    return res.json(order);
  }
}
export default new ProblemController();
