'use strict'

const path = require('path');
const { app, ipcMain } = require('electron');
const { ipcRenderer } = require('electron')
const Window = require('./Window')
const DataStore = require('./DataStore');
require('./main.js');

//electron no rest error check 
require('electron-reload')(__dirname,
   {
electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
 });


// create a new todo store name "Todos Main"
const timesData = new DataStore({ name: 'Times Main' })

function createindexWindow ()
{
 // todo list window
 const indexWindow = new Window(
   {
    webPreferences:
    {
   nodeIntegration: true
    },
   file: path.join('renderer', 'index.html')
 })

 // add todo window
 let addTimeWindow

 // TODO: put these events into their own file

 // initialize with todos
 indexWindow.once('show', () => 
 {
   indexWindow.webContents.send('todos', timesData.todos)
 })

 // create add todo window
 ipcMain.on('add-todo-window', () => 
 {
   // if addTodoWin does not already exist
   if (!addTimeWindow) 
   {
     // create a new add todo window
     addTimeWindow = new Window(
       {
       width: 400,
       height: 550,
       webPreferences:
       {
      nodeIntegration: true
       },
       file: path.join('renderer', 'add.html'),
       // close with the main window
       parent: indexWindow
     })

     // cleanup
     addTimeWindow.on('closed', () => 
     {
       addTimeWindow = null
     })
   }
 })

 // add-todo from add todo window
 ipcMain.on('add-todo', (event, todo) => 
 {
   const updatedTodos = timesData.addTodo(todo).todos

   indexWindow.send('todos', updatedTodos)
 })

 // delete-todo from todo list window
 ipcMain.on('delete-todo', (event, todo) => 
 {
   const updatedTodos = timesData.deleteTodo(todo).todos

   indexWindow.send('todos', updatedTodos)
 })
}
app.on('ready', createindexWindow)

app.on('window-all-closed', function createindexWindow ()
{
 app.quit()
})

