import MainDashboard from '@/components/MainDashboard';
import { generateDemoProjects } from '@/lib/processData';
import performanceData from '@/data/performance.json';
import { PerformanceData } from '@/lib/types';

// Generate demo data at build time
const diData = generateDemoProjects();

export default function Page() {
  return (
    <MainDashboard
      performanceData={performanceData as PerformanceData}
      diData={diData}
    />
  );
}
