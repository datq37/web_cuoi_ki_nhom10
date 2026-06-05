import {
  MessageOutlined,
  PictureOutlined,
  ReloadOutlined,
  StarFilled,
} from '@ant-design/icons';
import { Avatar, Button, Empty, Image, Input, Modal, Rate, Spin, Tag, message } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Topbar from '@/pages/QuanTri/Topbar';
import PageToolbar from '@/pages/QuanTri/components/PageToolbar';
import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import styles from './index.less';

interface ReviewItem {
  id: string;
  dishId: string;
  dishName?: string;
  dishImage?: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  adminReply?: string;
  adminReplyAt?: string;
}

function isImageUrl(value?: string): boolean {
  return !!value && /^(https?:\/\/|data:image\/|\/uploads\/)/.test(value);
}

const AdminDanhGia: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [replying, setReplying] = useState<ReviewItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [savingReply, setSavingReply] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${ip3}/reviews`);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      message.error('Không tải được danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total ? reviews.reduce((sum, item) => sum + (item.rating || 0), 0) / total : 0;
    const replied = reviews.filter((item) => item.adminReply).length;
    const withImages = reviews.filter((item) => (item.images || []).length > 0).length;
    return { total, avg, replied, withImages };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return reviews.filter((item) => {
      const matchesKeyword =
        !kw ||
        item.author.toLowerCase().includes(kw) ||
        (item.dishName || item.dishId || '').toLowerCase().includes(kw) ||
        item.comment.toLowerCase().includes(kw) ||
        (item.adminReply || '').toLowerCase().includes(kw);
      const matchesRating = ratingFilter === 'all' || item.rating === ratingFilter;
      return matchesKeyword && matchesRating;
    });
  }, [keyword, ratingFilter, reviews]);

  const openReply = (review: ReviewItem) => {
    setReplying(review);
    setReplyText(review.adminReply || '');
  };

  const saveReply = async () => {
    if (!replying) return;
    const trimmed = replyText.trim();
    if (!trimmed) {
      message.warning('Nhập nội dung phản hồi');
      return;
    }

    setSavingReply(true);
    try {
      const res = await axios.patch(`${ip3}/reviews/${replying.id}/reply`, { reply: trimmed });
      setReviews((prev) => prev.map((item) => item.id === replying.id ? res.data : item));
      message.success('Đã lưu phản hồi');
      setReplying(null);
      setReplyText('');
    } catch (error) {
      console.error('Failed to reply review:', error);
      message.error('Không lưu được phản hồi');
    } finally {
      setSavingReply(false);
    }
  };

  return (
    <>
      <Topbar title="Đánh giá" />
      <div className={styles.pageBody}>
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Tổng đánh giá</span>
            <strong className={styles.statValue}>{stats.total}</strong>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Điểm trung bình</span>
            <strong className={styles.statValue}>{stats.avg.toFixed(1)}</strong>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Đã phản hồi</span>
            <strong className={styles.statValue}>{stats.replied}</strong>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Có hình ảnh</span>
            <strong className={styles.statValue}>{stats.withImages}</strong>
          </div>
        </div>

        <div className={styles.sectionTitle}>Phản hồi khách hàng</div>
        <PageToolbar
          searchPlaceholder="Tìm khách, món, nội dung..."
          searchValue={keyword}
          onSearch={setKeyword}
          actions={
            <Button icon={<ReloadOutlined />} onClick={fetchReviews} loading={loading}>
              Tải lại
            </Button>
          }
        />

        <div className={styles.filterRow}>
          {(['all', 5, 4, 3, 2, 1] as Array<number | 'all'>).map((value) => (
            <button
              key={value}
              type="button"
              className={`${styles.filterBtn} ${ratingFilter === value ? styles.filterActive : ''}`}
              onClick={() => setRatingFilter(value)}
            >
              {value === 'all' ? 'Tất cả' : `${value} sao`}
            </button>
          ))}
        </div>

        <Spin spinning={loading}>
          {filteredReviews.length === 0 ? (
            <div className={styles.emptyWrap}>
              <Empty description="Chưa có đánh giá phù hợp" />
            </div>
          ) : (
            <div className={styles.reviewList}>
              {filteredReviews.map((item) => (
                <div key={item.id} className={styles.reviewRow}>
                  <div className={styles.dishThumb}>
                    {item.dishImage ? (
                      <img src={item.dishImage} alt={item.dishName || item.dishId} />
                    ) : (
                      <PictureOutlined />
                    )}
                  </div>

                  <div className={styles.reviewContent}>
                    <div className={styles.reviewHead}>
                      <div>
                        <div className={styles.dishName}>{item.dishName || item.dishId || 'Món ăn'}</div>
                        <div className={styles.reviewMeta}>
                          <Avatar
                            size={24}
                            src={isImageUrl(item.avatar) ? item.avatar : undefined}
                            className={styles.authorAvatar}
                          >
                            {isImageUrl(item.avatar) ? null : item.avatar}
                          </Avatar>
                          <span>{item.author}</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                      <div className={styles.ratingBox}>
                        <StarFilled />
                        <span>{item.rating}</span>
                      </div>
                    </div>

                    <p className={styles.comment}>{item.comment}</p>

                    {(item.images || []).length > 0 && (
                      <Image.PreviewGroup>
                        <div className={styles.imageList}>
                          {(item.images || []).map((src, index) => (
                            <Image key={`${item.id}-${index}`} src={src} width={72} height={72} className={styles.reviewImage} />
                          ))}
                        </div>
                      </Image.PreviewGroup>
                    )}

                    {item.adminReply ? (
                      <div className={styles.replyBox}>
                        <div className={styles.replyHead}>
                          <Tag color="green">Admin đã phản hồi</Tag>
                          {item.adminReplyAt && <span>{item.adminReplyAt}</span>}
                        </div>
                        <p>{item.adminReply}</p>
                      </div>
                    ) : (
                      <div className={styles.noReply}>Chưa có phản hồi</div>
                    )}
                  </div>

                  <div className={styles.actionCol}>
                    <Button
                      type="primary"
                      icon={<MessageOutlined />}
                      className={styles.primaryAction}
                      onClick={() => openReply(item)}
                    >
                      {item.adminReply ? 'Sửa phản hồi' : 'Phản hồi'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Spin>
      </div>

      <Modal
        visible={!!replying}
        className={styles.replyModal}
        title={replying ? `Phản hồi đánh giá: ${replying.dishName || replying.dishId}` : 'Phản hồi đánh giá'}
        okText="Lưu phản hồi"
        cancelText="Huỷ"
        confirmLoading={savingReply}
        onOk={saveReply}
        onCancel={() => setReplying(null)}
        destroyOnClose
      >
        <div className={styles.replyModalReview}>
          <Rate disabled value={replying?.rating || 0} />
          <p>{replying?.comment}</p>
        </div>
        <Input.TextArea
          value={replyText}
          onChange={(event) => setReplyText(event.target.value)}
          autoSize={{ minRows: 4, maxRows: 8 }}
          maxLength={1000}
          showCount
          placeholder="Nhập phản hồi của admin..."
        />
      </Modal>
    </>
  );
};

export default AdminDanhGia;
