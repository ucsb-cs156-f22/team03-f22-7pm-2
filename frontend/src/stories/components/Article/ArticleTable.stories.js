import React from 'react';

import ArticleTable from "main/components/Article/ArticleTable";
import { articleFixtures } from 'fixtures/articleFixtures';

export default {
    title: 'components/Article/ArticleTable',
    component: ArticleTable
};

const Template = (args) => {
    return (
        <ArticleTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    articles: []
};

export const ThreeArticles = Template.bind({});

ThreeArticles.args = {
    articles: articleFixtures.threeArticles
};


