from sqlalchemy import create_engine, text
engine = create_engine('postgresql://postgres:123456 @localhost:5432/canteen_db')
with engine.begin() as conn:
    conn.execute(text("UPDATE nhanvien SET email = manv || '@canteen.vn', sodienthoai = '090' || CAST(tuoi AS VARCHAR) || '000', ngaybatdau = '01/01/2023', viettat = SUBSTRING(ten FROM 1 FOR 2), maunen = '#f9a8d4', hoatdonggannhat = 'Vừa xong' WHERE email IS NULL"))
print('Done')
