import React from "react";
import './App.css';
import { Button, Card, Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function Todo({ todo, index, markAsDone, deleteTodo, changeFinishDate, handlePriorityChange, getPriorityColor }) {
  
  
  return (
    <div
      className="todo">
      <span className="todo-text" style={{ textDecoration: todo.isDone ? "line-through" : "" }}>{todo.text}</span>
      <li key={index}>
                <select
                style={getPriorityColor(todo.priority)}
                value={todo.priority}
                onChange={(e) => handlePriorityChange(index, e.target.value)}> 
                  <option hidden>Select Priority</option>
                  <option className="low" value="Low" >Low</option>
                  <option className="Medium" value="Medium">Medium</option>
                  <option className="High" value="High">High</option>
                </select>
      </li>
      <DatePicker
                className="date-area"
                selected={todo.finishDate} 
                minDate={new Date()}
                onChange={(date) => changeFinishDate(index, date)} 
                placeholderText="Select Finish Date" />
      <span className="todoNumber">{''.concat("Task ", index + 1)}</span>
      
      <div className="button-area">
        <Button variant="outline-success" onClick={() => {markAsDone(index)}} className={todo.isDone ? 'active' : ' '}>✓</Button>{' '}
        <Button variant="outline-danger" onClick={() => deleteTodo(index)}>✕</Button>
      </div>
    </div>
  );
}


function FormTodo({ addTodo, clearTodos, searchText, setSearchText}) {
  const [value, setValue] = React.useState("");
  
  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <Form onSubmit={handleSubmit}> 
    <div className="input-area">
      <Form.Group className="form-group">
        <Form.Label><b>Add Todo</b></Form.Label>
       <div className="button-area"> 
          <Form.Control type="text" className="input" value={value} onChange={e => setValue(e.target.value)} placeholder="Add new todo" />
          <Button className="submit-button" variant="primary" type="submit">
            Submit
          </Button>
          <button type="button" class="btn btn-secondary" onClick={() => clearTodos()}>Clear All</button>
       </div>
      </Form.Group>
      <div className="search-area">
        <Form.Control type="text" className="search-input" value={searchText} onChange={handleSearch} placeholder="Search for todos 🔎"/>
      </div>
    </div>
  </Form>
  );
}


function App() {
  const [todos, setTodos] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [searchText, setSearchText] = React.useState('');
  const [selectedPriority, setSelectedPriority] = React.useState('')
  const [sortByDate, setSortByDate] = React.useState(false);
  const [sortByPriority, setSortByPriority] = React.useState(false);

  const addTodo = text => {
    let newTodo = {
      text: text,
      finishDate: null,
      isDone: false,
      priority: '',
    }
    let newTodos = [...todos, newTodo];
    setTodos(newTodos);
  };

  const changeFinishDate = (index, date) => {
    todos[index].finishDate = date;
    setTodos(todos);
    setSelectedDate(date);
  };
  
  const markAsDone = index => {
    let newTodos = [...todos];
    newTodos[index].isDone = true;
    let completedTodo = newTodos.splice(index, 1)[0];
    newTodos.push(completedTodo);
    setTodos(newTodos);
  };
  
  const deleteTodo = index => {
    let newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };
  
  const clearTodos = () => {
    todos.splice(0, todos.length);
    setTodos([...todos]);
  }; 

  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortTodos = () => {
    let sortedTodos = [];
    if (sortByDate) {
      sortedTodos = [...filteredTodos].sort((a, b) => new Date(a.finishDate) - new Date(b.finishDate));
    } else if (sortByPriority) {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      sortedTodos = [...filteredTodos].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    } 
    setTodos(sortedTodos);
  };

  const handleSortByDate = () => {
    setSortByDate(!sortByDate);
    setSortByPriority(false);
   };

  const handlePriorityChange = (index, priority) => {
    todos[index].priority = priority;
    setTodos(todos);
    setSelectedPriority(priority);
  };

  const handleSortByPriority = () => {
    setSortByPriority(!sortByPriority);
    setSortByDate(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low':
        return { 
          color: 'white' , 
          backgroundColor: 'rgb(39 114 89)', 
          borderRadius: '32px' };
      case 'Medium':
        return { 
          color: 'white', 
          backgroundColor: 'rgb(240 93 7 / 84%)', 
          borderRadius: '32px'  };
      case 'High':
        return {
          color: 'white', 
          backgroundColor: 'rgb(186 17 59)' , 
          borderRadius: '32px' };
      default:
        return { backgroundColor: 'white', color: 'black' , borderRadius: '32px' };
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="text-center mb-4">✨ To-do List ✨ </h1>
        <FormTodo addTodo={addTodo} clearTodos={clearTodos} searchText={searchText} setSearchText={setSearchText}/>
        <div className="sort-area">
        
          <label className="checkbox-date">
              Sort by Date:
              <input name="sort"
                type="checkbox" 
                checked={sortByDate}
                onChange={handleSortByDate}
              />
            </label>
          
          <label className="checkbox-priority">
              Sort by Priority:
              <input name="sort"
                type="checkbox" 
                checked={sortByPriority}
                onChange={handleSortByPriority}
              />
           </label>
         <button type="button" className="btn btn-outline-light" onClick={sortTodos}>Sort</button>
        </div>

        <div>
          {filteredTodos.map((todo, index) => (
            <Card>
              <Card.Body>
                <Todo
                key={index}
                index={index}
                todo={todo}
                markAsDone={markAsDone}
                deleteTodo={deleteTodo}
                changeFinishDate={changeFinishDate}
                handlePriorityChange={handlePriorityChange}
                getPriorityColor={getPriorityColor}
                className="kart-body"
                />
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;