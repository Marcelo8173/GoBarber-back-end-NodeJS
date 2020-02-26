import Appointment from '../models/Appointment';
import * as Yup from 'yup';
import {startOfHour, parseISO, isBefore, format, subHours} from 'date-fns';
import pt from 'date-fns/locale/pt'
import User from '../models/user';
import File from '../models/File';
import Notification from '../schemas/Notifications';


class AppointmentController  {
    async index(req,res){
        const {page =1 } = req.query;

        const appointment = await Appointment.findAll({where: 
            {user_id: req.userId, canceled_at: null},
            order: ['date'],
            limit: 20,
            offset: (page -1) * 20,
            attributes: ['id','date'],
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id','name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id','path','url']
                        }
                    ],
                },
            ],
        });
        
        return res.json(appointment);
    }

    async store(req,res){
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
           date: Yup.date().required() 
        });

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: 'Validation fails'});
        }

        const {provider_id, date} = req.body;
        //verificar se realmente o provide é um provide
        const isProvider = await User.findOne({
            where: {id: provider_id, provide:true}
        })
        if(!isProvider){
            return res.status(401).json({error: 'You can only create appointments with providers'});
        }

        if(isProvider === req.userId){
            return res.status(401).json({error: 'You can not create appointments with yourself'})
        }
        const hourStart = startOfHour(parseISO(date)); //o parse iso transforma a string em um objeto date do javaScpit 
        //startOfHour pega o valor inteiro da hora 
        if(isBefore(hourStart, new Date())){
            return res.status(400).json({error: 'past date are not permited'});
        };

        //se o prestador já tem o agendamento no mesmo horario
        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart,
            }
        });

        if(checkAvailability){
            return res.status(400).json({error: 'Appointment date is not available'});
        };

        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date: hourStart
        })

        const userName = await User.findByPk(req.userId);
        const formattedDate = format(
            hourStart,
            "'dia' dd 'de' MMMM', às' H:mm'h'",
            {locale: pt}
        )
        //notify provider 
        await Notification.create({
            content: `Novo agendamento de ${userName.name} para o ${formattedDate} `,
            user: provider_id,
        });

        return res.json(appointment);
    }

    async delete(req,res){
        const appointment = await Appointment.findByPk(req.params.id);

        if(appointment.user_id != req.userId){
            return res.status(401).json({
                error: "you dont't have permission to cancel this appointment."
            });
        };

        //veridicaçã de horas
        const dateWithSub = subHours(appointment.date, 2);

        if(isBefore(dateWithSub, new Date())){
            return res.status(401).json({error: 'You can only appointments 2 hours in advance'});
        };

        appointment.canceled_at = new Date();
        await appointment.save();


        return res.json(appointment);
    }
}

export default new AppointmentController();