from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Depends
from passlib.context import CryptContext
from typing import List

from .jwt_token import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from .schemas import Login, Message

from jose import JWTError, jwt

from datetime import timedelta


router = APIRouter(
    prefix="/api",
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Фейковая база пользователей
fake_users_db = {
    "user1": {
        "username": "user1",
        "hashed_password": pwd_context.hash("password1"),  # Пример хешированного пароля
    }
}


@router.post("/login")
async def login(form_data: Login):
    user = fake_users_db.get(form_data.username)
    if not user or not pwd_context.verify(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    # Если логин успешен, создаем токен
    access_token = create_access_token(data={"sub": user["username"]},
                                       expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

    return {"access_token": access_token, "token_type": "bearer"}


# Класс для управления активными WebSocket соединениями
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"Client connected: {websocket.client}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        if not self.active_connections:
            print("No active connections")
            return
        print(f"Active connections: {len(self.active_connections)}")
        for connection in self.active_connections:
            await connection.send_text(message)
            print(f"Message sent to: {connection.client}, {message}")

manager = ConnectionManager()


# Конечная точка WebSocket
@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data)  # Отправляем всем подключенным пользователям
    except WebSocketDisconnect:
        manager.disconnect(websocket)


# Функция для проверки JWT токена
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# Конечная точка для авторизованных пользователей
@router.post("/send-message/")
async def send_message(message: Message):
    text_message = message.message  # Предполагается, что в схеме Message есть поле 'message'

    # Отправляем сообщение на WebSocket канал всем активным соединениям
    await manager.broadcast(text_message)  # Отправляем только текст, а не объект

    print(f"Message tochno sent: {text_message}")  # Логируем отправленное сообщение

    return {'message': "Message sent"}
