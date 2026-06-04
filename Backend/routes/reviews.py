from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from model.khachhang import KhachHang
from model.reviews import Review

router = APIRouter(prefix="/reviews", tags=["Đánh giá (Reviews)"])


class ReviewCreateRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    dish_id: str = Field(..., alias="dishId")
    rating: int = Field(..., ge=1, le=5)
    comment: str
    images: list[str] | None = None


class ReviewResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    id: str
    dish_id: str = Field(..., alias="dishId")
    author: str
    avatar: str
    rating: int
    comment: str
    date: str
    images: list[str] | None = None


@router.get("", response_model=list[ReviewResponse])
def get_all_reviews(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_user)],
):
    """Lấy danh sách tất cả các đánh giá."""
    reviews = db.query(Review).order_by(Review.created_at.desc()).all()
    
    result = []
    for r in reviews:
        author_name = r.khachhang.ten if r.khachhang and r.khachhang.ten else (r.user_id or "Khách hàng")
        author_avatar = r.khachhang.avatar if r.khachhang and r.khachhang.avatar else "😋"
        
        # Chuyển đổi định dạng ngày
        date_str = r.created_at.strftime("%d/%m/%Y") if r.created_at else ""
        
        result.append(
            ReviewResponse(
                id=str(r.id),
                dishId=r.menu_item_id or "",
                author=author_name,
                avatar=author_avatar,
                rating=r.rating or 5,
                comment=r.comment or "",
                date=date_str,
                images=r.images or [],
            )
        )
    return result


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    data: ReviewCreateRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[KhachHang, Depends(get_current_user)],
):
    """Gửi đánh giá món ăn mới."""
    review = Review(
        user_id=current_user.makh,
        menu_item_id=data.dish_id,
        rating=data.rating,
        comment=data.comment,
        images=data.images or [],
        created_at=datetime.now(),
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    date_str = review.created_at.strftime("%d/%m/%Y") if review.created_at else ""
    return ReviewResponse(
        id=str(review.id),
        dishId=review.menu_item_id or "",
        author=current_user.ten or current_user.taikhoan or "Khách hàng",
        avatar=current_user.avatar or "😋",
        rating=review.rating or 5,
        comment=review.comment or "",
        date=date_str,
        images=review.images or [],
    )
