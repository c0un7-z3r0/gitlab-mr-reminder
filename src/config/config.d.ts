interface IGitlabConfig {
    endpoint: string;
    repositories: string[];
    reminderThresholdInHours: number;
}

interface ISlackConfig {
    botName: string;
    message: string;
    channel: string;
}

export interface IConfig {
    gitlab: IGitlabConfig;
    slack: ISlackConfig;
}
