import {startOfDay, endOfDay, parseISO} from 'date-fns';
import {Op} from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/user';

class ScheduleController{
    async index (req,res){
        const checkUserProvide = await User.findOne({
            where: {
                id: req.userId, provide: true
            }
        });

        if(!checkUserProvide){
            return res.status(401).json({erro: 'User not is a provider'})
        };

        const {date} = req.query;
        const parsedDate = parseISO(date);

        const appointment = await Appointment.findAll({
            where: {
                provider_id: req.userId,
                canceled_at: null,
                date:{
                    [Op.between]: [
                        startOfDay(parsedDate),
                        endOfDay(parsedDate)
                    ]
                },
            },
            order: ['date']
        })
        return res.json({appointment});
    }
}

export default new ScheduleController();