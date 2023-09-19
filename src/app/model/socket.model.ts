export class PublishDownloadLogsProgressModel {
    key: string;
    url: string;
    publicUrl: string;
    completedSteps: number;
    totalSteps: number;
    percentage: number;
    class = '';
    downloadReady: boolean;
}