from sqlalchemy import create_engine, text
engine = create_engine('postgresql://postgres:123456 @localhost:5432/canteen_db')
with engine.begin() as conn:
    conn.execute(text("UPDATE khuyenmai SET ma = 'KM' || id, mota = 'Khuyen mai ' || ten, loai = 'phan_tram', giatrigiam = 10, dontooithieu = 50000, dadung = 0, gioihan = 100, trangthai = 'dang_chay', hoatdong = 1 WHERE ma IS NULL"))
print('Done')
