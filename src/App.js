import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = '?query=';
const PARAM_PAGE = '&page=';
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
    const { hits, page } = result;
    const oldHits = page === 0 ? [] : this.state.result.hits;
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      result: {
        hits: updatedHits,
        page,
      },
      isLoading: false,
    });
  }

  fetchSearchTopStories(query, page) {
    this.setState({
      isLoading: true,
    });

    fetch(`${SEARCH}${query}${PARAM_PAGE}${page}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result));
  }

  componentDidMount() {
    const { query } = this.state;
    this.fetchSearchTopStories(query, DEFAULT_PAGE);
  }

  onSearchChange(event) {
    this.setState({
      query: event.target.value,
    });
  }

  onSearchSubmit(event) {
    const { query } = this.state;
    this.fetchSearchTopStories(query, DEFAULT_PAGE);
    event.preventDefault();
  }

  render() {
    const { query, result, isLoading } = this.state;
    const page = (result && result.page) || 0;
    return (
      <div className="App">
        <Search
          query={query}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}>Search</Search>
        { isLoading && <Loading>Loading</Loading> }
        { result ? <Table list={result.hits} pattern={query} /> : null }
        <Button onClick={() => this.fetchSearchTopStories(query, page + 1)}>More</Button>
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

const Button = ({ onClick, children }) =>
  <button onClick={onClick} type="button">{children}</button>;

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
