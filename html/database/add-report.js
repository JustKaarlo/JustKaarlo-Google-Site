// POST endpoint: add-report
// You POST a new report object to this function
// It appends to reports.json in your GitHub repo

const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Only POST allowed' };
  }

  const token = 'ghp_your_personal_token_here'; // GitHub PAT
  const repo = 'JustKaarlo/Reports-Database';
  const path = 'reports.json';
  const branch = 'main';

  const newReport = JSON.parse(event.body);

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json'
  };

  // 1. Get existing reports.json
  const fileRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, { headers });
  const fileData = await fileRes.json();

  const existingReports = JSON.parse(Buffer.from(fileData.content, 'base64').toString('utf-8'));

  // 2. Append new report
  existingReports.push(newReport);

  // 3. Commit updated file
  const updatedContent = Buffer.from(JSON.stringify(existingReports, null, 2)).toString('base64');

  const updateRes = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `Add report ${newReport.id}`,
      content: updatedContent,
      sha: fileData.sha,
      branch
    })
  });

  if (!updateRes.ok) {
    return { statusCode: 500, body: 'Failed to update reports.json' };
  }

  return { statusCode: 200, body: 'Report added!' };
};

export { handler };
