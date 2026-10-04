import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.db.session import async_engine, Base

@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.mark.asyncio
async def test_auth_and_roles():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Register Student
        reg_res = await ac.post("/api/auth/register", json={
            "email": "student@veridraft.edu",
            "password": "Password123!",
            "full_name": "Test Student",
            "role": "student"
        })
        assert reg_res.status_code == 201

        # 2. Login Student
        login_res = await ac.post("/api/auth/login", json={
            "email": "student@veridraft.edu",
            "password": "Password123!"
        })
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]

        # 3. Get /me
        me_res = await ac.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert me_res.status_code == 200
        assert me_res.json()["email"] == "student@veridraft.edu"
