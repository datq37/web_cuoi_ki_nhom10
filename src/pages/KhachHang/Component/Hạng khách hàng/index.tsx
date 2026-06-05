import React from 'react';
import { Award } from 'lucide-react';
import { Card, Progress, Typography } from 'antd';

const { Text, Title } = Typography;
import { useModel } from 'umi';
import { formatNumberViVN } from '@/utils/format';
import './index.less';

const RankCard: React.FC = () => {
  const {
    currentPoints,
    nextRank,
    currentRank,
    isMaxRank,
    spentNeeded,
    progressPercent,
  } = useModel('KhachHang.Hạng khách hàng.index');
  return (
    <Card 
      className="reward-card" 
      bordered={false}
      bodyStyle={{ padding: 12 }}
    >
      <div className="reward-icon" style={{ background: currentRank.color, color: '#fff' }}>
        <Award size={28} />
      </div>
      <Text strong style={{ color: 'var(--accent-strong)', fontSize: 11 }}>
        Điểm thưởng ({currentRank.name})
      </Text>
      <Title level={5} style={{ margin: '4px 0 0', color: '#197037', fontSize: 17, fontWeight: 850 }}>
        {formatNumberViVN(currentPoints)} điểm
      </Title>
      
      {isMaxRank ? (
        <Text type="secondary" style={{ display: 'block', fontSize: 11, marginTop: 7, maxWidth: 132 }}>
          Bạn đang ở hạng cao nhất!
        </Text>
      ) : (
        <Text type="secondary" style={{ display: 'block', fontSize: 11, marginTop: 7, maxWidth: 132 }}>
          Cần thêm <Text strong style={{ color: '#273328' }}>{formatNumberViVN(spentNeeded)}đ</Text> chi tiêu để lên hạng {nextRank.name}
        </Text>
      )}

      <Progress 
        percent={Math.min(100, Math.max(0, progressPercent))} 
        showInfo={false} 
        strokeColor={nextRank.color}
        trailColor="rgba(67, 138, 42, 0.18)"
        size="small"
        style={{ marginBottom: 0, marginTop: 8 }}
      />
    </Card>
  );
};

export default RankCard;
