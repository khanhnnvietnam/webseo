'use server';

import { getActionableInsights } from '@/ai/flows/actionable-insights';
import type { OnPageData, TechnicalData } from './types';

export async function generateActionableInsights(
  onPageData: OnPageData,
  technicalData: TechnicalData
): Promise<string> {
  try {
    const onPageSeoData = JSON.stringify(onPageData, null, 2);
    const technicalSeoData = JSON.stringify(technicalData, null, 2);
    
    const result = await getActionableInsights({ onPageSeoData, technicalSeoData });
    return result.recommendations;
  } catch (error) {
    console.error('Error generating insights:', error);
    return 'Chúng tôi không thể tạo thông tin chi tiết do AI cung cấp vào lúc này. Vui lòng kiểm tra thiết lập của bạn và thử lại.';
  }
}
