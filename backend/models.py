from sqlalchemy import Column, Integer, String, Boolean
from backend.database import Base

# ADD THIS IMPORT
from sqlalchemy import DateTime
from datetime import datetime

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    priority = Column(String, default="Low")

    # NEW FIELD
    due_date = Column(String, nullable=True)