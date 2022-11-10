const helpRequestsFixtures = {
    oneHelpRequest: {
        "explanation": "Need help",
        "id": 1,
        "requestTime": "2022-11-05T23:50:51.168Z",
        "requesterEmail": "cgaucho@ucsb.edu",
        "solved": false,
        "tableOrBreakoutRoom": "table",
        "teamId": "7pm-2"
    },
    threeRequests: [
        {
            "explanation": "Swagger sucks",
            "id": 1,
            "requestTime": "2022-11-05T23:50:51.168Z",
            "requesterEmail": "dgaucho@ucsb.edu",
            "solved": false,
            "tableOrBreakoutRoom": "table",
            "teamId": "7pm-2"
        },
        {
            "explanation": "Need help",
            "id": 2,
            "requestTime": "2022-10-05T23:50:51.168Z",
            "requesterEmail": "egaucho@ucsb.edu",
            "solved": false,
            "tableOrBreakoutRoom": "breakout",
            "teamId": "7pm-2"
        },
        {
            "explanation": "Don't need help",
            "id": 3,
            "requestTime": "2022-12-05T23:50:51.168Z",
            "requesterEmail": "fgaucho@ucsb.edu",
            "solved": true,
            "tableOrBreakoutRoom": "table",
            "teamId": "7pm-2"
        },
    ]
}

export { helpRequestsFixtures }