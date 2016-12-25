import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'http://facebook.github.io',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'http://github.com/reactjs/redux',
    author: 'Dan Abramov',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const isSearched = (query) => (item) =>
  !query || item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      list,
      query: '',
    };

    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onSearchChange(event) {
    this.setState({
      query: event.target.value,
    });
  }

  render() {
    const { query, list } = this.state;
    return (
      <div className="App">
        <Search query={query} onChange={this.onSearchChange}>Search: </Search>
        <Table list={list} pattern={query} />
      </div>
    );
  }
}

const Search = ({ value, onChange, children }) =>
  <form>
    {children}
    <input type="text" placeholder="search" className="searchInput"
      value={value}
      onChange={onChange} />
  </form>;

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
