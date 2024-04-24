from fastapi import FastAPI, HTTPException 
from fastapi.middleware.cors import CORSMiddleware
from model import Todo
from database import (
    fetch_one_todo,
    fetch_all_todos,
    create_todo,
    update_todo_by_title,
    delete_todo_by_title,  
)

app =  FastAPI()
load_dotenv()
origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


@app.get('/healthz')
def healthz():
    return {"health":"ok"}


@app.get('/api/todo')
async def get_todo():
    response = await fetch_all_todos()
    return response


@app.get('/api/todo/{title}', response_model = Todo)
async def get_todo_by_id(title):
    response = await fetch_one_todo(title)
    if response:
        return response
    raise HTTPException(404, "there is no todo with this title")


@app.post('/api/todo', response_model = Todo)
async def post_todo(todo: Todo):
    response = await create_todo(todo.dict())
    if(response):
        return response
    raise HTTPException(400, "something went wrong")


@app.put('/api/todo/{title}', response_model = Todo)
async def update_todo(title: str, desc: str):
    response = await update_todo_by_title(title, desc)
    if response:
        return response
    raise HTTPException(404, f"there is now such todo with title {title}")


@app.delete("/api/todo/{title}")
async def delete_todo(title ):
    response = await delete_todo_by_title(title)
    if response:
        return "delete"
    raise HTTPException(404, f"there is now such todo with title {title}")
