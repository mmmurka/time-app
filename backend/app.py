from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.api import router

app = FastAPI(debug=True)

origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    router,
)
