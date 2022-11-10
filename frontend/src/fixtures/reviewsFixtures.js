const reviewsFixtures = {
    oneReview: {
        "id" : 1,
        "itemid": 27,
        "reviewerEmail": "cgaucho@ucsb.edu",
        "stars": "3",
        "comments": "Meh",
        "dateReviewed": "2022-04-20T12:00:00",
    },
    threeReviews: [
        {
            "id" : 1,
            "itemid": 27,
            "reviewerEmail": "cgaucho@ucsb.edu",
            "stars": "3",
            "comments": "Meh",
            "dateReviewed": "2022-04-20T12:00:00",
        },
        {
            "id" : 2,
            "itemid": 29,
            "reviewerEmail": "cgaucho@ucsb.edu",
            "stars": "5",
            "comments": "Best apple pie ever",
            "dateReviewed": "2022-04-20T12:00:00",
        },
        {
            "id" : 3,
            "itemid": 29,
            "reviewerEmail": "Idelplaya@ucsb.edu",
            "stars": "0",
            "comments": "not trynna get food poisoning, but if i were this would do it",
            "dateReviewed": "2022-04-21T12:00:00",
        },
    ]
};


export { reviewsFixtures };