import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';

//page 100

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 100;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage='

function isSearched(search_term)
{
  return function(item) {
    return !search_term ||
      item.title.toLowerCase().includes(search_term.toLowerCase());
  }
}

const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>

const Table = ({list, pattern, onDismiss}) =>
  <div classname="table">
    {list.map(item =>
      <div key={item.object_id} className="table-row">
        <span style={{width: '40%'}}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{width: '30%'}}>{item.author}</span>
        <span style={{width: '10%'}}>{item.num_comments}</span>
        <span style={{width: '10%'}}>{item.points}</span>
        <span style={{width: '10%'}}>
          <Button
            onClick={() => onDismiss(item.object_id)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>

Table.propTypes = {
  list: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired,
}

const Button = ({onClick, className = '', children}) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      search_key: '',
      search_term: DEFAULT_QUERY,
    };

    this.needsToSearchTopStoriest = this.needsToSearchTopStoriest.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearchTopStoriest(search_term) {
    return !this.state.results[search_term];
  }

  onDismiss(id) {
    const { search_key, results } = this.state;
    const { hits, page } = results[search_key];
    const isNotId = item => item.objectID !== id;
    const updated_hits = hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [search_key]: { hits: updated_hits, page }
      }
    });
  }

  onSearchChange(event) {
    this.setState({search_term: event.target.value});
  }

  setSearchTopstories(result) {
    const { hits, page } = result;
    const { search_key, results } = this.state;
    const old_hits = results && results[search_key] 
      ? results[search_key].hits 
      : [];
    const updated_hits = [...old_hits, ...hits];
    this.setState({ results: { ...results, [search_key]: { hits: updated_hits, page } } });
  }

  fetchSearchTopstories(search_term, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${search_term}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result));
  }

  componentDidMount() {
    const { search_term } = this.state;
    this.setState({ search_key: search_term });
    this.fetchSearchTopstories(search_term, DEFAULT_PAGE);
  }

  onSearchSubmit(event) {
    const { search_term } = this.state;
    this.setState({ search_key: search_term });
    if (this.needsToSearchTopStoriest(search_term)) {
      this.fetchSearchTopstories(search_term, DEFAULT_PAGE);
    }
    event.preventDefault();
  }

  render() {
    const {
      search_term, 
      results,
      search_key
    } = this.state;

    const page = (
      results &&
      results[search_key] &&
      results[search_key].page
    ) || 0;

    const list = (
      results &&
      results[search_key] &&
      results[search_key].hits
    ) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search 
            value={search_term}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        <Table 
          list={list}
          onDismiss={this.onDismiss}
        />
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopstories(search_key, page+1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
}

export default App;