export class QueueEntity {
    public queueName: string
    public status: string
    public visitPosition: number
    public waitingVisits: number
    public index: number
    public upperBound: number;
    public lowerBound: number;
    public prevWaitingVisits: number;
    public prevVisitPosition: number;
    public prevUpperBound: number;
    public prevLowerBound: number;
    public currentServiceName: string;
    public queueId: number;
}