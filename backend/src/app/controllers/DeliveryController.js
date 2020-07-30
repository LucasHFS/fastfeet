import { Op } from 'sequelize';

import * as Yup from 'yup';
import Recipient from '../models/Recipients';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class DeliveryController {
  async index(req, res) {
    if (!req.body.deliveryman_id) {
      return res.status(400).json({ err: 'You must provide your id' });
    }

    const { deliveryman_id } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ err: 'Deliveryman not Found!' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id,
        canceled_at: null,
        end_date: null,
      },
      attributes: ['id', 'product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
      ],
    });
    return res.json(orders);
  }

  async sent(req, res) {
    if (!req.body.deliveryman_id) {
      return res.status(400).json({ err: 'You must provide your id' });
    }

    const { deliveryman_id } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ err: 'Deliveryman not Found!' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id,
        canceled_at: null,
        end_date: {
          [Op.not]: null,
        },
      },
      attributes: ['id', 'product'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
      ],
    });
    return res.json(orders);
  }

  async update(req, res) {
    const schema_params = Yup.object().shape({
      order_id: Yup.string().required(),
    });

    const schema_body = Yup.object().shape({
      start_date: Yup.string(),
      end_date: Yup.string(),
      signature_id: Yup.string(),
    });

    if (
      !(await schema_params.isValid(req.params)) &&
      (await schema_body.isValid(req.body))
    ) {
      return res.status(400).json({ err: 'Invalid Data' });
    }

    // Verify if an Deliveryman is edditing his own order
    const order = await Order.findOne({
      where: {
        id: req.params.order_id,
        deliveryman_id: req.body.deliveryman_id,
      },
    });

    if (!order) {
      return res.status(400).json({ err: 'Order not found' });
    }

    // TODO:  Verify if has less than 5 take out

    order.save(req.body);

    return res.json(order);
  }
}
export default new DeliveryController();
