from pydantic.alias_generators import to_camel
from pydantic import BaseModel, ConfigDict, Field


class CoSoVatChatBase(BaseModel):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ten: str | None = None
    soluong: str | None = None
    chatluong: str | None = None


class CoSoVatChatCreate(CoSoVatChatBase):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ten: str = Field(..., min_length=1)


class CoSoVatChatUpdate(BaseModel):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    soluong: str | None = None
    chatluong: str | None = None


class CoSoVatChatResponse(CoSoVatChatBase):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
