import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = '?query=';
const SEARCH = `${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}`;

const isSearched = (query) => (item) =>
  !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      result: null,
      query: DEFAULT_QUERY,
      isLoading: false,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({
      result,
      isLoading: false,
    });
  }

  fetchSearchTopStories(query) {
    this.setState({
      isLoading: true,
    });

    fetch(`${SEARCH}${query}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result));
  }

  componentDidMount() {
    const { query } = this.state;
    this.fetchSearchTopStories(query);
  }

  onSearchChange(event) {
    this.setState({
      query: event.target.value,
    });
  }

  onSearchSubmit(event) {
    const { query } = this.state;
    this.fetchSearchTopStories(query);
    event.preventDefault();
  }

  render() {
    const { query, result, isLoading } = this.state;
    return (
      <div className="App">
        <Search
          query={query}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}>Search</Search>
        { isLoading && <Loading>Loading</Loading> }
        { result ? <Table list={result.hits} pattern={query} /> : null }
      </div>
    );
  }
}

const Search = ({ value, onChange, onSubmit, children }) =>
  <form onSubmit={onSubmit}>
    <input type="text" placeholder="search" className="searchInput"
      value={value}
      onChange={onChange} />
    <button type="submit">{children}</button>
  </form>;

const Loading = ({ children }) =>
  <div>{children}</div>;

class Table extends Component {
  render() {
    const { list, pattern } = this.props;
    return (
      <div>
      {
        list.filter(isSearched(pattern)).map((item) =>
          <div key={item.objectID} className="list">
            <span><a href={item.url}>{item.title}</a></span>
            <span>{item.author}</span>
            <span>{item.points}</span>
          </div>
        )
      }
      </div>
    );
  }
}

export default App;
