import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/vi';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    object_id: 0,
  },
  {
    title: 'Redux',
    url: "https://github.com/reactjs/redux",
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    object_id: 1,
  },
];


function isSearched(search_term)
{
  return function(item) {
    return !search_term ||
      item.title.toLowerCase().includes(search_term.toLowerCase());
  }
}

const Search = ({value, onChange, children}) =>
  <form>
    {children} <input
      type="text"
      value={value}
      onChange={onChange}
    />
  </form>

const Table = ({list, pattern, onDismiss}) =>
  <div classname="table">
    {list.filter(isSearched(pattern)).map(item =>
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

const Button = ({onClick, className = '', children}) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      list,
      search_term: '',
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id) {
    const isNotId = item => item.object_id !== id;
    const updated_list = this.state.list.filter(isNotId);
    this.setState({list: updated_list});
  }

  onSearchChange(event) {
    this.setState({search_term: event.target.value});
  }


  render() {
    const {search_term, list} = this.state;
    return (
      <div className="page">
        <div className="interactions">
          <Search 
            value={search_term}
            onChange={this.onSearchChange}
          >
            Search
          </Search>
        </div>
          <Table 
            list={list}
            pattern={search_term}
            onDismiss={this.onDismiss}
          />
      </div>
    );
  }
}

export default App;