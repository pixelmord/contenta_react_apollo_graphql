// ----------------------
// IMPORTS

/* NPM */

// React
import React from 'react';
import PropTypes from 'prop-types';

// GraphQL
import { graphql } from 'react-apollo';

// Listen to Redux store state
import { connect } from 'react-redux';

// Routing
import {
  Link,
  Route,
  Switch,
} from 'react-router-dom';

// <Helmet> component for setting the page title
import Helmet from 'react-helmet';

/* Local */

// NotFound 404 handler for unknown routes
import { NotFound } from 'kit/lib/routing';

// GraphQL queries
import allRecipes from 'src/queries/all_recipes.gql';

// Styles
import './styles.global.css';


// ----------------------


// Create a route that will be displayed when the code isn't found
const WhenNotFound = () => (
  <NotFound>
    <h1>Unknown route - the 404 handler was triggered!</h1>
  </NotFound>
);

// Stats pulled from the environment.  This demonstrates how data will
// change depending where we're running the code (environment vars, etc)
// and also how we can connect a 'vanilla' React component to an RxJS
// observable source, and feed eventual values in as properties
const Stats = () => {
  const info = [
    ['Environment', process.env.NODE_ENV],
  ];

  return (
    <ul>
      {info.map(([key, val]) => (
        <li key={key}>{key}: <span>{val}</span></li>
      ))}
    </ul>
  );
};

// Now, let's create a GraphQL-enabled component...

// ... then, let's create the component and decorate it with the `graphql`
// HOC that will automatically populate `this.props` with the query data
// once the GraphQL API request has been completed
@graphql(allRecipes)
class RecipeList extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      nodeQuery: PropTypes.shape({
        entities: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
          }),
        ),
      }),
    }),
  }

  render() {
    const { data } = this.props;
    const recipes = (typeof data.nodeQuery !== 'undefined' && typeof data.nodeQuery.entities !== 'undefined') ? data.nodeQuery.entities : [];
    const isLoading = data.loading ? 'yes' : 'nope';
    return (
      <div>
        <h2>Recipes:</h2>
        {typeof recipes !== 'undefined' && recipes.length > 0 && recipes.map(recipe => (<div key={recipe.id}>{recipe.title}</div>))}
        <h2>Currently loading? {isLoading}</h2>
      </div>
    );
  }
}


export default () => (
  <div>
    <Helmet
      title="Umami"
      meta={[{
        name: 'description',
        content: 'contenta client built with react and apollo (GraphQL)',
      }]} />

    <ul>
      <li><Link to="/">Home</Link></li>
    </ul>
    <hr />
    <Switch>
      <Route exact path="/" component={RecipeList} />
      <Route component={WhenNotFound} />
    </Switch>
    <Stats />
  </div>
);
