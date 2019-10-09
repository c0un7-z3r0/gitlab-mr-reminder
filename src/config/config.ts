import { IConfig } from './config.d';

export const config: IConfig = {
    gitlab: {
        endpoint: 'https://gitlab.com/api/v4',
        reminderThresholdInHours: 12,
        repositories: ['group/project'],
    },
    slack: {
        botName: 'Gitlab MR Reminder',
        message: 'The merge requests below have been for a while now open.\nPlease have a look at them.',
        channel: 'test',
    },
};
