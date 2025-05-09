import { Queue } from 'bullmq';
import dotenv from "dotenv";
dotenv.config()

const myQueue = new Queue("chess-queue", {
    connection : {
        url : process.env.REDIS_URL
    }
});

export async function addJobs(job : any) {
    await myQueue.add('chess-job', job);
}
