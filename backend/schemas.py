from pydantic import BaseModel

# ✅ FIRST define TaskBase
class TaskBase(BaseModel):
    title: str
    description: str | None = None
    priority: str
    due_date: str | None = None

# ✅ THEN use it
class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: str
    description: str | None = None
    completed: bool
    priority: str
    due_date: str | None = None

class TaskResponse(TaskBase):
    id: int
    completed: bool

    class Config:
        from_attributes = True