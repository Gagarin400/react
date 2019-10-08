import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel/search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form/';

import './app.css'; 

export default class App extends Component {
  maxId = 100;
  state = {
    todoData: [
      this.createTodoItem('Drink Cofee'),
      this.createTodoItem('Make Awesome App'),
      this.createTodoItem('Have a lunch')
    ],
    term: '',
    filter: 'active'
  };

  createTodoItem(label) {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++
    }
  }

  deleteItem = (id) => {
    this.setState(({todoData}) => {
      const idx = todoData.findIndex((el) => el.id === id)

      const newArray = [ 
        ...todoData.slice(0, idx),
        ...todoData.slice(idx + 1) ]

      return {
        todoData: newArray
      }
    })
  }
  addItem = (text) => {
    const newItem = this.createTodoItem(text);

    this.setState(({todoData}) => {
      const newArr = [ 
      ...todoData,
      newItem 
      ];

      return {
        todoData: newArr
      }
    });
  };
  toogleProperty(arr, id, propName) {
    const idx = arr.findIndex((el) => el.id === id)
    const oldItem = arr[idx];
    
    const newItem = { ...oldItem, 
      [propName]: !oldItem.propName }

    return [ 
      ...arr.slice(0, idx),
      newItem,
      ...arr.slice(idx + 1) ]
  }

  onToogleImportant = (id) => {
    this.setState(({todoData}) => {
  
      return {
        todoData: this.toogleProperty(todoData, id, 'important')
      }
    })
  }
  onToogleDone = (id) => {
    this.setState(({todoData}) => {

      return {
        todoData: this.toogleProperty(todoData, id, 'done')
      }
    })
  }
  onSearchChange = (term) => {
    this.setState ({ term })
  };

  search(items, term) {
    if (term.length === 0) {
      return items;
    }
    return items.filter((item) => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
    });
  }
  filter(items, filter) {
    switch(filter) {
      case 'all':
        return items;
      case 'active':
        return items.filter((item) => !item.done)
      case 'done':
        return items.filter((item) => item.done)
      default: 
        return items;
    }
  }
  onFilterChange = (filter) => {
    this.setState({ filter });
  }
  render() {
    const { todoData, term, filter } = this.state;
    const visibleItems = this.filter (
      this.search(todoData, term), filter);
    const doneCount = todoData.filter((el) => el.done).length;
    const todoCount = todoData.length - doneCount;
    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel 
          onSearchChange = {this.onSearchChange}/>
          <ItemStatusFilter filter={filter}
           onFilterChange = { this.onFilterChange }/>
        </div>
  
        <TodoList 
        todos={visibleItems} 
        onDeleted={ this.deleteItem }
        onToogleImportant = {this.onToogleImportant}
        onToogleDone = {this.onToogleDone}/>

        <ItemAddForm onItemAdded = {this.addItem}/>
      </div>
    );
  }
}