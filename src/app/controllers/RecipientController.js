import * as Yup from 'yup';
import Recipient from '../models/Recipients';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required().min(2).max(2),
      city: Yup.string().required(),
      cep: Yup.string().required().min(8).max(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fields are Required' });
    }

    const { name, city, cep } = await Recipient.create(req.body);
    return res.json({
      name,
      city,
      cep,
    });
  }
}
export default new RecipientController();
