import * as Yup from 'yup';
import Recipient from '../models/Recipients';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import Problem from '../models/Problem';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class ProblemController {
  // list all deliveries with problems
  async index(req, res) {
    // Select distinct orders with problems
    const [orders, metadata] = await Order.sequelize.query(
      'select distinct on (p.order_id) * from orders o join problems p on o.id = p.order_id',
      {
        raw: true,
      }
    );
    return res.json(orders);
  }

  async problems(req, res) {
    if (!req.params.id) {
      return res.status(400).res.json({ err: 'Order id not provided' });
    }

    const problems = await Problem.findAll({
      where: { order_id: req.params.id },
    });
    return res.json(problems);
  }

  async create(req, res) {
    if (!req.params.id) {
      return res.status(400).res.json({ err: 'Order id not provided' });
    }

    if (!req.body.description) {
      return res.status(400).res.json({ err: 'Need the description' });
    }

    const problem = await Problem.create({
      order_id: req.params.id,
      description: req.body.description,
    });

    return res.json(problem);
  }

  async delete(req, res) {
    if (!req.params.id) {
      return res.status(400).res.json({ err: 'Problem id not provided' });
    }

    const problem = await Problem.findByPk(req.params.id);

    if (!problem) {
      return res.status(404).res.json({ err: 'Problem not found' });
    }

    const id = problem.order_id;

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
export default new ProblemController();
