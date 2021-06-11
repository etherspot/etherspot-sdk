#!/bin/bash
set -euo pipefail

applicationName=$1
package=$2

payload=$(
cat <<EOM
{
    "attachments": [
        {
            "fallback": "A new version of $applicationName is available for use. :circleci-pass:",
            "color": "#33CC66",
            "pretext": "A new version of $applicationName is available for use. :circleci-pass:",
            "title": "$CIRCLE_PROJECT_REPONAME",
            "title_link": "https://circleci.com/workflow-run/$CIRCLE_WORKFLOW_WORKSPACE_ID",
            "text": "artifact published: $package",
            "ts": $(date '+%s')
        }
    ]
}
EOM
)

curl -X POST --data-urlencode payload="$payload" "$SLACK_WEBHOOK_URL"
curl -X POST --data-urlencode payload="$payload" "$SLACK_WEBHOOK_FRONTEND"