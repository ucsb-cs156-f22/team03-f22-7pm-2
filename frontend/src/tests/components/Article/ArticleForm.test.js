import { render, waitFor, fireEvent } from "@testing-library/react";
import ArticleForm from "main/components/Article/ArticleForm";
import { articleFixtures } from "fixtures/articleFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("ArticleForm tests", () => {

    test("renders correctly ", async () => {

        const { getByText } = render(
            <Router  >
                <ArticleForm />
            </Router>
        );
        await waitFor(() => expect(getByText(/Title/)).toBeInTheDocument());
        await waitFor(() => expect(getByText(/Create/)).toBeInTheDocument());
    });


    test("renders correctly when passing in a Article ", async () => {

        const { getByText, getByTestId } = render(
            <Router  >
                <ArticleForm initialArticle={articleFixtures.oneArticle} />
            </Router>
        );
        await waitFor(() => expect(getByTestId(/ArticleForm-id/)).toBeInTheDocument());
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByTestId(/ArticleForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        const { getByTestId, getByText } = render(
            <Router  >
                <ArticleForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("ArticleForm-title")).toBeInTheDocument());
        const dateAddedField = getByTestId("ArticleForm-dateAdded");
        const submitButton = getByTestId("ArticleForm-submit");

        fireEvent.change(dateAddedField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(getByText(/Date Added must be in ISO format/)).toBeInTheDocument());
    });

    test("Correct Error messsages on missing input", async () => {

        const { getByTestId, getByText } = render(
            <Router  >
                <ArticleForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("ArticleForm-submit")).toBeInTheDocument());
        const submitButton = getByTestId("ArticleForm-submit");

        fireEvent.click(submitButton);

        await waitFor(() => expect(getByText(/Title is required./)).toBeInTheDocument());
        expect(getByText(/Url is required./)).toBeInTheDocument();
        expect(getByText(/Explanation is required./)).toBeInTheDocument();
        expect(getByText(/Email is required./)).toBeInTheDocument();
        expect(getByText(/Date Added is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        const { getByTestId, queryByText } = render(
            <Router  >
                <ArticleForm submitAction={mockSubmitAction} />
            </Router>
        );
        await waitFor(() => expect(getByTestId("ArticleForm-title")).toBeInTheDocument());

        const titleField = getByTestId("ArticleForm-title");
        const urlField = getByTestId("ArticleForm-url");
        const explanationField = getByTestId("ArticleForm-explanation");
        const emailField = getByTestId("ArticleForm-email");
        const dateAddedField = getByTestId("ArticleForm-dateAdded");
        const submitButton = getByTestId("ArticleForm-submit");

        fireEvent.change(titleField, { target: { value: 'WAHOOOOOO' } });
        fireEvent.change(urlField, { target: { value: 'https://ucsb-cs156.github.io/f22/lab/team03/' } });
        fireEvent.change(explanationField, { target: { value: 'wahoo this is an explanation' } });
        fireEvent.change(emailField, { target: { value: 'hansonyu@ucsb.edu' } }); 
        fireEvent.change(dateAddedField, { target: { value: '2022-01-02T12:00:10' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/Date Added must be in ISO format/)).not.toBeInTheDocument();

    });


    test("Test that navigate(-1) is called when Cancel is clicked", async () => {

        const { getByTestId } = render(
            <Router  >
                <ArticleForm />
            </Router>
        );
        await waitFor(() => expect(getByTestId("ArticleForm-cancel")).toBeInTheDocument());
        const cancelButton = getByTestId("ArticleForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


