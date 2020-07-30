import * as Yup from 'yup';
import Recipient from '../models/Recipients';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import Queue from '../../lib/Queue';
import NewOrderMail from '../jobs/NewOrderMail';
import CancellationMail from '../jobs/CancellationMail';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
    });
    const recipient = await Recipient.findByPk(req.body.recipient_id);
    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    if (!deliveryman) {
      return res.status(404).json({ error: 'Deliveryman not found' });
    }

    const actualDate = new Date();

    if (actualDate.getHours() < 8 || actualDate.getHours() > 18) {
      return res
        .status(401)
        .json({ error: 'You can only create orders between 8:00 and 18:00' });
    }

    const { id, product, start_date } = await Order.create(req.body);

    await Queue.add(NewOrderMail.key, {
      deliveryman,
      recipient,
      product,
    });

    return res.json({
      id,
      product,
      start_date,
    });
  }

  async update(req, res) {
    // signature & end_date
    // TODO: DO THIS LATER
    return res.json();
  }

  async delete(req, res) {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ err: 'Order not Found' });
    }

    if (order.canceled_at !== null) {
      return res.status(400).json({ err: 'Order is already cancelled' });
    }

    // Some Data Validation

    order.canceled_at = new Date();
    await order.save();

    await Queue.add(CancellationMail.key, {
      deliveryman: order.deliveryman,
      recipient: order.recipient,
      product: order.product,
    });

    return res.json();
  }
}
export default new OrderController();
