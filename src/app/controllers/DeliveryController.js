import {Op} from 'sequelize';
import Recipient from '../models/Recipients';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class DeliveryController {
    async index(req, res) {
        const { id } = req.params;

        const schema = Yup.object().shape({
        id: Yup.number().required
        })

        if(!(await schema.isValid(req.params))){
        return res.status(400).json({err: 'You must provide your id'})
        }

        const deliveryman = await Deliveryman.findByPk(req.params.id)

        if(!deliveryman){
        return res.status(400).json({err: 'Deliveryman not Found!'})
        }

        const orders = await Order.findAll({
        where: {
            deliveryman_id: id,
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
        // não estejam entregues ou canceladas;
        return res.json(orders);
    }

    async deliveries(req, res) {
        const schema = Yup.object().shape({
        id: Yup.number().required
        })
        
        if(!(await schema.isValid(req.params))){
        return res.status(400).json({err: 'You must provide your id'})
        }
        
        const { id } = req.params;
        
        const deliveryman = await Deliveryman.findByPk(req.params.id)

        if(!deliveryman){
        return res.status(400).json({err: 'Deliveryman not Found!'})
        }

        const orders = await Order.findAll({
        where: {
            deliveryman_id: id,
            canceled_at: null,
            end_date: {
                [Op.not]: null
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
        // não estejam entregues ou canceladas;
        return res.json(orders);
    }

    async update(req,res){
        //Verify if an Deliveryman is edditing his own order
    }
}
export default new DeliveryController();