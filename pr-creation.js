const fs = require('fs');
const { Octokit } = require('@octokit/rest');

// Commit and raise PR to GitHub
async function raisePullRequest(repoOwner, repoName, branchName, filePath, commitMessage) {
    const octokit = new Octokit({ auth: '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' });

    const { data: repo } = await octokit.repos.get({ owner: repoOwner, repo: repoName });
    const defaultBranch = repo.default_branch;

    const { data: reference } = await octokit.git.getRef({
        owner: repoOwner,
        repo: repoName,
        ref: `heads/${defaultBranch}`,
    });
    const latestCommitSha = reference.object.sha;

    await octokit.git.createRef({
        owner: repoOwner,
        repo: repoName,
        ref: `refs/heads/${branchName}`,
        sha: latestCommitSha,
    });

    const content = fs.readFileSync(filePath, 'utf-8');
    const encodedContent = Buffer.from(content).toString('base64');

    const { data: blob } = await octokit.git.createBlob({
        owner: repoOwner,
        repo: repoName,
        content: encodedContent,
        encoding: 'base64',
    });

    const { data: tree } = await octokit.git.createTree({
        owner: repoOwner,
        repo: repoName,
        base_tree: latestCommitSha,
        tree: [
            {
                path: filePath,
                mode: '100644',
                type: 'blob',
                sha: blob.sha,
            },
        ],
    });

    const { data: newCommit } = await octokit.git.createCommit({
        owner: repoOwner,
        repo: repoName,
        message: commitMessage,
        tree: tree.sha,
        parents: [latestCommitSha],
    });

    await octokit.git.updateRef({
        owner: repoOwner,
        repo: repoName,
        ref: `heads/${branchName}`,
        sha: newCommit.sha,
    });

    const { data: pullRequest } = await octokit.pulls.create({
        owner: repoOwner,
        repo: repoName,
        title: commitMessage,
        head: branchName,
        base: defaultBranch,
        body: 'This PR updates the selectors in the scraper file.',
    });

    console.log('Pull request created:', pullRequest.html_url);
}

module.exports = { raisePullRequest };

