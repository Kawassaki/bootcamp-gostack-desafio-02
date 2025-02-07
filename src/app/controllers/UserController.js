import * as Yup from 'yup';
import User from '../models/User';

class UserController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string()
                .required()
                .min(6),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const userExists = await User.findOne({
            where: { email: req.body.email },
        });

        if (userExists) {
            return res.status(400).json({ error: 'User already exisits.' });
        }

        const { name, email } = await User.create(req.body);
        return res.json({
            name,
            email,
        });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string()
                .min(6)
                .when('oldPassword', (oldPassword, field) =>
                    oldPassword ? field.required() : field
                ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails.' });
        }

        const { email, oldPassword } = req.body;

        const user = await User.findByPk(req.userId);

        if (email && email !== user.email) {
            const userExists = await User.findOne({ where: { email } });

            if (userExists) {
                return res
                    .status(400)
                    .json({ error: 'Email already registered.' });
            }
        }

        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(400).json({
                error:
                    'Password does not match, please fill the OldPassword filed correctly',
            });
        }

        const { id, name } = await user.update(req.body);

        return res.json({
            id,
            email,
            name,
        });
    }
}

export default new UserController();
