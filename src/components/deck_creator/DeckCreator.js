import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { makeStyles } from "@material-ui/styles";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import { CurrentDeckProvider } from "./CurrentDeckContext";
import QuestionFilter from "./QuestionFilter";
import CurrentDeck from "./CurrentDeck";
import QuestionForm from "./QuestionForm";

const GET_STANDARDS = gql`
  {
    allStandards {
      title
      description
      id
    }
  }
`;

const useStyles = makeStyles({
  root: {
    display: "flex",
    width: "100%",
    height: "100vh"
  },
  firstContainer: {
    width: "60%",
    padding: "25px",
    borderRight: "1px solid #E0E0E0"
  },
  secondContainer: {
    width: "40%"
  },
  searchResults: {
    padding: "15px"
  },
  panel: {
    padding: "10px"
  }
});

const CREATE_QUESTION = gql`
  mutation createQuestion(
    $questionType: String!
    $standardId: ID
    $tags: [String!]
    $questionNode: String!
    $questionPlaintext: String!
    $questionOptions: [String!]
  ) {
    createQuestion(
      questionType: $questionType
      standardId: $standardId
      tags: $tags
      questionNode: $questionNode
      questionPlaintext: $questionPlaintext
      questionOptions: $questionOptions
    ) {
      id
      questionNode
      questionOptions {
        id
        question {
          id
        }
        questionId
        correct
        optionNode
        optionText
      }
      questionText
      taggings {
        id
        questionId
        tagId
      }
      tags {
        id
        name
      }
    }
  }
`;

const questionTypes = ["Free Response", "Multiple Choice"];

const DeckCreator = ({ onQuery }) => {
  const classes = useStyles();
  const { data: { allStandards = [] } = {} } = useQuery(GET_STANDARDS);
  const [create_question, { data }] = useMutation(CREATE_QUESTION);

  const onSubmit = formData => {    
    create_question({
      variables: {
        questionType: formData["questionType"],
        standardId: formData["standardId"],
        tags: formData["tags"],
        questionNode: JSON.stringify(formData["question"], 2),
        questionPlaintext: formData["questionText"],
        questionOptions: formData["answers"].map(answer =>
          JSON.stringify(answer, 2)
        )
      }
    });
  };

  return (
    <CurrentDeckProvider>
      <div className={classes.root}>
        <div className={classes.firstContainer}>
          <Tabs>
            <TabList>
              <Tab>Search Questions</Tab>
              <Tab>Create Question</Tab>
            </TabList>

            <TabPanel className={classes.panel}>
              <QuestionFilter />
            </TabPanel>
            <TabPanel className={classes.panel}>
              <QuestionForm
                standards={allStandards}
                questionTypes={questionTypes}
                onSubmit={onSubmit}
              />
            </TabPanel>
          </Tabs>
        </div>
        <div className={classes.secondContainer}>
          <CurrentDeck classes={classes} />
        </div>
      </div>
    </CurrentDeckProvider>
  );
};

export default DeckCreator;
