// Data processing utilities for InsightBI

export interface Project {
  id: string;
  name: string;
  client: string;
  office: string;
  branch: string;
  business: string;
  manager: string;
  startDate: string;
  endDate: string;
  initialBudget: {
    contractAmount: number;
    marginRate: number;
  };
  finalEstimate: {
    contractAmount: number;
    constructionCost: number;
    commonExpenses: number;
    managementCost: number;
    grossProfit: number;
    marginRate: number;
    marginDiff: number;
  };
  currentPeriod: {
    revenue: number;
    cost: number;
    commonExpenses: number;
    managementCost: number;
    grossProfit: number;
    marginRate: number;
  };
  cumulative: {
    revenue: number;
    cost: number;
    costRate: number;
    commonExpenses: number;
    managementCost: number;
    grossProfit: number;
    marginRate: number;
  };
  status: 'good' | 'warning' | 'critical';
}

export interface DashboardData {
  summary: {
    totalContractAmount: number;
    totalGrossProfit: number;
    avgMarginRate: number;
    projectCount: number;
    criticalCount: number;
    warningCount: number;
    goodCount: number;
  };
  projects: Project[];
  byOffice: {
    [office: string]: {
      contractAmount: number;
      grossProfit: number;
      marginRate: number;
      projectCount: number;
    };
  };
  byBranch: {
    [branch: string]: {
      contractAmount: number;
      grossProfit: number;
      marginRate: number;
      projectCount: number;
    };
  };
  byBusiness: {
    [business: string]: {
      contractAmount: number;
      grossProfit: number;
      marginRate: number;
      projectCount: number;
    };
  };
  byManager: {
    [manager: string]: {
      contractAmount: number;
      grossProfit: number;
      marginRate: number;
      projectCount: number;
    };
  };
  marginDistribution: {
    range: string;
    count: number;
    amount: number;
  }[];
}

