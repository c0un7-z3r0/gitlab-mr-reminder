import { IncomingWebhook } from '@slack/webhook';
import { Approval } from './merge-request.d';
import { config } from './config/config';
import got from 'got';
import { IMergeRequest } from './merge-request';

const { SLACK_WEBHOOK = '' } = process.env;
const { gitlab, slack } = config;

if (!SLACK_WEBHOOK) {
    throw new Error('Missing the env variable for the Slack Webhook (SLACK_WEBHOOK)');
}

async function fetchApprovals(projectPath: string, mergeRequestIid: number): Promise<Partial<Approval>> {
    const url = new URL(
        `${gitlab.endpoint}/projects/${encodeURIComponent(projectPath)}/merge_requests/${mergeRequestIid}/approvals`,
    );

    let approvals = {};
    try {
        const response = await got(url.href);
        approvals = JSON.parse(response.body);
    } catch (err) {
        console.log({ err });
    }
    return approvals;
}

interface ProjectMergeRequests {
    title: string;
    description: string;
    authorName: string;
    url: string;
    updated: Date;
    approvalsLeft: number;
}
async function fetchProjectsMergeRequests(projectPath: string): Promise<IRepo> {
    const { endpoint, reminderThresholdInHours } = gitlab;
    const url = new URL(`${endpoint}/projects/${encodeURIComponent(projectPath)}/merge_requests`);
    let mergeRequests: IMergeRequest[] = [];
    const updatedBefore = new Date(new Date().getTime() - reminderThresholdInHours * 60 * 60 * 1000);

    url.searchParams.set('labels', 'None');
    url.searchParams.set('state', 'opened');
    url.searchParams.set('wip', 'no');
    url.searchParams.set('updated_before', updatedBefore.toISOString());

    try {
        const response = await got(url.href);
        mergeRequests = JSON.parse(response.body);
    } catch (err) {
        console.log({ err });
    }

    const openMergeRequests = await Promise.all(
        mergeRequests.map(async mr => {
            const approval = await fetchApprovals(projectPath, mr.iid);
            return {
                title: mr.title,
                description: mr.description,
                authorName: mr.author.name,
                url: mr.web_url,
                updated: mr.updated_at,
                approvalsLeft: approval.approvals_left || 0,
            };
        }),
    );
    return {
        name: projectPath,
        openMergeRequests,
    };
}

interface IRepo {
    name: string;
    openMergeRequests: ProjectMergeRequests[];
}

const mergeRequestsOpenByRepo: IRepo[] = [];

const makeSection = (text: string) => {
    return {
        type: 'section',
        text: {
            type: 'mrkdwn',
            text,
        },
    };
};

const makeDivider = () => ({
    type: 'divider',
});

function createFancyMessage(repo: IRepo) {
    const message = `*⚠️${repo.name}*\n\n\n${slack.message}`;
    const headerBlockSection = makeSection(message);

    const attachments = repo.openMergeRequests.map(mr => {
        const { authorName, title, url, description } = mr;
        return {
            color: '#FC6D26',
            title,
            title_link: url,
            text: description,
            footer: `Author: ${authorName}`,
        };
    });
    return {
        blocks: [headerBlockSection, makeDivider()],
        attachments,
    };
}

async function remind() {
    const slack = new IncomingWebhook(SLACK_WEBHOOK);

    await Promise.all(
        gitlab.repositories.map(async repo => {
            const repoInfo = await fetchProjectsMergeRequests(repo);
            await slack.send(createFancyMessage(repoInfo));
            mergeRequestsOpenByRepo.push(repoInfo);
        }),
    );
    console.log(JSON.stringify(mergeRequestsOpenByRepo, null, 4));
}
remind();
