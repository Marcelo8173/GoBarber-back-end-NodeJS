import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail];

class Queue{
    constructor(){
        this.queues = {};
        //cada serviço em segundo plano é criado uma fila
        this.init();
    }

    init(){
        //pegando todos os jobs e colocamos dentro da variaveis queue
        jobs.forEach(({ key, handle})=> {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,
                }),
                handle,
            };
        });
    }

    //adiciando emails dentro da fila
    //queue = qual fila ele vai pertencer
    //jobs recebe os dados de appointment que vai pra dentro handle
    add(queue, job){
        return this.queues[queue].bee.createJob(job).save();
    }
    //processando os dados que eu adicionei na fila

    processQueue(){
        jobs.forEach(job => {
            const {bee, handle} = this.queues[job.key];

            bee.on('failed', this.handleFailure).process(handle);
        })
    }

    handleFailure(job, err){
        console.log(`Queue ${job.queue.name}: FAILED`, err);
    }
}

export default new Queue();