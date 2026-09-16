import React from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  User,
  Wallet
} from 'lucide-react';

const STAIR_DATA = [
  { val: '$1.2M', height: 35, label: '01 SEP' },
  { val: '$2.8M', height: 48, label: '04 SEP' },
  { val: '$4.5M', height: 60, label: '08 SEP' },
  { val: '$7.1M', height: 75, label: '12 SEP' },
  { val: '$11.8M', height: 95, label: '16 SEP' },
];

const OPPORTUNITIES = [
  { pool: 'ETH / USDC Uniswap v3', tvl: '$148.2M', apr: '24.8%', risk: 'Low' },
  { pool: 'SOL / USDT Raydium', tvl: '$89.4M', apr: '38.2%', risk: 'Medium' },
  { pool: 'BTC / WBTC Curve', tvl: '$312.0M', apr: '12.4%', risk: 'Low' },
];

export default function DashboardClimax() {
  return (
    <div className="dashboard-video-exact-container">
      <div className="dashboard-top-glow" />

      {/* TOP STATS HEADER BAR */}
      <div className="video-stats-header">
        <div className="v-stat-item">
          <span className="v-stat-lbl">NETWORK TPS</span>
          <div className="v-stat-flex">
            <span className="v-stat-val">142,890</span>
            <span className="v-badge-green">+14%</span>
          </div>
        </div>

        <div className="v-stat-item">
          <span className="v-stat-lbl">BLOCK HEIGHT</span>
          <span className="v-stat-val">#19,842,109</span>
        </div>

        <div className="v-stat-item">
          <span className="v-stat-lbl">ACTIVE VALIDATORS</span>
          <span className="v-stat-val">4,096</span>
        </div>

        <div className="v-user-profile">
          <span className="user-level-pill">PRO TIER</span>
          <div className="user-avatar-box">
            <User size={14} style={{ marginRight: 6 }} />
            <span>0x8F2...3A4</span>
          </div>
        </div>
      </div>

      {/* MID GRID: STAIRCASE CHART + TOP POOLS TABLE */}
      <div className="dashboard-mid-grid">
        {/* STAIRCASE CHART */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">VOLUME EXPANSION</span>
            <span className="v-badge-green">LIVE</span>
          </div>

          <div className="staircase-chart-container">
            <div className="staircase-bars-wrap">
              {STAIR_DATA.map((item, idx) => (
                <div className="staircase-col" key={idx}>
                  <span className="stair-val-top">{item.val}</span>
                  <div className="stair-block-wrap">
                    <div 
                      className="stair-block-fill" 
                      style={{ height: `${item.height}%` }}
                    />
                  </div>
                  <span className="stair-date-lbl">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TOP POOLS TABLE */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">TOP LIQUIDITY POOLS</span>
          </div>

          <div className="table-custom-wrapper">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>POOL</th>
                  <th>TVL</th>
                  <th>EST. APR</th>
                  <th>RISK</th>
                </tr>
              </thead>
              <tbody>
                {OPPORTUNITIES.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <div className="pool-cell">
                        <span className="pool-dot-icon" />
                        <span>{row.pool}</span>
                      </div>
                    </td>
                    <td className="t-mono">{row.tvl}</td>
                    <td className="t-mono t-green">{row.apr}</td>
                    <td>
                      <span className="v-badge-green" style={{
                        background: row.risk === 'Low' ? 'rgba(39, 201, 63, 0.15)' : 'rgba(255, 170, 0, 0.15)',
                        color: row.risk === 'Low' ? '#27C93F' : '#FFAA00'
                      }}>
                        {row.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
