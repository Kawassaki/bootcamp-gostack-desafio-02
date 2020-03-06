import Recipient from '../models/Recipient';
import * as Yup from 'yup';

class RecipientController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            street: Yup.string().required(),
            number: Yup.number().required(),
            complement: Yup.string().required(),
            state: Yup.string().required(),
            city: Yup.string().required(),
            cep: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const recipientExisits = await Recipient.findOne({
            where: {
                name: req.body.name,
                street: req.body.street,
                number: req.body.number,
                complement: req.body.complement,
                state: req.body.state,
                city: req.body.city,
                cep: req.body.cep,
            },
        });

        if (recipientExisits) {
            return res.status(400).json({ error: 'Recipient already exists.' });
        }

        const {
            name,
            street,
            number,
            complement,
            state,
            city,
            cep,
        } = await Recipient.create(req.body);
        return res.json({
            name,
            street,
            number,
            complement,
            state,
            city,
            cep,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            street: Yup.string().required(),
            number: Yup.number().required(),
            complement: Yup.string().required(),
            state: Yup.string().required(),
            city: Yup.string().required(),
            cep: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const recipient = await Recipient.findByPk(req.body.id);

        if (req.body.name !== recipient.name) {
            const recipientExisits = await Recipient.findOne({
                where: { name: req.body.name },
            });

            if (recipientExisits) {
                return res
                    .status(400)
                    .json({ error: 'Recipient already exists.' });
            }
        }

        const {
            name,
            street,
            number,
            complement,
            state,
            city,
            cep,
        } = await recipient.update(req.body);
        return res.json({
            name,
            street,
            number,
            complement,
            state,
            city,
            cep,
        });
    }
}

export default new RecipientController();
