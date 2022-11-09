import React from 'react';

import ArticleForm from "main/components/Article/ArticleForm"
import { articleFixtures } from 'fixtures/articleFixtures';

export default {
    title: 'components/Article/ArticleForm',
    component: ArticleForm
};


const Template = (args) => {
    return (
        <ArticleForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    article: articleFixtures.oneArticle,
    submitText: "",
    submitAction: () => { }
};
