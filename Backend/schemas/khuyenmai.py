from pydantic.alias_generators import to_camel
from datetime import date

from pydantic import BaseModel, ConfigDict


class KhuyenMaiBase(BaseModel):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ten: str | None = None
    hansudung: date | None = None


class KhuyenMaiCreate(KhuyenMaiBase):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    pass


class KhuyenMaiUpdate(BaseModel):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    ten: str | None = None
    hansudung: date | None = None


class KhuyenMaiResponse(KhuyenMaiBase):

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: int
