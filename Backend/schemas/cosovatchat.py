from pydantic import BaseModel, ConfigDict, Field


class CoSoVatChatBase(BaseModel):
    ten: str | None = None
    soluong: str | None = None
    chatluong: str | None = None


class CoSoVatChatCreate(CoSoVatChatBase):
    ten: str = Field(..., min_length=1)


class CoSoVatChatUpdate(BaseModel):
    soluong: str | None = None
    chatluong: str | None = None


class CoSoVatChatResponse(CoSoVatChatBase):
    model_config = ConfigDict(from_attributes=True)