// Generate demo projects
export function generateDemoProjects(): DashboardData {
  const branches = ['東京本社', '大阪支社', '名古屋支社', '福岡支社', '札幌支社', '海外事業部'];
  const businesses = ['SaaS', 'AI/ML', 'クラウド', 'セキュリティ', 'データ分析', 'コンサル'];

  const projects: Project[] = [];

  // Generate 120 demo projects
  for (let i = 1; i <= 120; i++) {
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const business = businesses[Math.floor(Math.random() * businesses.length)];

    // Base contract amount varies by branch
    const branchMultiplier = branch === '東京本社' ? 1.5 : branch === '海外事業部' ? 1.3 : 1.0;
    const baseContract = (30000000 + Math.random() * 170000000) * branchMultiplier;

    // Margin rate varies by business
    const businessMarginBase = {
      'SaaS': 15,
      'AI/ML': 14,
      'クラウド': 12,
      'セキュリティ': 13,
      'データ分析': 12,
      'コンサル': 11,
    }[business] || 12;

    // Add some variance
    const marginVariance = (Math.random() - 0.5) * 20;
    const initialMarginRate = businessMarginBase + marginVariance * 0.5;
    const finalMarginRate = initialMarginRate + marginVariance * 0.3;

    // Calculate profits
    const contractAmount = Math.round(baseContract);
    const grossProfit = Math.round(contractAmount * (finalMarginRate / 100));

    // Determine status
    let status: 'good' | 'warning' | 'critical' = 'good';
    if (finalMarginRate < 0) status = 'critical';
    else if (finalMarginRate < 10) status = 'warning';

    projects.push({
      id: `PRJ-2025-${String(i).padStart(4, '0')}`,
      name: `案件${String(i).padStart(4, '0')}`,
      client: '',
      office: branch,
      branch: branch,
      business: business,
      manager: '',
      startDate: '',
      endDate: '',
      initialBudget: {
        contractAmount: contractAmount,
        marginRate: initialMarginRate,
      },
      finalEstimate: {
        contractAmount: contractAmount,
        constructionCost: contractAmount * 0.7,
        commonExpenses: contractAmount * 0.1,
        managementCost: contractAmount * 0.05,
        grossProfit: grossProfit,
        marginRate: finalMarginRate,
        marginDiff: finalMarginRate - initialMarginRate,
      },
      currentPeriod: {
        revenue: contractAmount * 0.3,
        cost: contractAmount * 0.25,
        commonExpenses: contractAmount * 0.02,
        managementCost: contractAmount * 0.01,
        grossProfit: grossProfit * 0.3,
        marginRate: finalMarginRate,
      },
      cumulative: {
        revenue: contractAmount * 0.6,
        cost: contractAmount * 0.5,
        costRate: 83,
        commonExpenses: contractAmount * 0.05,
        managementCost: contractAmount * 0.02,
        grossProfit: grossProfit * 0.6,
        marginRate: finalMarginRate,
      },
      status,
    });
  }

  // Calculate summary
  const totalContractAmount = projects.reduce((sum, p) => sum + p.finalEstimate.contractAmount, 0);
  const totalGrossProfit = projects.reduce((sum, p) => sum + p.finalEstimate.grossProfit, 0);
  const avgMarginRate = totalContractAmount > 0 ? (totalGrossProfit / totalContractAmount) * 100 : 0;

  const criticalCount = projects.filter(p => p.status === 'critical').length;
  const warningCount = projects.filter(p => p.status === 'warning').length;
  const goodCount = projects.filter(p => p.status === 'good').length;

  // Group by branch
  const byBranch: DashboardData['byBranch'] = {};
  projects.forEach(p => {
    const branch = p.branch || '未設定';
    if (!byBranch[branch]) {
      byBranch[branch] = { contractAmount: 0, grossProfit: 0, marginRate: 0, projectCount: 0 };
    }
    byBranch[branch].contractAmount += p.finalEstimate.contractAmount;
    byBranch[branch].grossProfit += p.finalEstimate.grossProfit;
    byBranch[branch].projectCount += 1;
  });
  Object.keys(byBranch).forEach(branch => {
    byBranch[branch].marginRate = byBranch[branch].contractAmount > 0
      ? (byBranch[branch].grossProfit / byBranch[branch].contractAmount) * 100
      : 0;
  });

  // Group by business
  const byBusiness: DashboardData['byBusiness'] = {};
  projects.forEach(p => {
    const business = p.business || '未設定';
    if (!byBusiness[business]) {
      byBusiness[business] = { contractAmount: 0, grossProfit: 0, marginRate: 0, projectCount: 0 };
    }
    byBusiness[business].contractAmount += p.finalEstimate.contractAmount;
    byBusiness[business].grossProfit += p.finalEstimate.grossProfit;
    byBusiness[business].projectCount += 1;
  });
  Object.keys(byBusiness).forEach(business => {
    byBusiness[business].marginRate = byBusiness[business].contractAmount > 0
      ? (byBusiness[business].grossProfit / byBusiness[business].contractAmount) * 100
      : 0;
  });

  // Margin distribution
  const marginRanges = [
    { range: '赤字（0%未満）', min: -Infinity, max: 0 },
    { range: '0-5%', min: 0, max: 5 },
    { range: '5-10%', min: 5, max: 10 },
    { range: '10-15%', min: 10, max: 15 },
    { range: '15%以上', min: 15, max: Infinity },
  ];

  const marginDistribution = marginRanges.map(({ range, min, max }) => {
    const matching = projects.filter(p => {
      const rate = p.finalEstimate.marginRate;
      return rate >= min && rate < max;
    });
    return {
      range,
      count: matching.length,
      amount: matching.reduce((sum, p) => sum + p.finalEstimate.contractAmount, 0),
    };
  });

  return {
    summary: {
      totalContractAmount,
      totalGrossProfit,
      avgMarginRate,
      projectCount: projects.length,
      criticalCount,
      warningCount,
      goodCount,
    },
    projects: projects.sort((a, b) => {
      const statusOrder = { critical: 0, warning: 1, good: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }),
    byOffice: byBranch,
    byBranch,
    byBusiness,
    byManager: {},
    marginDistribution,
  };
}
