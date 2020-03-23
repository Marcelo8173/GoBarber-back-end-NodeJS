import {startOfDay, endOfDay, setHours,setMinutes, setSeconds,format, isAfter} from 'date-fns';
import Appointment from '../models/Appointment';
import {Op} from 'sequelize';

class AvalaibleController{
    async index(req,res){
        const { date } = req.query;
        if(!date){
            return res.status(400).json( {erro: "Invalid date"});
        }
        const searchDate = Number(date);

        const appointment =  Appointment.findAll({
            where:{
                provider_id: req.params.providerId,
                canceled_at: null,
                date:{
                    [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)]
                }
            }
        });

        const schedule = [
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
        ];

        const Avalaible = schedule.map(time =>{
            const [ hour, minute] = time.split(':');
            const value = setSeconds(
                setMinutes(setHours(searchDate, hour), minute),
                0
            )
            return {
                time,
                value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
                avalaible: 
                isAfter(value, new Date()) && !appointment.find(a=>
                    format(a.date, 'HH:mm') == time
                    )
            }
        });



        return res.json(Avalaible)
    }
}


export default new AvalaibleController();