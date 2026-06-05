from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_active_admin, get_current_user
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
    dish_name: str | None = Field(default=None, alias="dishName")
    dish_image: str | None = Field(default=None, alias="dishImage")
    author: str
    avatar: str
    rating: int
    comment: str
    date: str
    images: list[str] | None = None
    admin_reply: str | None = Field(default=None, alias="adminReply")
    admin_reply_at: str | None = Field(default=None, alias="adminReplyAt")


class ReviewReplyRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
    reply: str = Field(..., min_length=1, max_length=1000)


def build_review_response(review: Review, *, current_user: KhachHang | None = None) -> ReviewResponse:
    author_name = review.khachhang.ten if review.khachhang and review.khachhang.ten else (review.user_id or "Khách hàng")
    author_avatar = review.khachhang.avatar if review.khachhang and review.khachhang.avatar else "😋"
    if current_user and review.user_id == current_user.makh:
        author_name = current_user.ten or current_user.taikhoan or author_name
        author_avatar = current_user.avatar or author_avatar

    date_str = review.created_at.strftime("%d/%m/%Y") if review.created_at else ""
    reply_at = review.admin_reply_at.strftime("%d/%m/%Y %H:%M") if review.admin_reply_at else None

    return ReviewResponse(
        id=str(review.id),
        dishId=review.menu_item_id or "",
        dishName=review.thucdon.ten if review.thucdon else None,
        dishImage=review.thucdon.hinhanh if review.thucdon else None,
        author=author_name,
        avatar=author_avatar,
        rating=review.rating or 5,
        comment=review.comment or "",
        date=date_str,
        images=review.images or [],
        adminReply=review.admin_reply,
        adminReplyAt=reply_at,
    )


@router.get("", response_model=list[ReviewResponse])
def get_all_reviews(
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_user)],
):
    """Lấy danh sách tất cả các đánh giá."""
    reviews = db.query(Review).order_by(Review.created_at.desc()).all()
    return [build_review_response(review) for review in reviews]


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

    return build_review_response(review, current_user=current_user)


@router.patch("/{review_id}/reply", response_model=ReviewResponse)
def reply_review(
    review_id: int,
    data: ReviewReplyRequest,
    db: Annotated[Session, Depends(get_db)],
    _: Annotated[KhachHang, Depends(get_current_active_admin)],
):
    """Admin: phản hồi một đánh giá món ăn."""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Không tìm thấy đánh giá")

    review.admin_reply = data.reply.strip()
    review.admin_reply_at = datetime.now()
    db.add(review)
    db.commit()
    db.refresh(review)
    return build_review_response(review)
