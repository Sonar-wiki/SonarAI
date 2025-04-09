import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box, Text, Flex, Select, Heading, Card, useColorModeValue } from '@chakra-ui/react';
import { marketAnalytics, WhalePattern } from '../../services/analytics/marketAnalytics';

interface WhaleActivityChartProps {
  token: string;
  timeframe?: '24h' | '7d' | '30d';
  height?: number | string;
  showLegend?: boolean;
  showControls?: boolean;
}

interface ActivityDataPoint {
  time: string;
  buyVolume: number;
  sellVolume: number;
  netFlow: number;
}

const WhaleActivityChart: React.FC<WhaleActivityChartProps> = ({
  token = 'SOL',
  timeframe = '24h',
  height = 300,
  showLegend = true,
  showControls = true,
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'24h' | '7d' | '30d'>(timeframe);
  const [activityData, setActivityData] = useState<ActivityDataPoint[]>([]);
  const [whalePatterns, setWhalePatterns] = useState<WhalePattern[]>([]);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const buyColor = useColorModeValue('#38A169', '#68D391');
  const sellColor = useColorModeValue('#E53E3E', '#FC8181');
  const netColor = useColorModeValue('#3182CE', '#63B3ED');
  
  // Generate mock data based on token and timeframe
  useEffect(() => {
    const generateMockData = () => {
      const data: ActivityDataPoint[] = [];
      const pointCount = activeTimeframe === '24h' ? 24 : activeTimeframe === '7d' ? 28 : 30;
      
      const tokenMultiplier = token === 'SOL' ? 10000 : token === 'BONK' ? 500000000 : 1000;
      const baseValue = token === 'SOL' ? 5000 : token === 'BONK' ? 100000000 : 2000;
      
      const now = new Date();
      
      for (let i = 0; i < pointCount; i++) {
        const date = new Date();
        if (activeTimeframe === '24h') {
          date.setHours(now.getHours() - (pointCount - i));
        } else {
          date.setDate(now.getDate() - (pointCount - i));
        }
        
        const timeLabel = activeTimeframe === '24h' 
          ? `${date.getHours()}:00` 
          : `${date.getMonth() + 1}/${date.getDate()}`;
        
        // Create some patterns in the data
        const dayFactor = Math.sin(i / (pointCount / 3) * Math.PI) * 0.5 + 0.5;
        const randomFactor = Math.random() * 0.8 + 0.6;
        
        // Make sell and buy volumes related but not identical
        let buyVolume = Math.round(baseValue * (dayFactor * 1.5 + 0.5) * randomFactor);
        let sellVolume = Math.round(baseValue * (dayFactor * 0.8 + 0.2) * randomFactor);
        
        // Occasionally create spikes to simulate whale activity
        if (i % 7 === 0) {
          buyVolume = buyVolume * (Math.random() > 0.5 ? 2.5 : 1);
        } else if (i % 5 === 0) {
          sellVolume = sellVolume * (Math.random() > 0.6 ? 3 : 1);
        }
        
        data.push({
          time: timeLabel,
          buyVolume: buyVolume * tokenMultiplier,
          sellVolume: sellVolume * tokenMultiplier,
          netFlow: (buyVolume - sellVolume) * tokenMultiplier
        });
      }
      
      return data;
    };
    
    setActivityData(generateMockData());
    
    // Get whale patterns from analytics engine
    const patterns = marketAnalytics.detectWhalePatterns(
      activeTimeframe === '24h' ? 24 : activeTimeframe === '7d' ? 168 : 720
    );
    
    // Filter patterns relevant to current token
    setWhalePatterns(patterns.filter(p => p.relatedTokens.includes(token)));
    
  }, [token, activeTimeframe]);
  
  const formatNumber = (num: number) => {
    if (Math.abs(num) >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    } else if (Math.abs(num) >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (Math.abs(num) >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(0);
  };
  
  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveTimeframe(e.target.value as '24h' | '7d' | '30d');
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card p={3} bg={cardBg} borderWidth="1px" borderRadius="md" boxShadow="md">
          <Text fontWeight="bold" mb={2}>{label}</Text>
          <Flex direction="column" gap={1}>
            <Text color={buyColor}>
              买入: {formatNumber(payload[0].value)}
            </Text>
            <Text color={sellColor}>
              卖出: {formatNumber(payload[1].value)}
            </Text>
            <Text color={netColor} fontWeight="bold">
              净流入: {formatNumber(payload[2].value)}
            </Text>
          </Flex>
        </Card>
      );
    }
    return null;
  };
  
  return (
    <Card p={4} borderRadius="lg" boxShadow="md" bg={cardBg} height={height}>
      <Flex direction="column" h="100%">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md" color={textColor}>
            {token} 鲸鱼活动
          </Heading>
          
          {showControls && (
            <Select 
              value={activeTimeframe}
              onChange={handleTimeframeChange}
              width="auto"
              size="sm"
            >
              <option value="24h">24小时</option>
              <option value="7d">7天</option>
              <option value="30d">30天</option>
            </Select>
          )}
        </Flex>
        
        {whalePatterns.length > 0 && (
          <Box mb={3}>
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              检测到的鲸鱼模式:
            </Text>
            {whalePatterns.map(pattern => (
              <Text key={pattern.id} fontSize="sm" color={pattern.estimatedImpact === 'high' ? 'red.500' : pattern.estimatedImpact === 'medium' ? 'orange.500' : 'blue.500'}>
                • {pattern.name}: {pattern.description}
              </Text>
            ))}
          </Box>
        )}
        
        <Box flex="1" minHeight="200px">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activityData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis 
                tickFormatter={formatNumber} 
                tick={{ fontSize: 12 }}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && (
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value: string) => {
                    return value === 'buyVolume' ? '买入量' : 
                           value === 'sellVolume' ? '卖出量' : '净流入';
                  }}
                />
              )}
              <Area 
                type="monotone" 
                dataKey="buyVolume" 
                stackId="1"
                stroke={buyColor} 
                fill={buyColor} 
                fillOpacity={0.3}
                name="buyVolume"
              />
              <Area 
                type="monotone" 
                dataKey="sellVolume" 
                stackId="2"
                stroke={sellColor} 
                fill={sellColor} 
                fillOpacity={0.3}
                name="sellVolume"
              />
              <Area 
                type="monotone" 
                dataKey="netFlow" 
                stroke={netColor} 
                fill="none"
                strokeWidth={2}
                name="netFlow"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Flex>
    </Card>
  );
};

export default WhaleActivityChart; 